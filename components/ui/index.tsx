import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/format";
import { Star } from "lucide-react";

/* ---------------- Button ---------------- */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";
const buttonVariants: Record<string, string> = {
  primary: "bg-primary text-bg hover:bg-primary-hover",
  outline: "border border-primary/30 text-primary hover:bg-blush",
  ghost: "text-ink hover:bg-blush",
  gold: "bg-gold text-bg hover:brightness-95",
};
const buttonSizes: Record<string, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ComponentProps<typeof Link> & {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  return (
    <Link
      className={cn(buttonBase, buttonVariants[variant!], buttonSizes[size!], className)}
      {...props}
    />
  );
}

/* ---------------- Container ---------------- */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6", className)} {...props} />;
}

/* ---------------- Price ---------------- */
export function Price({
  price,
  mrp,
  className,
  size = "md",
}: {
  price: number;
  mrp: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const off = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const text = size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-medium text-ink", text)}>{inr(price)}</span>
      {off > 0 && (
        <>
          <span className="text-sm text-muted line-through">{inr(mrp)}</span>
          <span className="text-sm font-medium text-sale">{off}% off</span>
        </>
      )}
    </div>
  );
}

/* ---------------- Rating ---------------- */
export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm text-muted", className)}>
      <Star className="h-4 w-4 fill-gold text-gold" />
      <span className="font-medium text-ink">{value.toFixed(1)}</span>
      {count != null && <span>({count})</span>}
    </span>
  );
}

/* ---------------- Badge ---------------- */
export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-blush px-2.5 py-0.5 text-xs font-medium text-primary",
        className,
      )}
      {...props}
    />
  );
}

/* ---------------- Input ---------------- */
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
    {...props}
  />
);

/* ---------------- SectionHeading ---------------- */
export function SectionHeading({
  title,
  href,
  linkLabel = "View all",
  className,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <h2 className="font-display text-2xl text-primary sm:text-3xl">{title}</h2>
      {href && (
        <Link href={href} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-blush/60", className)} />;
}
