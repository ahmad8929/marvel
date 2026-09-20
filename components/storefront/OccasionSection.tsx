import Image from "next/image";
import Link from "next/link";

const WORDS = ["Festive", "Haldi", "Mehendi", "Wedding", "Party", "Eid", "Diwali", "Sangeet"];

const TILES = [
  {
    n: "01",
    title: "Festive",
    sub: "Embroidered sets for every celebration",
    href: "/collections/co-ord-sets?tag=festive",
    img: "/occasions/festive.jpg",
    tint: "from-primary/90 via-primary/40",
    cls: "col-span-2 min-h-[300px] lg:col-span-2 lg:row-span-2",
    big: true,
  },
  {
    n: "02",
    title: "Haldi & Mehendi",
    sub: "Sunny, joyful colours",
    href: "/collections/co-ord-sets?tag=haldi",
    img: "/occasions/haldi.jpg",
    tint: "from-[#5c3200]/90 via-[#5c3200]/35",
    cls: "min-h-[230px]",
  },
  {
    n: "03",
    title: "Wedding Guest",
    sub: "Dressed to be remembered",
    href: "/collections/co-ord-sets?tag=wedding-guest",
    img: "/occasions/wedding.jpg",
    tint: "from-[#3d1230]/90 via-[#3d1230]/35",
    cls: "min-h-[230px]",
  },
  {
    n: "04",
    title: "Party Wear",
    sub: "Bell sleeves, sequins and shine",
    href: "/collections/co-ord-sets?tag=party",
    img: "/occasions/party.jpg",
    tint: "from-ink/90 via-ink/40",
    cls: "col-span-2 min-h-[220px] lg:col-span-2",
  },
];

/** Bold, type-led break between photo sections: outline marquee + colour-block tiles. */
export function OccasionSection() {
  const line = WORDS.map((w, i) => (
    <span key={w} className="flex items-center">
      <span
        className={
          i % 2
            ? "text-primary"
            : "text-transparent [-webkit-text-stroke:1.5px_#6d1533]"
        }
      >
        {w}
      </span>
      <span className="mx-6 text-gold sm:mx-10">✦</span>
    </span>
  ));

  return (
    <section className="overflow-hidden bg-bg py-10 sm:py-20">
      {/* giant scrolling headline */}
      <div className="flex w-max font-display text-5xl uppercase leading-none tracking-[0.06em] motion-safe:animate-[marquee_45s_linear_infinite] sm:text-8xl">
        <div className="flex shrink-0">{line}</div>
        <div aria-hidden className="flex shrink-0">{line}</div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[1240px] px-4 sm:mt-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-script text-2xl text-gold">Find your moment</p>
            <h2 className="font-display text-2xl uppercase tracking-[0.18em] text-primary sm:text-3xl">
              Shop by occasion
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:h-[520px] lg:grid-cols-4 lg:grid-rows-2">
          {TILES.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className={`group relative flex flex-col justify-between overflow-hidden bg-ink p-4 text-bg transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(43,26,34,0.6)] sm:p-7 lg:min-h-0 ${t.cls}`}
            >
              <Image
                src={t.img}
                alt=""
                fill
                sizes={t.big ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <span aria-hidden className={`absolute inset-0 bg-gradient-to-t to-black/10 ${t.tint}`} />

              {/* oversized ghost number */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-5 font-display text-[6rem] leading-none opacity-[0.16] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 sm:text-[9rem]"
              >
                {t.n}
              </span>
              {/* sweeping shine */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/20 opacity-0 transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100"
              />

              <span className="relative text-[0.6rem] font-medium uppercase tracking-[0.24em] opacity-80 sm:text-[0.68rem] sm:tracking-[0.28em]">
                {t.n} — Occasion
              </span>
              <span className="relative">
                <span
                  className={`block font-display uppercase leading-[1.08] tracking-[0.08em] ${
                    t.big ? "text-3xl sm:text-6xl" : "text-lg sm:text-3xl"
                  }`}
                >
                  {t.title}
                </span>
                <span className="mt-1.5 block max-w-xs text-xs opacity-90 sm:mt-2 sm:text-sm">{t.sub}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.2em] sm:mt-4 sm:text-[0.68rem] sm:tracking-[0.22em]">
                  Shop now
                  <span
                    aria-hidden
                    className="grid h-7 w-7 place-items-center rounded-full border border-current transition-all duration-500 group-hover:translate-x-2 group-hover:bg-white/15 sm:h-8 sm:w-8"
                  >
                    →
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
