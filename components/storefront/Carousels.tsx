"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { HomeContent } from "@/lib/types";

export function Row({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/3 hidden h-9 w-9 place-items-center rounded-full border border-line bg-bg shadow-sm md:grid"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/3 hidden h-9 w-9 place-items-center rounded-full border border-line bg-bg shadow-sm md:grid"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function TestimonialRow({
  testimonials,
}: {
  testimonials: HomeContent["testimonials"];
}) {
  if (testimonials.length === 0) return null;
  return (
    <Row>
      {testimonials.map((t) => (
        <figure
          key={t.id}
          className="w-[280px] shrink-0 snap-start rounded-2xl border border-line bg-surface p-6"
        >
          <Quote className="h-6 w-6 text-gold" />
          <blockquote className="mt-3 text-sm leading-relaxed text-ink">
            {t.quote}
          </blockquote>
          <figcaption className="mt-4 text-xs text-muted">
            {t.author}
            {t.location ? ` · ${t.location}` : ""}
          </figcaption>
        </figure>
      ))}
    </Row>
  );
}
