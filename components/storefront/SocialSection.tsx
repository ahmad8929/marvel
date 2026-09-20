"use client";

import Image from "next/image";
import { Container } from "@/components/ui";

type Social = {
  name: string;
  handle: string;
  href: string;
  /** static Tailwind classes for the pill's hover fill */
  hover: string;
  icon: React.ReactNode;
};

/** Follow-us section: a drifting strip of our own photos, then two pill buttons. */
export function SocialSection({ socials, photos }: { socials: Social[]; photos: string[] }) {
  const strip = photos.slice(0, 12);
  const track = (hidden: boolean) => (
    <div key={String(hidden)} aria-hidden={hidden} className="flex shrink-0 gap-4 pr-4">
      {strip.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`group relative h-64 w-48 shrink-0 overflow-hidden rounded-[999px_999px_14px_14px] bg-bg/10 ${
            i % 2 ? "translate-y-6" : ""
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="192px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-primary py-16 text-bg">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />

      <Container className="relative flex flex-col items-center text-center">
        <p className={`font-script text-2xl text-gold`}>Join the family</p>
        <h2 className={`mt-1 font-display text-3xl uppercase tracking-[0.2em]`}>
          Follow Marvel&apos;s
        </h2>
        <p className={`mt-3 max-w-md text-sm text-blush`}>
          New styles, behind-the-scenes and first looks ♥
        </p>
      </Container>

      {/* drifting photo strip (arched frames) */}
      {strip.length > 0 && (
        <div
          className={`relative mt-12 overflow-hidden pb-8 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]`}
        >
          <div className="flex w-max motion-safe:animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused]">
            {track(false)}
            {track(true)}
          </div>
        </div>
      )}

      <Container className="relative flex flex-wrap items-center justify-center gap-4">
        {socials.map((c) => (
          <a
            key={c.name}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className={`group relative flex items-center gap-3 overflow-hidden rounded-full border border-bg/40 px-7 py-3.5 transition-all duration-500 hover:-translate-y-1 hover:border-transparent ${c.hover}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              {c.icon}
            </svg>
            <span className="text-left">
              <span className="block text-[0.68rem] font-medium uppercase tracking-[0.22em]">{c.name}</span>
              <span className="block text-xs text-blush group-hover:text-bg">{c.handle}</span>
            </span>
            {/* light sweep on hover */}
            <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100" />
          </a>
        ))}
      </Container>
    </section>
  );
}
