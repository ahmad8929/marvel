"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/lib/types";

export function HeroCarousel({ slides }: { slides: HomeContent["slides"] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;

  return (
    <section className="relative aspect-[16/10] w-full overflow-hidden bg-blush/40 sm:aspect-[21/9]">
      {slides.map((s, idx) => (
        <Link
          key={s.id}
          href={s.ctaHref ?? "/collections/kurtis"}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === i ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={idx !== i}
        >
          <Image
            src={s.imageDesktop}
            alt={s.headline ?? ""}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto flex w-full max-w-[1240px] items-end justify-between px-6 pb-8">
              <div className="max-w-md text-bg">
                {s.sub && (
                  <p className="mb-1 text-[0.7rem] uppercase tracking-[0.24em]">{s.sub}</p>
                )}
                {s.headline && (
                  <p className="font-display text-2xl sm:text-3xl">{s.headline}</p>
                )}
              </div>
              <span className="shrink-0 border-b-2 border-bg pb-1 text-xs font-medium uppercase tracking-[0.2em] text-bg">
                {s.ctaLabel ?? "Shop Now"}
              </span>
            </div>
          </div>
        </Link>
      ))}

      {n > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all ${
                idx === i ? "w-6 bg-bg" : "w-2 bg-bg/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
