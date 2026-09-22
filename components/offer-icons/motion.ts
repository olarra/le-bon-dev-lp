/** One-shot raster animation from the supplied offer-icon kit. */
export type IconKind = 'website' | 'applications';
export type IconController = { play: () => Promise<boolean>; cancel: () => void; destroy: () => void };

export function createIconMotion(root: HTMLElement, kind: IconKind): IconController {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current: Animation[] = [];
  let running = false;
  let disposed = false;
  let generation = 0;
  const cancel = () => {
    generation++;
    current.forEach(animation => animation.cancel());
    current = [];
    running = false;
  };
  media.addEventListener('change', cancel);
  const onVisibility = () => { if (document.hidden) cancel(); };
  document.addEventListener('visibilitychange', onVisibility);
  const animate = (selector: string, frames: Keyframe[], delay = 0, duration = 900) => {
    const element = root.querySelector<HTMLElement>(selector);
    if (!element || typeof element.animate !== 'function') return;
    current.push(element.animate(frames, {
      duration, delay, easing: 'linear', iterations: 1, fill: 'none',
    }));
  };
  const ease = 'cubic-bezier(.22,.7,.28,1)';
  const play = async (): Promise<boolean> => {
    if (disposed || running || media.matches || document.hidden || !root.isConnected) return false;
    running = true;
    const token = ++generation;
    try {
      // Reserve this play before decoding so repeated hover/focus events never queue.
      const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
      await Promise.all(images.map(image => typeof image.decode === 'function'
        ? image.decode().catch(() => undefined)
        : Promise.resolve()));
      if (disposed || token !== generation || media.matches || document.hidden || !root.isConnected
        || images.some(image => !image.naturalWidth)) return false;
      if (kind === 'website') {
        animate('[data-part="cursor"]', [
          { transform: 'translate(0,0) rotate(0deg) scale(1)', offset: 0, easing: ease },
          { transform: 'translate(-24%,-19%) rotate(-3deg) scale(1)', offset: .38, easing: ease },
          { transform: 'translate(-24%,-19%) rotate(-3deg) scale(.93)', offset: .50, easing: ease },
          { transform: 'translate(-24%,-19%) rotate(-3deg) scale(1)', offset: .63, easing: ease },
          { transform: 'translate(0,0) rotate(0deg) scale(1)', offset: 1 },
        ], 0, 1100);
        animate('[data-part="browser"]', [
          { transform: 'scale(1)', offset: 0 },
          { transform: 'scale(1)', offset: .40, easing: ease },
          { transform: 'scale(.978)', offset: .52, easing: ease },
          { transform: 'scale(1)', offset: .76 },
          { transform: 'scale(1)', offset: 1 },
        ], 0, 1100);
      } else {
        // Spatial wave: top left -> top right -> bottom right -> bottom left.
        [0, 1, 3, 2].forEach((tile, order) => animate(`[data-tile="${tile}"]`, [
          { transform: 'translateY(0) rotate(0deg)', offset: 0, easing: ease },
          { transform: `translateY(-13%) rotate(${tile % 2 ? 2 : -2}deg)`, offset: .36, easing: ease },
          { transform: 'translateY(2%) rotate(0deg)', offset: .73, easing: ease },
          { transform: 'translateY(0) rotate(0deg)', offset: 1 },
        ], order * 85, 720));
      }
      if (!current.length) return false;
      const batch = current;
      await Promise.all(batch.map(animation => animation.finished));
      return token === generation;
    } catch {
      return false;
    } finally {
      if (token === generation) { current = []; running = false; }
    }
  };
  return {
    play, cancel,
    destroy: () => {
      if (disposed) return;
      disposed = true;
      cancel();
      media.removeEventListener('change', cancel);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
