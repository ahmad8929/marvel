"use client";

import { useRef } from "react";

/**
 * Wraps a product card with:
 *  - idle: slow float + tiny rotation (pure CSS, paused while hovered so it never jumps)
 *  - hover: lift, scale, pointer-follow 3D tilt, one soft swing, depth shadow
 * Transforms only, so it stays on the GPU. Mouse-only tilt; touch gets the idle motion.
 */
export function FloatCard({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  const tilt = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const reduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onEnter(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || reduced()) return;
    const el = swing.current;
    if (el) {
      el.style.animation = "none";
      void el.offsetWidth; // restart the swing
      el.style.animation = "cardSwing 900ms cubic-bezier(.22,1,.36,1)";
    }
    if (tilt.current) tilt.current.style.transition = "transform 180ms ease-out";
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || reduced() || !tilt.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (tilt.current)
        tilt.current.style.transform = `translateZ(28px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.045)`;
    });
  }

  function onLeave() {
    cancelAnimationFrame(raf.current);
    const el = tilt.current;
    if (!el) return;
    el.style.transition = "transform 800ms cubic-bezier(.22,1,.36,1)";
    el.style.transform = "";
  }

  return (
    <div className="[perspective:900px]" onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
      {/* idle float — paused (not reset) on hover so returning is seamless */}
      <div
        className="group motion-safe:animate-[cardIdle_7s_ease-in-out_infinite] hover:[animation-play-state:paused]"
        style={{ animationDuration: `${6 + (index % 3)}s`, animationDelay: `${-index * 1.3}s` }}
      >
        <div
          ref={tilt}
          className="relative transition-shadow duration-500 [transform-style:preserve-3d] will-change-transform group-hover:shadow-[0_34px_50px_-24px_rgba(43,26,34,0.55)]"
        >
          <div ref={swing} className="[transform-style:preserve-3d]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
