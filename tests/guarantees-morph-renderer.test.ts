import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

const rendererURL = new URL(
  "../components/sections/guarantees-timeline/morph-renderer.ts",
  import.meta.url,
);
const { createRenderer } = await import(rendererURL.href) as typeof import(
  "../components/sections/guarantees-timeline/morph-renderer"
);

type Resource = { kind: string; id: number };

function fixture(t: TestContext, failure?: "fragment" | "texture" | "unavailable") {
  const allocated = new Set<Resource>();
  const deleted = new Set<Resource>();
  const calls: Array<[string, ...unknown[]]> = [];
  let id = 0;
  let textureCount = 0;
  let compileCount = 0;
  let lost = false;

  const resource = (kind: string) => {
    const value = { kind, id: ++id };
    allocated.add(value);
    return value;
  };
  const remove = (value: Resource) => {
    assert.ok(!deleted.has(value), "Each GPU resource is deleted exactly once");
    deleted.add(value);
  };
  const constants = [
    "VERTEX_SHADER", "FRAGMENT_SHADER", "COMPILE_STATUS", "LINK_STATUS",
    "ARRAY_BUFFER", "STATIC_DRAW", "FLOAT", "UNPACK_FLIP_Y_WEBGL",
    "UNPACK_PREMULTIPLY_ALPHA_WEBGL", "TEXTURE_2D", "TEXTURE_WRAP_S",
    "TEXTURE_WRAP_T", "CLAMP_TO_EDGE", "TEXTURE_MIN_FILTER", "TEXTURE_MAG_FILTER",
    "LINEAR", "RGBA", "UNSIGNED_BYTE", "TEXTURE0", "TEXTURE1",
    "COLOR_BUFFER_BIT", "TRIANGLES",
  ];
  const values: Record<string, unknown> = Object.fromEntries(
    constants.map((key, index) => [key, index + 1]),
  );
  Object.assign(values, {
    NO_ERROR: 0,
    createShader: () => resource("shader"),
    createProgram: () => resource("program"),
    createBuffer: () => resource("buffer"),
    createTexture: () => (++textureCount === 2 && failure === "texture")
      ? null : resource("texture"),
    getShaderParameter: () => !(++compileCount === 2 && failure === "fragment"),
    getShaderInfoLog: () => "Compilation failed",
    getProgramParameter: () => true,
    getAttribLocation: () => 0,
    getUniformLocation: (_: unknown, name: string) => name,
    getError: () => 0,
    isContextLost: () => lost,
    deleteShader: remove,
    deleteProgram: remove,
    deleteBuffer: remove,
    deleteTexture: remove,
  });
  const gl = new Proxy(values, {
    get(target, key: string) {
      return target[key] ?? ((...args: unknown[]) => calls.push([key, ...args]));
    },
  });

  class FakeImage {
    static instances: FakeImage[] = [];
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src = "";
    constructor() { FakeImage.instances.push(this); }
    removeAttribute() { this.src = ""; }
  }
  class FakeObserver {
    static instances: FakeObserver[] = [];
    disconnected = false;
    callback: () => void;
    constructor(callback: () => void) {
      this.callback = callback;
      FakeObserver.instances.push(this);
    }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  for (const [name, replacement] of Object.entries({ Image: FakeImage, ResizeObserver: FakeObserver })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { value: replacement, configurable: true });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, name, original);
      else Reflect.deleteProperty(globalThis, name);
    });
  }

  const resolutionQueries: EventTarget[] = [];
  const ownerWindow = Object.assign(new EventTarget(), {
    devicePixelRatio: 1,
    matchMedia: () => {
      const query = new EventTarget();
      resolutionQueries.push(query);
      return query;
    },
  });
  const canvas = Object.assign(new EventTarget(), {
    width: 0, height: 0, clientWidth: 300,
    ownerDocument: { defaultView: ownerWindow },
    getContext: () => failure === "unavailable" ? null : gl,
  });
  const assets = ["/envelope.png", "/calendar.png", "/keys.png"];
  let unavailable = 0;
  const abortController = new AbortController();
  const promise = createRenderer(canvas as unknown as HTMLCanvasElement, assets, {
    signal: abortController.signal,
    onUnavailable: () => { unavailable++; },
  });
  return {
    promise, canvas, ownerWindow, calls, allocated, deleted, resolutionQueries,
    abortController, images: FakeImage.instances, observers: FakeObserver.instances,
    get unavailable() { return unavailable; },
    loadImages() { FakeImage.instances.forEach((image) => image.onload?.()); },
    loseContext() { lost = true; canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })); },
  };
}

