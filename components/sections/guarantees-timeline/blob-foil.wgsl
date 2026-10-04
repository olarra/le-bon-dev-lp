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

fn sweepDistance(p: vec2f, lightCenter: vec2f) -> f32 {
  return dot(p - lightCenter, vec2f(0.72, 0.52)) + sin(p.y * 4.0 + p.x * 3.0) * 0.08;
}

fn starReflection(p: vec2f, center: vec2f, lightCenter: vec2f, aa: f32) -> f32 {
  let offset = p - center;
  let q = abs(vec2f(offset.x * 0.95 - offset.y * 0.31, offset.x * 0.31 + offset.y * 0.95));
  let width = max(aa * 0.55, 0.0015);
  let arms = width / (min(q.x, q.y) + width);
  let shape = arms * arms * (1.0 - smoothstep(0.002, 0.065, length(q)));
  let distance = sweepDistance(center, lightCenter) / 0.075;
  let delta = (center - lightCenter) * vec2f(0.9, 0.68);
  return shape * exp(-distance * distance - dot(delta, delta) * 1.1);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.0;
  let aa = max(length(fwidth(p)), 0.0006);
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
  let lightAndView = vec2f(dot(lightDirection + viewDirection, right), dot(lightDirection + viewDirection, down));
  let illumination = max(dot(normal, lightDirection), 0.0) * max(dot(normal, viewDirection), 0.0);
  let lightCenter = vec2f(dot(lamp, right), dot(lamp, down));
  let delta = p - lightCenter;
  let intensity = clamp(params.intensity, 0.0, 1.0);
  let sweep = sweepDistance(p, lightCenter);
  let bandDistance = sweep / 0.36;
  let glintDistance = sweep / 0.085;
  let lightBand = exp(-bandDistance * bandDistance);
  let glint = exp(-glintDistance * glintDistance);
  let spotDelta = delta * vec2f(0.9, 0.68);
  let spotlight = exp(-dot(spotDelta, spotDelta) * 1.1);
  let light = lightBand * spotlight * intensity;

  let contour = etchedPhase(p);
  let dx = dpdx(p);
  let dy = dpdy(p);
  let gradient = vec2f(dpdx(contour) * dy.y - dpdy(contour) * dx.y, dpdy(contour) * dx.x - dpdx(contour) * dy.x);
  let across = gradient / max(length(gradient), 0.00000001);
  let spectral = diffraction(across, lightAndView, 1.65) * illumination;
  let contours = stroke(sin(contour), 0.06, min(fwidth(contour), 1.0));
  let reveal = intensity * (0.18 * spotlight + light * 1.25);
  let pearlPhase = dot(lightAndView, vec2f(0.48, -0.32)) + p.y * 0.32 + contour * 0.003;
  let pearl = pearlColor(pearlPhase);
  let foilPhase = etchedPhase(p - vec2f(0.007, -0.004) - params.tilt * 0.012);
  let echo = stroke(sin(foilPhase), 0.025, min(fwidth(foilPhase), 1.0));
  let noise = grain(p + vec2f(2));
  let sparkle = pow(max(noise + 0.5, 0.0), 24.0) * glint * spotlight * intensity;

  // Match the cards' metal response while leaving the morphing SVG base visible.
  let tint = vec3f(0.72, 0.76, 0.8);
  var reflection = light * (vec3f(0.045) + tint * 0.065);
  reflection += noise * light * 0.085;
  reflection += pearl * light * 0.24;
  reflection += (pearl * 0.5 + vec3f(0.5)) * glint * spotlight * intensity * 0.20;
  reflection += pearl * sparkle * 0.22;
  let etchedFoil = vec3f(0.12, 0.14, 0.18) + pearl * 0.65 + spectral * 0.12;
  reflection += contours * 0.65 * etchedFoil * reveal;
  reflection += echo * 0.65 * (pearl + spectral * 0.2) * reveal * 0.22;

  let grid = (fract((p + 1.0) * 20.0) - 0.5) / 20.0;
  let dots = stroke(length(grid), 0.0008, aa * 0.4);
  reflection += dots * reveal * 0.12;
  // Facets near the exposed edges catch the same scroll-driven lamp.
  let stars = starReflection(p, vec2f(-0.68, 0.05), lightCenter, aa)
    + starReflection(p, vec2f(0.70, 0.14), lightCenter, aa)
    + starReflection(p, vec2f(-0.14, 0.60), lightCenter, aa);
  reflection += mix(vec3f(1.0, 0.98, 0.9), pearl, 0.2) * stars * intensity * 0.65;

  // Premultiplied alpha follows the light's peak channel, preserving spectral
  // contrast instead of muting the entire reflection with a translucent wash.
  let color = clamp(reflection, vec3f(0), vec3f(1));
  let alpha = max(color.r, max(color.g, color.b));
  return vec4f(color, alpha);
}
