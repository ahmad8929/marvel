import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui";
import type { Category, HomeContent } from "@/lib/types";

/* ---------------- USP bar (under the hero) ---------------- */
export function UspBar() {
  const items = [
    "Free Shipping over ₹999",
    "7-Day Easy Returns",
    "100% Secure Payments",
    "Cash on Delivery",
  ];
  return (
    <div className="border-y border-line bg-surface">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 py-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink/70">
        {items.map((t, i) => (
          <span key={t} className="flex items-center gap-8">
            {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-gold sm:block" />}
            {t}
          </span>
        ))}
      </Container>
    </div>
  );
}

/* ---------------- category tiles (Libas-style, full-bleed) ---------------- */
export function CategoryTiles({ categories }: { categories: Category[] }) {
  const tiles = categories.slice(0, 4);
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4">
      {tiles.map((c) => (
        <Link key={c.id} href={`/collections/${c.slug}`} className="group relative aspect-[3/4] overflow-hidden">
          {c.image && (
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          <span className="absolute bottom-6 left-6 font-display text-xl uppercase tracking-[0.14em] text-bg">
            {c.name}
          </span>
        </Link>
      ))}
    </section>
  );
}

/* ---------------- customer reviews (polaroid) ---------------- */
export function ReviewsPolaroid({
  testimonials,
}: {
  testimonials: HomeContent["testimonials"];
}) {
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-blush/40 py-16">
      <h2 className="text-center font-display text-2xl uppercase tracking-[0.2em] text-primary">
        Customer Reviews
      </h2>
      <Container className="mt-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.slice(0, 4).map((t, i) => (
            <figure key={t.id} className="flex flex-col items-center text-center">
              <p className="min-h-[64px] px-2 text-sm leading-relaxed text-ink">{t.quote}</p>
              <div
                className="mt-5 border-[10px] border-surface bg-surface shadow-[0_10px_30px_-12px_rgba(43,26,34,0.45)]"
                style={{ transform: `rotate(${i % 2 ? 2.5 : -2.5}deg)` }}
              >
                <div className="relative h-56 w-44 bg-blush/50">
                  <Image
                    src={`https://picsum.photos/seed/marvels-review-${i}/360/460`}
                    alt={t.author}
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-5 flex items-center gap-3 text-xs">
                <span className="tracking-[0.2em] text-gold">★★★★★</span>
                <span className="text-muted">_{t.author}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- style journal (editorial) ---------------- */
const JOURNAL = [
  {
    title: "How to Style a Cotton Kurti for Work",
    excerpt: "Five easy ways to take a everyday kurti from the desk to dinner…",
    href: "/collections/kurtis?tag=workwear",
    accent: "The Kurti Edit",
  },
  {
    title: "Co-ord Sets: One-and-Done Dressing",
    excerpt: "Why a matching set is the busiest woman's best friend this season…",
    href: "/collections/co-ord-sets",
    accent: "Set Stories",
  },
  {
    title: "Finding Your Perfect Dress Length",
    excerpt: "Midi, maxi or knee-length — a quick guide to what flatters when…",
    href: "/collections/dresses",
    accent: "Dress Notes",
  },
];

export function StyleJournal() {
  return (
    <Container className="py-16">
      <h2 className="text-center font-display text-2xl uppercase tracking-[0.2em] text-primary">
        The Marvel&apos;s Journal
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {JOURNAL.map((j, i) => (
          <Link key={j.title} href={j.href} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden bg-blush/40">
              <Image
                src={`https://picsum.photos/seed/marvels-journal-${i}/720/450`}
                alt=""
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 font-script text-2xl text-bg drop-shadow">
                {j.accent}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-medium text-ink group-hover:text-primary">{j.title}</h3>
            <p className="mt-1 text-sm text-muted">{j.excerpt}</p>
            <span className="mt-2 inline-block text-xs uppercase tracking-[0.14em] text-primary underline underline-offset-4">
              Read more
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}

/* ---------------- services strip (Libas-style) ---------------- */
export function ServicesStrip() {
  const items = [
    {
      label: "Free Express Shipping",
      icon: <path d="M4 6h11v8H4z M15 9h4l3 3v2h-7z M7.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M17.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
    },
    {
      label: "Pay on Delivery",
      icon: <path d="M3 7h18v10H3z M7 12h.01 M3 10h18" />,
    },
    {
      label: "Easy Returns & Exchanges",
      icon: <path d="M4 12a8 8 0 018-8 8 8 0 017 4 M20 4v4h-4 M20 12a8 8 0 01-8 8 8 8 0 01-7-4 M4 20v-4h4" />,
    },
  ];
  return (
    <Container className="border-t border-line py-10">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {items.map((it, i) => (
          <div
            key={it.label}
            className={`flex flex-col items-center gap-3 text-center ${
              i < 2 ? "sm:border-r sm:border-line" : ""
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-ink"
            >
              {it.icon}
            </svg>
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink/80">
              {it.label}
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
}
