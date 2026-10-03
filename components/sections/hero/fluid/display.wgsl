import { index_of } from "./fluid-common.wgsl";

struct DisplayConfig {
  output_size: vec2f,
}
const DYE_SIZE = vec2u(512, 288);
@group(0) @binding(0) var<uniform> config: DisplayConfig;
@group(0) @binding(1) var<storage, read> dye: array<vec4f>;

fn sample_dye(p: vec2f) -> vec4f {
  let grid = clamp(p * vec2f(DYE_SIZE) - 0.5, vec2f(0), vec2f(DYE_SIZE) - 1.0);
  let cell = vec2i(floor(grid));
  let f = fract(grid);
  let bottom = mix(dye[index_of(cell, DYE_SIZE)], dye[index_of(cell + vec2i(1, 0), DYE_SIZE)], f.x);
  let top = mix(dye[index_of(cell + vec2i(0, 1), DYE_SIZE)], dye[index_of(cell + vec2i(1, 1), DYE_SIZE)], f.x);
  return mix(bottom, top, f.y);
}

@fragment
fn fragment_main(@builtin(position) position: vec4f) -> @location(0) vec4f {
  var uv = position.xy / config.output_size;
  uv.y = 1.0 - uv.y; // WebGPU fragment coordinates start at the top; the solver's +Y points up.
  let density = sample_dye(uv);
  // The same dye and tone curve, composited over the existing light backdrop.
  // Premultiplication leaves unpainted areas transparent, without a black rectangle.
  let color = clamp(density.rgb / max(density.a, 0.0001), vec3f(0), vec3f(1));
  let edge = smoothstep(0.0, 0.055, uv.y) * (1.0 - smoothstep(0.94, 1.0, uv.y));
  let alpha = (1.0 - exp(-density.a * 1.35)) * 0.62 * edge;
  return vec4f(color * alpha, alpha);
}