test("unmount while PNGs load cancels callbacks and releases every allocated resource", async (t) => {
  const f = fixture(t);
  assert.equal(f.images.length, 3);
  f.abortController.abort();
  await assert.rejects(f.promise, { name: "AbortError" });
  assert.deepEqual(f.deleted, f.allocated);
  assert.ok(f.images.every((image) => image.onload === null && image.onerror === null && image.src === ""));
  assert.equal(f.unavailable, 0);
  f.loadImages();
  assert.equal(f.calls.filter(([name]) => name === "drawArrays").length, 0);
});

test("an image failure cancels sibling loads and activates the static fallback once", async (t) => {
  const f = fixture(t);
  f.images[1].onerror?.();
  await assert.rejects(f.promise, /could not load/);
  assert.deepEqual(f.deleted, f.allocated);
  assert.ok(f.images.every((image) => image.onload === null && image.onerror === null));
  assert.equal(f.unavailable, 1);
});

test("a fragment compile failure cleans up the already compiled vertex shader", async (t) => {
  const f = fixture(t, "fragment");
  await assert.rejects(f.promise, /Compilation failed/);
  assert.equal(f.allocated.size, 2);
  assert.deepEqual(f.deleted, f.allocated);
  assert.equal(f.unavailable, 1);
});

test("partial texture allocation failure cleans up textures, buffer, program and shaders", async (t) => {
  const f = fixture(t, "texture");
  f.loadImages();
  await assert.rejects(f.promise, /allocate an illustration texture/);
  assert.deepEqual(f.deleted, f.allocated);
  assert.equal(f.unavailable, 1);
});

test("render preserves POC scales, alpha and orientation, and redraws on resize/DPR changes", async (t) => {
  const f = fixture(t);
  f.loadImages();
  const renderer = await f.promise;
  renderer.render(0, 0);
  renderer.render(1, 1);
  const uniformCalls = f.calls.filter(([name]) => name === "uniform1f");
  assert.ok(uniformCalls.some(([, key, value]) => key === "uScaleFrom" && value === 0.98));
  assert.ok(uniformCalls.some(([, key, value]) => key === "uScaleFrom" && value === 0.88));
  assert.ok(uniformCalls.some(([, key, value]) => key === "uScaleTo" && value === 0.9));
  assert.ok(uniformCalls.some(([, key, value]) => key === "uStrength" && value === 1));
  assert.deepEqual(f.calls.filter(([name]) => name === "pixelStorei").map(([, , value]) => value), [true, false]);

  f.canvas.clientWidth = 400;
  f.observers[0].callback();
  assert.equal(f.canvas.width, 400);
  f.ownerWindow.devicePixelRatio = 3;
  f.resolutionQueries[0].dispatchEvent(new Event("change"));
  assert.equal(f.canvas.width, 800, "Resolution stays capped at the POC's 2x DPR");
  assert.equal(f.canvas.height, 800);

  renderer.dispose();
  renderer.dispose();
  const callCount = f.calls.length;
  f.observers[0].callback();
  f.ownerWindow.dispatchEvent(new Event("resize"));
  f.resolutionQueries.at(-1)?.dispatchEvent(new Event("change"));
  renderer.render(0, 0.5);
  assert.equal(f.calls.length, callCount);
  assert.deepEqual(f.deleted, f.allocated);
  assert.ok(f.observers[0].disconnected);
});

test("context loss disposes the renderer and leaves fallback activation idempotent", async (t) => {
  const f = fixture(t);
  f.loadImages();
  const renderer = await f.promise;
  f.loseContext();
  f.loseContext();
  renderer.render(1, 0.5);
  renderer.dispose();
  assert.equal(f.unavailable, 1);
  assert.deepEqual(f.deleted, f.allocated);
  assert.ok(f.observers[0].disconnected);
});

test("missing WebGL cleanly selects the static fallback without requesting images", async (t) => {
  const f = fixture(t, "unavailable");
  await assert.rejects(f.promise, /WebGL is unavailable/);
  assert.equal(f.images.length, 0);
  assert.equal(f.unavailable, 1);
});
