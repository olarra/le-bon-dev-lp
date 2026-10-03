// Adapted from vgpu's Holographic Card (MIT, Copyright 2025 Vercel, Inc.).
// Complete, unmodified example and license: /holographic-card.
// The HTML card supplies the silhouette, illustration and translated lettering.
struct Params {
  resolution: vec2f,
  tilt: vec2f,
  pointer: vec2f,
  intensity: f32,
  material: vec3f,
  radius: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn roundedBox(p: vec2f, halfSize: vec2f, radius: f32) -> f32 {
  let q = abs(p) - halfSize + radius;
  return length(max(q, vec2f(0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn stroke(distance: f32, width: f32, aa: f32) -> f32 {
  return 1.0 - smoothstep(width, width + aa, abs(distance));
}

fn wavelengthColor(wavelength: f32) -> vec3f {
  let response = (vec3f(wavelength) - vec3f(0.610, 0.545, 0.460)) / vec3f(0.045, 0.038, 0.032);
  let visible = smoothstep(0.380, 0.410, wavelength) * (1.0 - smoothstep(0.700, 0.780, wavelength));
  return exp(-0.5 * response * response) * visible;
}

// The reference's reflection grating: m * wavelength = d * dot(L + V, across).
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
  return radius * 142.0 + sin(atan2(q.y, q.x) * 3.0 + radius * 8.0) * 1.7;
}

fn sweepDistance(p: vec2f, lightCenter: vec2f) -> f32 {
  // A curved grazing reflection travels mostly vertically across the tall card.
  return dot(p - lightCenter, vec2f(0.45, 0.9)) + sin(p.y * 4.0 + p.x * 3.0) * 0.08;
}

fn starReflection(p: vec2f, center: vec2f, aa: f32) -> f32 {
  let offset = p - center;
  let q = abs(vec2f(offset.x * 0.95 - offset.y * 0.31, offset.x * 0.31 + offset.y * 0.95));
  let width = max(aa * 0.55, 0.0015);
  let arms = width / (min(q.x, q.y) + width);
  let shape = arms * arms * (1.0 - smoothstep(0.002, 0.065, length(q)));
  let distance = sweepDistance(center, params.pointer) / 0.075;
  let delta = (center - params.pointer) * vec2f(0.78, 0.56);
  // Fixed metal facets catch the same lamp; no independent twinkling animation.
  return shape * exp(-distance * distance - dot(delta, delta) * 2.0);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let resolution = max(params.resolution, vec2f(1));
  let halfSize = vec2f(0.64, 0.64 * resolution.y / resolution.x);
  let p = (uv - 0.5) * halfSize * 2.0;
  let aa = max(length(fwidth(p)), 0.0006);
  let sx = sin(params.tilt.y);
  let cx = cos(params.tilt.y);
  let sy = sin(params.tilt.x);
  let cy = cos(params.tilt.x);
  let right = vec3f(cy, 0, -sy);
  let down = vec3f(sy * sx, cx, cy * sx);
  let normal = cross(right, down);
  let hit = right * p.x + down * p.y;
  let eye = vec3f(0, 0, 4.5);
  let lightCenter = params.pointer;
  let delta = p - lightCenter;
  let hover = clamp(params.intensity, 0.0, 1.0);
  let sweep = sweepDistance(p, lightCenter);
  let bandDistance = sweep / 0.36;
  let lightBand = exp(-bandDistance * bandDistance);
  let glintDistance = sweep / 0.085;
  let glint = exp(-glintDistance * glintDistance);
  let spotDelta = delta * vec2f(0.78, 0.56);
  let spotlight = exp(-dot(spotDelta, spotDelta) * 2.0);
  let light = lightBand * spotlight * hover;
  let lightDirection = normalize(vec3f(lightCenter, 1.2) - hit);
  let viewDirection = normalize(eye - hit);
  let lightAndView = vec2f(dot(lightDirection + viewDirection, right), dot(lightDirection + viewDirection, down));
  let illumination = max(dot(normal, lightDirection), 0.0) * max(dot(normal, viewDirection), 0.0);
  let tint = vec3f(0.72, 0.76, 0.8);
  let noise = grain(p + vec2f(2));
  var color = params.material + 0.008 * (1.0 - uv.y);
  color += noise * (0.022 + light * 0.085);
  color += light * (vec3f(0.045) + tint * 0.065);

  // Keep the reference's engraved waves, microscopic diffraction and spectral
  // echo. The pattern stays on the metal and emerges only around the lamp.
  let contour = etchedPhase(p);
  let dx = dpdx(p);
  let dy = dpdy(p);
  let gradient = vec2f(dpdx(contour) * dy.y - dpdy(contour) * dx.y, dpdy(contour) * dx.x - dpdx(contour) * dy.x);
  let across = gradient / max(length(gradient), 0.00000001);
  let spectral = diffraction(across, lightAndView, 1.65) * illumination;
  let contours = stroke(sin(contour), 0.06, min(fwidth(contour), 1.0));
  let reveal = hover * (0.18 * spotlight + light * 1.25);
  let pearlPhase = dot(lightAndView, vec2f(0.48, -0.32)) + p.y * 0.32 + contour * 0.003;
  let pearl = pearlColor(pearlPhase);
  color += pearl * light * 0.24;
  color += (pearl * 0.5 + vec3f(0.5)) * glint * spotlight * hover * 0.20;
  let sparkle = pow(max(noise + 0.5, 0.0), 24.0) * glint * spotlight * hover;
  color += pearl * sparkle * 0.22;
  let etchedFoil = vec3f(0.12, 0.14, 0.18) + pearl * 0.65 + spectral * 0.12;
  color += contours * 0.65 * etchedFoil * reveal;

  let foilOffset = vec2f(0.007, -0.004) + params.tilt * 0.012;
  let foilPhase = etchedPhase(p - foilOffset);
  let foilLines = stroke(sin(foilPhase), 0.025, min(fwidth(foilPhase), 1.0));
  color += foilLines * 0.65 * (pearl + spectral * 0.2) * reveal * 0.22;

  let grid = (fract((p + 1.0) * 20.0) - 0.5) / 20.0;
  let dots = stroke(length(grid), 0.0008, aa * 0.4);
  color += dots * reveal * 0.12;
  let stars = starReflection(p, vec2f(-0.53, -halfSize.y * 0.65), aa)
    + starReflection(p, vec2f(0.53, -halfSize.y * 0.04), aa)
    + starReflection(p, vec2f(-0.52, halfSize.y * 0.68), aa);
  color += mix(vec3f(1.0, 0.98, 0.9), pearl, 0.2) * stars * hover * 0.65;

  let edge = roundedBox(p, halfSize, params.radius);
  let rim = stroke(edge + 0.002, 0.0008, aa * 0.7);
  let rimLight = pow(max(0.0, 1.0 - length(delta) * 0.65), 3.0) * hover;
  color = mix(color, vec3f(0.25, 0.28, 0.32) + (pearl * 0.7 + tint * 0.3) * rimLight * 0.6, rim);
  return vec4f(clamp(color, vec3f(0), vec3f(1)), 1);
}
