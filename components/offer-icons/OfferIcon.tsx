"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react";
import { createIconMotion, type IconController, type IconKind } from "./motion";
import "./offer-icons.css";

export type OfferIconHandle = {
  play: () => Promise<boolean>;
  cancel: () => void;
};
export type AssetName = "browser-base" | "cursor" | "tile-lime" | "tile-ivory" | "tile-forest";
export type OfferIconProps = {
  kind: IconKind;
  /** CSS box size, including the kit's safe margin for motion. */
  size?: number | string;
  /** Directory containing the optimized, transparent WebP layers. */
  assetBasePath?: string;
  /** Override individual URLs when using a CDN or the original PNG layers. */
  assets?: Partial<Record<AssetName, string>>;
  playOnView?: boolean;
  playOnHover?: boolean;
  disabled?: boolean;
  /** Omit when the neighbouring heading already names the offer. */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export const OfferIcon = forwardRef<OfferIconHandle, OfferIconProps>(function OfferIcon({
  kind,
  size = 88,
  assetBasePath = "/le-bon-dev/offer-icons",
  assets,
  playOnView = true,
  playOnHover = true,
  disabled = false,
  label,
  className = "",
  style,
}, forwardedRef) {
  const element = useRef<HTMLSpanElement>(null);
  const controller = useRef<IconController | null>(null);
  const visible = useRef(true);
  const playedOnView = useRef(false);
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const play = useCallback(() => {
    if (disabledRef.current || !visible.current) return Promise.resolve(false);
    return controller.current?.play() ?? Promise.resolve(false);
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    play,
    cancel: () => controller.current?.cancel(),
  }), [play]);

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const motion = createIconMotion(node, kind);
    controller.current = motion;
    let disposed = false;
    let observer: IntersectionObserver | undefined;

    if (!disabled && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (disposed) return;
        const entry = entries[entries.length - 1];
        if (!entry) return;
        visible.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          // Also cancel any play that is still waiting for image decoding.
          motion.cancel();
        } else if (playOnView && !playedOnView.current && entry.intersectionRatio >= 0.6) {
          playedOnView.current = true;
          void play();
        }
      }, { threshold: [0, 0.6] });
      observer.observe(node);
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      motion.destroy();
      controller.current = null;
    };
  }, [kind, playOnView, disabled, play]);

  const image = (name: AssetName) => (
    <img
      className={`lbd-oi__asset lbd-oi__asset--${name}`}
      src={assets?.[name] ?? `${assetBasePath.replace(/\/$/, "")}/${name}.webp`}
      alt=""
      draggable={false}
      decoding="async"
      width={384}
      height={384}
    />
  );

  return (
    <span
      ref={element}
      className={`lbd-oi lbd-oi--${kind} ${className}`.trim()}
      style={{ ...style, width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onPointerEnter={(event) => {
        if (playOnHover && event.pointerType === "mouse") void play();
      }}
    >
      {kind === "website" ? (
        <>
          <span className="lbd-oi__browser-placement">
            <span className="lbd-oi__part" data-part="browser">{image("browser-base")}</span>
          </span>
          <span className="lbd-oi__cursor-placement">
            <span className="lbd-oi__part" data-part="cursor">{image("cursor")}</span>
          </span>
        </>
      ) : (
        <span className="lbd-oi__grid">
          {(["tile-lime", "tile-ivory", "tile-ivory", "tile-forest"] as const).map((name, index) => (
            <span className="lbd-oi__tile" key={index}>
              <span className="lbd-oi__part" data-tile={index}>{image(name)}</span>
            </span>
          ))}
        </span>
      )}
    </span>
  );
});
