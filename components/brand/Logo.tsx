import { useId } from "react";
import { cn } from "@/lib/utils";
import { LOGO } from "./logo-paths";

type Tone = "dark" | "light" | "pink";
const MAROON = "#57102A";

const GOLD_LIGHT = ["#F6DA8E", "#E8B84F", "#EFC768", "#D19A38", "#F0CB6E"];
const GOLD_DEEP = ["#D9A845", "#B98428", "#CE9A3B"];
const PINK = ["#EE8DAF", "#D9527F", "#E77399"];

/** Two gradients per logo: `${id}m` for the main strokes, `${id}a` for accents. */
function Defs({ id, tone }: { id: string; tone: Tone }) {
  const main = tone === "light" ? GOLD_LIGHT : tone === "pink" ? PINK : null;
  const accent = tone === "light" ? GOLD_LIGHT : GOLD_DEEP;
  const grad = (gid: string, stops: string[]) => (
    <linearGradient id={gid} x1="150" y1="150" x2="640" y2="660" gradientUnits="userSpaceOnUse">
      {stops.map((c, i) => (
        <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
      ))}
    </linearGradient>
  );
  return (
    <defs>
      {main && grad(`${id}m`, main)}
      {grad(`${id}a`, accent)}
    </defs>
  );
}

const colours = (tone: Tone, id: string) => ({
  main: tone === "dark" ? MAROON : `url(#${id}m)`,
  accent: `url(#${id}a)`,
});

/** Monogram: frame + M + laurel. */
export function LogoMark({ className, tone = "dark" }: { className?: string; tone?: Tone }) {
  const id = useId().replace(/:/g, "");
  const c = colours(tone, id);
  return (
    <svg viewBox="226 140 372 318" className={className} role="img" aria-label="Marvel’s">
      <Defs id={id} tone={tone} />
      <path d={LOGO.frame} fill="none" stroke={c.main} strokeWidth={5.5} strokeLinecap="square" />
      <path d={LOGO.m} fill={c.main} />
      <g fill={c.accent}>
        <path d={LOGO.stem} fill="none" stroke={c.accent} strokeWidth={4} strokeLinecap="round" />
        {LOGO.leaves.map((l, i) => (
          <path key={i} transform={l.t} d={l.d} />
        ))}
      </g>
    </svg>
  );
}

/** "MARVEL’S — CLOTHING" lettering, outlined (no font needed). */
export function LogoWordmark({ className, tone = "dark" }: { className?: string; tone?: Tone }) {
  const id = useId().replace(/:/g, "");
  const c = colours(tone, id);
  return (
    <svg viewBox="122 476 534 190" className={className} role="img" aria-label="Marvel’s Clothing">
      <Defs id={id} tone={tone} />
      <path d={LOGO.wordmark} fill={c.main} />
      <path d={LOGO.clothing} fill={c.main} />
      <path d={LOGO.lineL} fill={c.accent} />
      <path d={LOGO.lineR} fill={c.accent} />
      <path d={LOGO.star} fill={c.accent} />
    </svg>
  );
}

/** Header / footer lockup: mark + wordmark side by side. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: Tone }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} className="h-11 w-auto shrink-0" />
      <LogoWordmark tone={tone} className="h-10 w-auto shrink-0" />
    </span>
  );
}

/** Full stacked logo for splash / auth / 404 pages. */
export function LogoStacked({ className, tone = "dark" }: { className?: string; tone?: Tone }) {
  const id = useId().replace(/:/g, "");
  const c = colours(tone, id);
  return (
    <svg viewBox="120 140 540 530" className={className} role="img" aria-label="Marvel’s Clothing">
      <Defs id={id} tone={tone} />
      <path d={LOGO.frame} fill="none" stroke={c.main} strokeWidth={5.5} strokeLinecap="square" />
      <path d={LOGO.m} fill={c.main} />
      <g fill={c.accent}>
        <path d={LOGO.stem} fill="none" stroke={c.accent} strokeWidth={4} strokeLinecap="round" />
        {LOGO.leaves.map((l, i) => (
          <path key={i} transform={l.t} d={l.d} />
        ))}
      </g>
      <path d={LOGO.wordmark} fill={c.main} />
      <path d={LOGO.clothing} fill={c.main} />
      <path d={LOGO.lineL} fill={c.accent} />
      <path d={LOGO.lineR} fill={c.accent} />
      <path d={LOGO.star} fill={c.accent} />
    </svg>
  );
}
