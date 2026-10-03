// Adapted from vgpu's Holographic Card (MIT, Copyright 2025 Vercel, Inc.).
// Original: https://vgpu.sh/examples/holographic-card/source.md
// License: /holographic-card/LICENSE
// Keep the etched foil, diffraction and pearlescence; output only transparent
// reflections so the existing card background and DOM logo stay intact.
struct Params {
  resolution: vec2f,
  pointer: vec2f,
  direction: vec2f,
  hover: f32,
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

// Reflection grating approximation from the example, based on GPU Gems ch. 8.
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
  // Wider engraving than the large demo card, readable on a 158 × 100 surface.
  return radius * 52.0 + sin(atan2(q.y, q.x) * 3.0 + radius * 8.0) * 1.7;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.0;
  let aa = max(length(fwidth(p)), 0.0006);
  let edge = roundedBox(p, vec2f(aspect, 1.0), 0.8);
  let silhouette = 1.0 - smoothstep(-aa, 0.0, edge);
  let hover = clamp(params.hover, 0.0, 1.0);
  let delta = p - params.pointer;
  // One wide bulb in screen space. Its radius is converted to this card's
  // coordinates by the renderer, so it also reaches cards before hover.
  let radius = max(params.radius, 0.01);
  let distanceToLight = length(delta) / radius;
  let spotlight = 1.0 - smoothstep(0.12, 1.0, distanceToLight);
  let sweepDistance = dot(delta, params.direction) + sin(p.y * 4.0 + p.x * 3.0) * 0.08;
  let bandDistance = sweepDistance / (radius * 0.55);
  let lightBand = exp(-bandDistance * bandDistance);
  let glintDistance = sweepDistance / (radius * 0.18);
  let glint = exp(-glintDistance * glintDistance);
  let light = lightBand * spotlight * hover;

  let lightDirection = normalize(vec3f(params.pointer - p, radius * 0.65));
  let viewDirection = normalize(vec3f(-p, 4.5));
  let lightAndView = (lightDirection + viewDirection).xy;
  let illumination = max(lightDirection.z, 0.0) * max(viewDirection.z, 0.0);
  let contour = etchedPhase(p);
  let dx = dpdx(p);
  let dy = dpdy(p);
  let gradient = vec2f(dpdx(contour) * dy.y - dpdy(contour) * dx.y, dpdy(contour) * dx.x - dpdx(contour) * dy.x);
  let across = gradient / max(length(gradient), 0.00000001);
  let spectral = diffraction(across, lightAndView, 1.65) * illumination;
  let contours = stroke(sin(contour), 0.06, min(fwidth(contour), 1.0));
  let reveal = hover * spotlight * (0.24 + lightBand * 0.9);
  let pearlPhase = dot(lightAndView, vec2f(0.48, -0.32)) + p.y * 0.32 + contour * 0.003;
  let pearl = pearlColor(pearlPhase);

  // A surface-locked spectral echo and grain: no autonomous animated noise.
  let echoPhase = etchedPhase(p - vec2f(0.014, -0.008));
  let echo = stroke(sin(echoPhase), 0.025, min(fwidth(echoPhase), 1.0));
  let sparkle = pow(max(grain(p + vec2f(2)) + 0.5, 0.0), 24.0) * glint * spotlight * hover;
  let rim = stroke(edge + 0.012, 0.004, aa * 0.65) * spotlight * hover;
  let alpha = clamp(light * 0.08 + (contours * 0.42 + echo * 0.10) * reveal
    + glint * spotlight * hover * 0.09 + sparkle * 0.06 + rim * 0.14, 0.0, 0.58) * silhouette;
  let color = clamp(pearl * 0.78 + spectral * 0.22 + vec3f(0.15)
    + vec3f(glint * 0.07), vec3f(0), vec3f(1));
  // Premultiplied alpha keeps the area outside the foil completely transparent.
  return vec4f(color * alpha, alpha);
}
