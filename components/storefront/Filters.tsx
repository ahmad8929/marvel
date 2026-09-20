"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, X } from "lucide-react";
import type { Colour } from "@/lib/types";

const SORTS = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
  ["rating", "Top rated"],
] as const;

const SIZES = ["S", "M", "L", "XL", "XXL"];

/** Pill button + floating panel; closes on outside click / Escape. */
function Popover({
  label,
  active,
  children,
}: {
  label: React.ReactNode;
  active?: boolean;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
          active || open
            ? "border-primary bg-primary text-bg"
            : "border-line bg-surface text-ink hover:border-primary/50"
        }`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute left-0 top-12 z-30 min-w-[220px] origin-top rounded-md border border-line bg-bg p-2 shadow-[0_20px_40px_-16px_rgba(43,26,34,0.35)] transition-all duration-200 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        {open && children(() => setOpen(false))}
      </div>
    </div>
  );
}

export function Filters({ colours }: { colours: Colour[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      next.delete("page");
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [params, pathname, router],
  );

  const get = (key: string) => params.get(key) ?? "";
  const sort = get("sort") || "featured";
  const size = get("size");
  const colour = get("color");
  const inStock = get("inStock") === "true";
  const activeCount = [size, colour, inStock ? "1" : "", sort !== "featured" ? "1" : ""].filter(Boolean).length;
  const sortLabel = SORTS.find(([v]) => v === sort)?.[1] ?? "Featured";
  const swatch = colours.find((c) => c.name === colour)?.hex;

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      {/* sort */}
      <Popover label={<span>Sort: <span className="font-medium">{sortLabel}</span></span>} active={sort !== "featured"}>
        {(close) => (
          <ul>
            {SORTS.map(([v, l]) => (
              <li key={v}>
                <button
                  onClick={() => {
                    setParam("sort", v === "featured" ? null : v);
                    close();
                  }}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-blush/60 ${
                    sort === v ? "text-primary" : "text-ink"
                  }`}
                >
                  {l}
                  {sort === v && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Popover>

      {/* size chips */}
      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface p-1">
        <span className="pl-3 pr-1 text-xs uppercase tracking-[0.14em] text-muted">Size</span>
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setParam("size", size === s ? null : s)}
            aria-pressed={size === s}
            className={`h-8 min-w-8 rounded-full px-2.5 text-xs font-medium transition-all duration-200 ${
              size === s ? "scale-105 bg-primary text-bg" : "text-ink hover:bg-blush"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* colour swatches */}
      {colours.length > 0 && (
        <Popover
          active={!!colour}
          label={
            <span className="flex items-center gap-2">
              {swatch && <span className="h-3.5 w-3.5 rounded-full border border-bg/50" style={{ background: swatch }} />}
              {colour || "Colour"}
            </span>
          }
        >
          {(close) => (
            <div className="max-h-72 w-[260px] overflow-y-auto p-1">
              <button
                onClick={() => {
                  setParam("color", null);
                  close();
                }}
                className="mb-1 w-full rounded px-3 py-2 text-left text-sm text-muted hover:bg-blush/60"
              >
                All colours
              </button>
              <div className="grid grid-cols-2 gap-1">
                {colours.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setParam("color", c.name);
                      close();
                    }}
                    className={`flex items-center gap-2 rounded px-2.5 py-2 text-left text-xs hover:bg-blush/60 ${
                      colour === c.name ? "bg-blush text-primary" : "text-ink"
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-line"
                      style={{ background: c.hex ?? "#ddd" }}
                    />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Popover>
      )}

      {/* in-stock switch */}
      <button
        role="switch"
        aria-checked={inStock}
        onClick={() => setParam("inStock", inStock ? null : "true")}
        className="flex h-10 shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface px-4 text-sm hover:border-primary/50"
      >
        <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${inStock ? "bg-primary" : "bg-line"}`}>
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-bg shadow transition-all duration-300 ${
              inStock ? "left-[1.125rem]" : "left-0.5"
            }`}
          />
        </span>
        In stock
      </button>

      {activeCount > 0 && (
        <button
          onClick={() => router.push(pathname)}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm text-primary hover:bg-blush"
        >
          <X className="h-4 w-4" /> Clear ({activeCount})
        </button>
      )}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(p));
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
