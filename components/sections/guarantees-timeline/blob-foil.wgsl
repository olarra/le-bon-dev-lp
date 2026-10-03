// Adapted from vgpu's Holographic Card (MIT, Copyright 2025 Vercel, Inc.).
// Original source and license: /holographic-card.
// SVG owns the blob silhouette. Mobile metal cards use card-foil.wgsl.
// The illuminated material keeps its engraving fixed in local coordinates.
struct Params {
  resolution: vec2f,
  tilt: vec2f,
  pointer: vec2f,
  intensity: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn stroke(distance: f32, width: f32, aa: f32) -> f32 {
  return 1.0 - smoothstep(width, width + aa, abs(distance));
}

fn wavelengthColor(wavelength: f32) -> vec3f {
  let response = (vec3f(wavelength) - vec3f(0.610, 0.545, 0.460)) / vec3f(0.045, 0.038, 0.032);
  let visible = smoothstep(0.380, 0.410, wavelength) * (1.0 - smoothstep(0.700, 0.780, wavelength));
  return exp(-0.5 * response * response) * visible;
}

// The example's reflection-grating approximation (GPU Gems, chapter 8).
fn diffraction(across: vec2f, lightAndView: vec2f, spacing: f32) -> vec3f {
  let pathDifference = spacing * abs(dot(lightAndView, across));
  let along = dot(lightAndView, vec2f(-across.y, across.x));
  let envelope = exp(-along * along / 0.36);
  var reflected = vec3f(0);
  for (var order = 1; order <= 3; order++) {
    let m = f32(order);
    reflected += wavelengthColor(pathDifference / m) / (m * m);
  }
  return reflected * envelope;
}

fn pearlColor(phase: f32) -> vec3f {
  return vec3f(0.55, 0.52, 0.64) + vec3f(0.43, 0.40, 0.34)
    * cos(6.2831853 * (phase + vec3f(0.05, 0.38, 0.63)));
}

fn grain(point: vec2f) -> f32 {
  let p = vec2u(abs(point) * 2400.0);
  var n = (p.x * 1597334677u) ^ (p.y * 3812015801u);
  n = (n ^ (n >> 16u)) * 2246822519u;
  return f32(n & 1023u) / 1023.0 - 0.5;
}

fn etchedPhase(p: vec2f) -> f32 {
  let warp = vec2f(
    sin(p.y * 7.0 + sin(p.x * 4.0)) * 0.085,
    sin(p.x * 6.0 - p.y * 3.0) * 0.07
  );
  let q = p + warp - vec2f(0.13, 0.08);
  let radius = length(q * vec2f(1.0, 0.76));
  // Restore the original fine engraving, rather than the small Hero card's 52.
  return radius * 142.0 + sin(atan2(q.y, q.x) * 3.0 + radius * 8.0) * 1.7;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.0;
  let sx = sin(params.tilt.y);
  let cx = cos(params.tilt.y);
  let sy = sin(params.tilt.x);
  let cy = cos(params.tilt.x);
  let right = vec3f(cy, 0, -sy);
  let down = vec3f(sy * sx, cx, cy * sx);
  let normal = cross(right, down);
  let hit = right * p.x + down * p.y;
  let lamp = vec3f(params.pointer, 1.2);
  let eye = vec3f(0, 0, 4.5);
  let lightDirection = normalize(lamp - hit);
  let viewDirection = normalize(eye - hit);
  let halfVector = normalize(lightDirection + viewDirection);
  let lightAndView = vec2f(dot(lightDirection + viewDirection, right), dot(lightDirection + viewDirection, down));
  let illumination = max(dot(normal, lightDirection), 0.0) * max(dot(normal, viewDirection), 0.0);
  let specular = pow(max(dot(normal, halfVector), 0.0), 24.0);
  let lightCenter = vec2f(dot(lamp, right), dot(lamp, down));
  let delta = p - lightCenter;
  let sweepDistance = dot(delta, vec2f(0.72, 0.52)) + sin(p.y * 4.0 + p.x * 3.0) * 0.08;
  let bandDistance = sweepDistance / 0.42;
  let glintDistance = sweepDistance / 0.095;
  let lightBand = exp(-bandDistance * bandDistance);
  let glint = exp(-glintDistance * glintDistance);
  let spotDelta = delta * vec2f(0.9, 0.68);
  let spotlight = exp(-dot(spotDelta, spotDelta) * 1.1);
  let light = lightBand * spotlight * params.intensity * (0.4 + specular * 0.6);

  let contour = etchedPhase(p);
  let dx = dpdx(p);
  let dy = dpdy(p);
  let gradient = vec2f(dpdx(contour) * dy.y - dpdy(contour) * dx.y, dpdy(contour) * dx.x - dpdx(contour) * dy.x);
  let across = gradient / max(length(gradient), 0.00000001);
  let spectral = diffraction(across, lightAndView, 1.65) * illumination;
  let contours = stroke(sin(contour), 0.06, min(fwidth(contour), 1.0));
  let pearlPhase = dot(lightAndView, vec2f(0.48, -0.32)) + p.y * 0.32 + contour * 0.003;
  let pearl = pearlColor(pearlPhase);
  let foilPhase = etchedPhase(p - vec2f(0.007, -0.004) - params.tilt * 0.012);
  let echo = stroke(sin(foilPhase), 0.025, min(fwidth(foilPhase), 1.0));
  let sparkle = pow(max(grain(p + vec2f(2)) + 0.5, 0.0), 24.0) * glint * spotlight * params.intensity;

  // The moving reflection also lights the space BETWEEN the engraved lines.
  // A broad pearl wash, a silver flash, then finer foil detail; no opacity wipe.
  let wash = light * 0.3;
  let flash = glint * spotlight * params.intensity * 0.24;
  let lines = contours * (0.008 + light * 0.22);
  let echoLight = echo * light * 0.045;
  let sparkLight = sparkle * 0.08;
  let alpha = min(wash + flash + lines + echoLight + sparkLight, 0.7);
  let reflection = mix(pearl, vec3f(0.8, 0.88, 0.84), 0.25) * wash
    + (pearl * 0.32 + vec3f(0.68)) * flash
    + clamp(pearl * 0.65 + spectral * 0.2 + vec3f(0.14), vec3f(0), vec3f(1)) * lines
    + pearl * echoLight + vec3f(sparkLight);
  return vec4f(clamp(reflection, vec3f(0), vec3f(alpha)), alpha);
}
