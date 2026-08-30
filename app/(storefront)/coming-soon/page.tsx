import type { Metadata } from "next";
import { LogoMark } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/storefront/NewsletterForm";

export const metadata: Metadata = {
  title: "Launching Soon",
  description: "Marvel's Online Clothings is launching soon. Join the list.",
};

const VALUES = [
  "Premium Quality",
  "Trendy Designs",
  "Affordable Prices",
  "Secure Shopping",
  "Fast Delivery",
];

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl text-center">
        <div className="mx-auto flex flex-col items-center rounded-3xl border border-line bg-surface/70 px-8 py-14 shadow-[0_30px_80px_-40px_rgba(109,21,51,0.35)] sm:px-14">
          <LogoMark className="h-16 w-16" />
          <span className="mt-8 font-display text-2xl font-semibold tracking-[0.18em] text-primary">
            MARVEL&apos;S
          </span>
          <span className="mt-1 text-[0.6rem] tracking-[0.34em] text-muted">
            ONLINE CLOTHINGS
          </span>

          <span className="mt-8 inline-flex items-center rounded-full bg-primary px-5 py-2 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-bg">
            Launching Soon
          </span>

          <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            Timeless style.
            <br />
            Made for you.
          </h1>
          <p className="mt-4 font-script text-2xl text-primary-hover">
            Style that defines you
          </p>

          <p className="mt-4 max-w-sm text-sm text-muted">
            Be first to shop our kurtis, dresses and co-ord sets. Something
            beautiful is on its way to you ♥
          </p>

          <div className="mt-7">
            <NewsletterForm />
          </div>

          <ul className="mt-9 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.72rem] uppercase tracking-[0.16em] text-ink/70">
            {VALUES.map((v) => (
              <li key={v} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />
                {v}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 text-xs uppercase tracking-[0.24em] text-muted">
          marvelsazamgarh.in
        </p>
      </section>
    </main>
  );
}
