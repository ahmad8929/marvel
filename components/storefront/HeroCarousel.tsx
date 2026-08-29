"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import type { HomeContent } from "@/lib/types";

export function HeroCarousel({ slides }: { slides: HomeContent["slides"] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;

  return (
    <section className="relative h-[68vh] min-h-[420px] w-full overflow-hidden bg-blush/40">
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
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
          <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/10 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[1240px] px-6">
              <div className="max-w-lg text-bg">
                {s.sub && (
                  <p className="mb-2 text-sm uppercase tracking-[0.24em]">{s.sub}</p>
                )}
                <h1 className="font-display text-4xl leading-tight sm:text-5xl">
                  {s.headline}
                </h1>
                {s.ctaHref && s.ctaLabel && (
                  <ButtonLink href={s.ctaHref} variant="gold" className="mt-6">
                    {s.ctaLabel}
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {n > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-bg" : "w-2 bg-bg/50"}`}
            />
          ))}
        </div>
      )}
      <Link href="/collections/kurtis" className="sr-only">
        Shop all
      </Link>
    </section>
  );
}
