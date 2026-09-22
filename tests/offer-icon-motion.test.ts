import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

const motionURL = new URL("../components/offer-icons/motion.ts", import.meta.url);
const { createIconMotion } = await import(motionURL.href) as typeof import(
  "../components/offer-icons/motion"
);

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

class WatchedTarget extends EventTarget {
  listeners = new Set<EventListenerOrEventListenerObject>();
  override addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean) {
    if (listener) this.listeners.add(listener);
    super.addEventListener(type, listener, options);
  }
  override removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean) {
    if (listener) this.listeners.delete(listener);
    super.removeEventListener(type, listener, options);
  }
}

function fixture(t: TestContext, kind: "website" | "applications" = "website") {
  let controller: ReturnType<typeof createIconMotion>;
  t.after(() => controller?.destroy());
  const media = Object.assign(new WatchedTarget(), { matches: false });
  const document = Object.assign(new WatchedTarget(), { hidden: false });
  const decode = deferred();
  const image = { naturalWidth: 384, decode: () => decode.promise };
  const calls: Array<{
    selector: string;
    frames: Keyframe[];
    options: KeyframeAnimationOptions;
    cancelled: boolean;
    finish: () => void;
  }> = [];
  const root = {
    isConnected: true,
    querySelectorAll: () => [image],
    querySelector: (selector: string) => ({
      animate: (frames: Keyframe[], options: KeyframeAnimationOptions) => {
        const animation = deferred();
        const call = { selector, frames, options, cancelled: false, finish: animation.resolve };
        calls.push(call);
        return {
          finished: animation.promise,
          cancel: () => { call.cancelled = true; animation.reject(new Error("cancelled")); },
        };
      },
    }),
  };
  for (const [name, value] of Object.entries({ window: { matchMedia: () => media }, document })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { value, configurable: true });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, name, original);
      else Reflect.deleteProperty(globalThis, name);
    });
  }
  controller = createIconMotion(root as unknown as HTMLElement, kind);
  return { controller, root, media, document, decode, image, calls };
}

async function flushDecoding() {
  for (let i = 0; i < 4; i++) await Promise.resolve();
}

test("website motion waits for images, runs once and returns to its original transform", async (t) => {
  const f = fixture(t);
  const playing = f.controller.play();
  assert.equal(f.calls.length, 0);
  assert.equal(await f.controller.play(), false, "No queue while decoding");
  f.decode.resolve();
  await flushDecoding();
  assert.equal(f.calls.length, 2);
  assert.equal(await f.controller.play(), false, "No queue while animating");
  for (const call of f.calls) {
    assert.equal(call.options.duration, 1100);
    assert.equal(call.options.iterations, 1);
    assert.equal(call.options.fill, "none");
    assert.equal(call.frames[0].transform, call.frames.at(-1)?.transform);
    call.finish();
  }
  assert.equal(await playing, true);
});

test("application wave keeps the supplied spatial order and ends within 975 ms", async (t) => {
  const f = fixture(t, "applications");
  f.decode.resolve();
  const playing = f.controller.play();
  await flushDecoding();
  assert.deepEqual(f.calls.map(call => call.selector), [
    '[data-tile="0"]', '[data-tile="1"]', '[data-tile="3"]', '[data-tile="2"]',
  ]);
  assert.deepEqual(f.calls.map(call => call.options.delay), [0, 85, 170, 255]);
  assert.ok(f.calls.every(call => call.options.duration === 720 && call.options.iterations === 1));
  f.calls.forEach(call => call.finish());
  assert.equal(await playing, true);
});

test("unmount during image decoding prevents late animation and removes listeners", async (t) => {
  const f = fixture(t);
  const playing = f.controller.play();
  f.controller.destroy();
  f.controller.destroy();
  f.decode.resolve();
  assert.equal(await playing, false);
  assert.equal(f.calls.length, 0);
  assert.equal(f.media.listeners.size, 0);
  assert.equal(f.document.listeners.size, 0);
  assert.equal(await f.controller.play(), false);
});

test("offscreen cancellation invalidates decoding but a later visible play can run", async (t) => {
  const f = fixture(t);
  const obsolete = f.controller.play();
  f.controller.cancel();
  const current = f.controller.play();
  f.decode.resolve();
  await flushDecoding();
  assert.equal(await obsolete, false);
  assert.equal(f.calls.length, 2, "Only the latest play starts");
  assert.equal(await f.controller.play(), false, "Obsolete cleanup cannot clear current running state");
  f.calls.forEach(call => call.finish());
  assert.equal(await current, true);
});

test("reduced motion blocks playback and changing the preference cancels active animations", async (t) => {
  const f = fixture(t);
  f.media.matches = true;
  assert.equal(await f.controller.play(), false);
  f.media.matches = false;
  f.decode.resolve();
  const playing = f.controller.play();
  await flushDecoding();
  f.media.matches = true;
  f.media.dispatchEvent(new Event("change"));
  assert.equal(await playing, false);
  assert.ok(f.calls.every(call => call.cancelled));
});

test("hidden document cancels active playback and prevents new animation", async (t) => {
  const f = fixture(t);
  f.decode.resolve();
  const playing = f.controller.play();
  await flushDecoding();
  f.document.hidden = true;
  f.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(await playing, false);
  assert.ok(f.calls.every(call => call.cancelled));
  assert.equal(await f.controller.play(), false);
});

test("failed images and detached elements remain static", async (t) => {
  const f = fixture(t);
  f.image.naturalWidth = 0;
  const playing = f.controller.play();
  f.decode.reject(new Error("Image unavailable"));
  assert.equal(await playing, false);
  assert.equal(f.calls.length, 0);
  f.root.isConnected = false;
  assert.equal(await f.controller.play(), false);
});

test("destroying active motion cancels every animation and leaves no listeners", async (t) => {
  const f = fixture(t, "applications");
  f.decode.resolve();
  const playing = f.controller.play();
  await flushDecoding();
  f.controller.destroy();
  assert.equal(await playing, false);
  assert.equal(f.calls.length, 4);
  assert.ok(f.calls.every(call => call.cancelled));
  assert.equal(f.media.listeners.size, 0);
  assert.equal(f.document.listeners.size, 0);
});
