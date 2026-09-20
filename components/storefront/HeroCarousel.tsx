"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ProductSlide = {
  href: string;
  title: string;
  price?: number;
  mrp?: number;
  /** Real product photos, shown uncropped-ish side by side. */
  images: string[];
};

/** Hero carousel: each slide is one product, shown through its own photos. */
export function HeroCarousel({ slides }: { slides: ProductSlide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n, i]);

  if (n === 0) return null;
  const s = slides[i];
  const go = (d: 1 | -1) => setI((v) => (v + d + n) % n);

  return (
    <section className="relative bg-blush/40">
      <div key={s.href} className="relative animate-[fadeIn_.5s_ease]">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {s.images.slice(0, 3).map((src, k) => (
            <Link
              key={src}
              href={s.href}
              aria-label={s.title}
              className={`relative aspect-[3/4] overflow-hidden bg-blush/60 ${k === 2 ? "hidden lg:block" : ""}`}
            >
              <Image
                src={src}
                alt={`${s.title} — view ${k + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width:1024px) 50vw, 34vw"
                className="object-cover object-top motion-safe:animate-[kenburns_9s_ease-out_forwards]"
              />
            </Link>
          ))}
        </div>

        {/* name + button on the photos */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-ink/75 via-ink/35 to-transparent px-4 pb-6 pt-24 text-center text-bg sm:pb-8">
          <h2 className="font-display text-xl uppercase tracking-[0.14em] motion-safe:animate-[riseIn_.8s_.15s_ease-out_both] sm:text-3xl">{s.title}</h2>
          <Link
            href={s.href}
            className="pointer-events-auto mt-4 border border-bg motion-safe:animate-[riseIn_.8s_.35s_ease-out_both] bg-bg/10 px-8 py-3 text-xs font-medium uppercase tracking-[0.22em] backdrop-blur-sm transition-colors hover:bg-bg hover:text-primary"
          >
            Shop now
          </Link>
        </div>
      </div>

      {n > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg/90 shadow-sm lg:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg/90 shadow-sm lg:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="flex justify-center gap-2 py-3">
            {slides.map((sl, idx) => (
              <button
                key={sl.href}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-2 bg-primary/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
