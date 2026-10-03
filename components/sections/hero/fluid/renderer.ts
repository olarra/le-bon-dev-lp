import { surface, type Gpu, type Surface } from "vgpu";

import { installStirInput } from "./pointer-input";
import {
  createFluid,
  prepareFluid,
  renderFluid,
  resizeFluid,
  stepFluid,
  type Fluid,
} from "./simulation";

const FIXED_STEP = 1 / 60;

interface RendererOptions {
  canvas: HTMLCanvasElement;
  inputTarget: HTMLElement;
}

function fixedStepCount(accumulator: number, elapsed: number) {
  let next = accumulator + Math.min(elapsed, 1 / 30);
  let steps = 0;
  while (next >= FIXED_STEP && steps < 2) {
    next -= FIXED_STEP;
    steps++;
  }
  return { steps, accumulator: steps === 2 ? 0 : next };
}

export function createRenderer(options: RendererOptions) {
  let disposed = false;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let fluid: Fluid | undefined;
  let input: ReturnType<typeof installStirInput> | undefined;
  let animationFrame = 0;
  let accumulator = 0;
  let previous = 0;
  let visible = false;
  let initialized = false;
  let removeResize = () => {};
  let removeGpuError = () => {};

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  });
  visibility.observe(options.inputTarget);
  document.addEventListener("visibilitychange", syncPlayback);

  function syncPlayback() {
    if (disposed || !initialized || !visible || document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      accumulator = 0;
      previous = 0;
      input?.reset();
      return;
    }
    if (!animationFrame) {
      previous = performance.now();
      animationFrame = requestAnimationFrame(tick);
    }
  }

  const tick = (now: number) => {
    animationFrame = 0;
    if (disposed || !visible || document.hidden || !fluid || !input || !canvasSurface) return;
    try {
      const fixed = fixedStepCount(accumulator, (now - previous) / 1000);
      accumulator = fixed.accumulator;
      for (let i = 0; i < fixed.steps; i++) {
        stepFluid(fluid, input);
      }
      renderFluid(fluid, canvasSurface);
      options.canvas.dataset.ready = "true";
    } catch (error) {
      failRuntime(error);
      return;
    }
    previous = now;
    animationFrame = requestAnimationFrame(tick);
  };

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    visibility.disconnect();
    document.removeEventListener("visibilitychange", syncPlayback);
    removeResize();
    removeGpuError();
    input?.dispose();
    gpu?.dispose();
    delete options.canvas.dataset.ready;
  }

  function failRuntime(error: unknown) {
    if (disposed) return;
    console.warn("Hero fluid stopped:", error);
    dispose();
  }

  const initialize = async () => {
    const { init } = await import("vgpu");
    if (disposed) return;
    const nextGpu = await init({ powerPreference: "low-power", label: "hero-fluid" });
    if (disposed) {
      nextGpu.dispose();
      return;
    }
    gpu = nextGpu;
    removeGpuError = gpu.onError(failRuntime);
    void gpu.gpu.lost.then(failRuntime);
    canvasSurface = surface(gpu, options.canvas, {
      dpr: [1, 1.5],
      alphaMode: "premultiplied",
      clearColor: [0, 0, 0, 0],
    });
    fluid = createFluid(gpu);
    input = installStirInput(options.inputTarget, options.canvas);
    await prepareFluid(fluid, canvasSurface);
    if (disposed) return;
    removeResize = canvasSurface.onResize(() => {
      if (disposed || !fluid || !canvasSurface) return;
      try {
        resizeFluid(fluid, canvasSurface);
      } catch (error) {
        failRuntime(error);
      }
    });
    initialized = true;
    syncPlayback();
  };

  const ready = initialize().catch((error: unknown) => {
    if (disposed) return;
    dispose();
    throw error;
  });

  return { ready, dispose };
}
