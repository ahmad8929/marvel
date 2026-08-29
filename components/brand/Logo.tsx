import { cn } from "@/lib/utils";

/** Monogram mark — gold hanger + heart, maroon serif M with a feminine sweep. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-label="Marvel's Online Clothings">
      <path
        d="M64 28 C60 21 52 19 52 12.5 C52 7.5 58 6.5 64 12.5 C70 6.5 76 7.5 76 12.5 C76 19 68 21 64 28 Z"
        className="fill-gold"
      />
      <path d="M64 27 C64 34 61 39 64 45" fill="none" strokeWidth="3.4" strokeLinecap="round" className="stroke-gold" />
      <path
        d="M64 45 L35 59.5 Q64 66.5 93 59.5 L64 45"
        fill="none"
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="stroke-gold"
      />
      <path
        d="M34 104 L34 68 Q49 90 64 100 Q79 90 94 68 L94 104"
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
      <circle cx="64" cy="66.5" r="3.6" className="fill-gold" />
      <path d="M64 70 C60 78 59 88 64 96 C69 88 68 78 64 70 Z" className="fill-gold" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-[0.18em]",
            tone === "light" ? "text-bg" : "text-primary",
          )}
        >
          MARVEL&apos;S
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.55rem] tracking-[0.34em]",
            tone === "light" ? "text-blush" : "text-muted",
          )}
        >
          ONLINE CLOTHINGS
        </span>
      </span>
    </span>
  );
}
