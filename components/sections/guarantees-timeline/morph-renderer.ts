// The validated POC shader: mix transparent PNGs in premultiplied alpha space.
const VERTEX = `
attribute vec2 position;
varying vec2 vUv;
void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}
`;

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uStrength;
uniform float uScaleFrom;
uniform float uScaleTo;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
vec2 rotate2(vec2 p,float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c)*p;}
vec4 sampleImage(sampler2D tex,vec2 uv,float scale){
 uv=(uv-.5)/scale+.5;
 if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.) return vec4(0.);
 vec4 col=texture2D(tex,uv);return vec4(col.rgb*col.a,col.a);
}
void main(){
 float t=clamp(uProgress,0.,1.);
 float pulse=sin(t*3.14159265);
 vec2 p=vUv-.5;
 float n=noise(vUv*4.2+vec2(.7,1.4));
 vec2 flow=vec2(sin(p.y*7.0+n*2.2),cos(p.x*6.0-n*1.7));
 float strength=uStrength*pulse;
 // Small contraction, opposing twist and smooth spatial displacement.
 vec2 uvA=rotate2(p*(1.+.11*pulse),.075*strength)+.5+flow*.052*strength*t;
 vec2 uvB=rotate2(p*(1.+.09*pulse),-.075*strength)+.5-flow*.052*strength*(1.-t);
 vec4 a=sampleImage(uFrom,uvA,uScaleFrom);
 vec4 b=sampleImage(uTo,uvB,uScaleTo);
 float field=clamp(.52+(.5-vUv.y)*.34+(n-.5)*.27,.18,.82);
 float reveal=smoothstep(field-.20,field+.20,t);
 // Endpoints are exact: no residual warp, clipping or colour tint.
 gl_FragColor=mix(a,b,reveal);
}
`;

export type MorphRenderer = {
  render: (pair: 0 | 1, progress: number, strength?: number) => void;
  dispose: () => void;
};

type RendererOptions = {
  signal?: AbortSignal;
  onUnavailable?: () => void;
};

const SCALES = [0.98, 0.88, 0.9] as const;

function aborted() {
  return new DOMException("Illustration renderer disposed", "AbortError");
}

function loadImage(src: string, signal: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(aborted());
      return;
    }

    const image = new Image();
    const clearListeners = () => {
      image.onload = null;
      image.onerror = null;
      signal.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      clearListeners();
      image.removeAttribute("src");
      reject(aborted());
    };

    image.onload = () => {
      clearListeners();
      resolve(image);
    };
    image.onerror = () => {
      clearListeners();
      reject(new Error(`Illustration could not load: ${src}`));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    image.src = src;
  });
}

export async function createRenderer(
  canvas: HTMLCanvasElement,
  assets: readonly string[],
  { signal, onUnavailable }: RendererOptions = {},
): Promise<MorphRenderer> {
  if (signal?.aborted) throw aborted();

  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  const loading = new AbortController();
  let observer: ResizeObserver | undefined;
  let resolutionQuery: MediaQueryList | undefined;
  let disposed = false;
  let unavailable = false;
  let current: [0 | 1, number, number] = [0, 0, 1];
  // This module can be imported during SSR; browser objects are only used here.
  const ownerWindow = canvas.ownerDocument.defaultView;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    loading.abort();
    signal?.removeEventListener("abort", dispose);
    canvas.removeEventListener("webglcontextlost", onContextLoss);
    observer?.disconnect();
    ownerWindow?.removeEventListener("resize", redraw);
    resolutionQuery?.removeEventListener("change", onResolutionChange);
    if (gl) {
      // A current program stays alive after deleteProgram until unbound.
      gl.useProgram(null);
      textures.forEach((texture) => gl!.deleteTexture(texture));
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach((shader) => gl!.deleteShader(shader));
    }
  };

  const reportUnavailable = () => {
    if (unavailable || signal?.aborted) return;
    unavailable = true;
    onUnavailable?.();
  };

  const onContextLoss = (event: Event) => {
    event.preventDefault();
    // Keep the static illustration after context loss; no invisible RAF loop.
    dispose();
    reportUnavailable();
  };

  let render: MorphRenderer["render"] = () => {};
  function redraw() {
    if (!disposed) render(...current);
  }
  function watchResolution() {
    resolutionQuery?.removeEventListener("change", onResolutionChange);
    resolutionQuery = ownerWindow?.matchMedia(
      `(resolution: ${ownerWindow.devicePixelRatio || 1}dppx)`,
    );
    resolutionQuery?.addEventListener("change", onResolutionChange);
  }
  function onResolutionChange() {
    if (disposed) return;
    watchResolution();
    redraw();
  }

  signal?.addEventListener("abort", dispose, { once: true });
  canvas.addEventListener("webglcontextlost", onContextLoss);

  try {
    if (assets.length !== 3) throw new Error("Three guarantee illustrations are required");
    gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });
    if (!gl) throw new Error("WebGL is unavailable");
    // Capture a non-null context for callbacks after asynchronous image loading.
    const context = gl;

    const compile = (type: number, source: string) => {
      const shader = context.createShader(type);
      if (!shader) throw new Error("WebGL could not allocate a shader");
      shaders.push(shader);
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        throw new Error(context.getShaderInfoLog(shader) || "WebGL shader compilation failed");
      }
      return shader;
    };

    const vertex = compile(context.VERTEX_SHADER, VERTEX);
    const fragment = compile(context.FRAGMENT_SHADER, FRAGMENT);
    program = context.createProgram();
    if (!program) throw new Error("WebGL could not allocate a program");
    const linkedProgram = program;
    context.attachShader(linkedProgram, vertex);
    context.attachShader(linkedProgram, fragment);
    context.linkProgram(linkedProgram);
    if (!context.getProgramParameter(linkedProgram, context.LINK_STATUS)) {
      throw new Error(context.getProgramInfoLog(linkedProgram) || "WebGL program linking failed");
    }

    const images = await Promise.all(assets.map((src) => loadImage(src, loading.signal)));
    if (disposed || signal?.aborted) throw aborted();
    if (context.isContextLost()) throw new Error("WebGL context was lost");

    context.useProgram(linkedProgram);
    buffer = context.createBuffer();
    if (!buffer) throw new Error("WebGL could not allocate a buffer");
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      context.STATIC_DRAW,
    );
    const position = context.getAttribLocation(linkedProgram, "position");
    if (position < 0) throw new Error("WebGL position attribute is unavailable");
    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    for (const image of images) {
      const texture = context.createTexture();
      if (!texture) throw new Error("WebGL could not allocate an illustration texture");
      textures.push(texture);
      context.bindTexture(context.TEXTURE_2D, texture);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
      context.texImage2D(
        context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image,
      );
      if (context.getError() !== context.NO_ERROR) {
        throw new Error("WebGL could not upload an illustration");
      }
    }

    const uniform = (name: string) => {
      const location = context.getUniformLocation(linkedProgram, name);
      if (location === null) throw new Error(`WebGL uniform is unavailable: ${name}`);
      return location;
    };
    const uniforms = {
      from: uniform("uFrom"),
      to: uniform("uTo"),
      progress: uniform("uProgress"),
      strength: uniform("uStrength"),
      scaleFrom: uniform("uScaleFrom"),
      scaleTo: uniform("uScaleTo"),
    };
    let lastDraw: [0 | 1, number, number, number] | undefined;

    render = (pair, progress, strength = 1) => {
      current = [pair, progress, strength];
      if (disposed) return;
      if (context.isContextLost()) {
        dispose();
        reportUnavailable();
        return;
      }
      const ratio = Math.min(ownerWindow?.devicePixelRatio || 1, 2);
      const size = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const resized = canvas.width !== size || canvas.height !== size;
      // Reading plateaus need no GPU work. A resize invalidates the drawing
      // buffer even when the same illustration/progress is still selected.
      if (!resized && lastDraw?.[0] === pair && lastDraw[1] === progress
        && lastDraw[2] === strength && lastDraw[3] === size) return;
      if (resized) {
        canvas.width = size;
        canvas.height = size;
      }
      context.viewport(0, 0, size, size);
      context.useProgram(linkedProgram);
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, textures[pair]);
      context.uniform1i(uniforms.from, 0);
      context.activeTexture(context.TEXTURE1);
      context.bindTexture(context.TEXTURE_2D, textures[pair + 1]);
      context.uniform1i(uniforms.to, 1);
      context.uniform1f(uniforms.progress, progress);
      context.uniform1f(uniforms.strength, strength);
      context.uniform1f(uniforms.scaleFrom, SCALES[pair]);
      context.uniform1f(uniforms.scaleTo, SCALES[pair + 1]);
      context.clearColor(0, 0, 0, 0);
      context.clear(context.COLOR_BUFFER_BIT);
      context.drawArrays(context.TRIANGLES, 0, 6);
      lastDraw = [pair, progress, strength, size];
    };

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(redraw);
      observer.observe(canvas);
    }
    ownerWindow?.addEventListener("resize", redraw, { passive: true });
    watchResolution();
    return { render, dispose };
  } catch (error) {
    // Also cancels sibling image requests if one image or allocation fails.
    dispose();
    if (!(error instanceof DOMException && error.name === "AbortError")) {
      reportUnavailable();
    }
    throw error;
  }
}
