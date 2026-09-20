"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Background photo that drifts slower than the page (subtle parallax). */
export function ParallaxBg({ src, className = "" }: { src: string; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const w = wrap.current;
      const l = layer.current;
      if (!w || !l) return;
      const r = w.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -0.14;
      l.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden">
      <div ref={layer} className="absolute inset-x-0 -top-[14%] h-[128%] will-change-transform">
        <Image src={src} alt="" fill sizes="100vw" className={`object-cover ${className}`} />
      </div>
    </div>
  );
}
