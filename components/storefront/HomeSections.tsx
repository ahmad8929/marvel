import Image from "next/image";
import { Container } from "@/components/ui";
import { Reveal } from "./Reveal";
import type { HomeContent } from "@/lib/types";

/* ---------------- USP ticker (under the hero) ---------------- */
export function UspBar() {
  const items = ["Free Shipping over ₹999", "100% Secure Payments", "Cash on Delivery"];
  const track = (hidden: boolean) => (
    <div key={String(hidden)} aria-hidden={hidden} className="flex shrink-0 items-center">
      {Array.from({ length: 3 }).flatMap((_, r) =>
        items.map((t) => (
          <span key={`${r}-${t}`} className="flex items-center">
            <span className="px-6 sm:px-10">{t}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
          </span>
        )),
      )}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-line bg-surface py-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink/70">
      <div className="flex w-max motion-safe:animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}

/* ---------------- customer reviews (polaroid) ---------------- */
export function ReviewsPolaroid({
  testimonials,
  photos,
}: {
  testimonials: HomeContent["testimonials"];
  /** Product photos shown in the polaroid frames. */
  photos: string[];
}) {
  if (testimonials.length === 0 || photos.length === 0) return null;
  return (
    <section className="bg-blush/40 py-16">
      <Reveal>
        <h2 className="text-center font-display text-2xl uppercase tracking-[0.2em] text-primary">
          Customer Reviews
        </h2>
      </Reveal>
      <Container className="mt-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.slice(0, 4).map((t, i) => (
            <Reveal key={t.id} delay={i * 120}>
            <figure className="flex flex-col items-center text-center">
              <p className="min-h-[64px] px-2 text-sm leading-relaxed text-ink">{t.quote}</p>
              {/* idle sway (paused on hover), hover straightens + lifts */}
              <div
                className="mt-5 motion-safe:animate-[polaroidSway_6s_ease-in-out_infinite] hover:[animation-play-state:paused]"
                style={{ ["--r" as string]: `${i % 2 ? 2.5 : -2.5}deg`, transform: `rotate(${i % 2 ? 2.5 : -2.5}deg)`, animationDelay: `${-i * 1.4}s` }}
              >
              <div className="border-[10px] border-surface bg-surface shadow-[0_10px_30px_-12px_rgba(43,26,34,0.45)] transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-2deg] hover:scale-105 hover:shadow-[0_24px_40px_-14px_rgba(43,26,34,0.55)]">
                <div className="relative h-56 w-44 bg-blush/50">
                  <Image
                    src={t.avatar || photos[i % photos.length]}
                    alt={t.author}
                    fill
                    sizes="176px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              </div>
              <figcaption className="mt-5 flex items-center gap-3 text-xs">
                <span className="tracking-[0.2em] text-gold">★★★★★</span>
                <span className="text-muted">_{t.author}</span>
              </figcaption>
            </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
