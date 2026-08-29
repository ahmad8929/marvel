"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SORTS = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
  ["rating", "Top rated"],
] as const;

const SIZES = ["S", "M", "L", "XL"];

export function Filters({ colours }: { colours: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  const active = (key: string) => params.get(key) ?? "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={active("sort") || "featured"}
        onChange={(e) => setParam("sort", e.target.value)}
        className="h-9 rounded-full border border-line bg-surface px-3 text-sm"
        aria-label="Sort"
      >
        {SORTS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>

      <select
        value={active("size")}
        onChange={(e) => setParam("size", e.target.value || null)}
        className="h-9 rounded-full border border-line bg-surface px-3 text-sm"
        aria-label="Size"
      >
        <option value="">All sizes</option>
        {SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {colours.length > 0 && (
        <select
          value={active("color")}
          onChange={(e) => setParam("color", e.target.value || null)}
          className="h-9 rounded-full border border-line bg-surface px-3 text-sm"
          aria-label="Colour"
        >
          <option value="">All colours</option>
          {colours.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active("inStock") === "true"}
          onChange={(e) => setParam("inStock", e.target.checked ? "true" : null)}
        />
        In stock only
      </label>

      {[...params.keys()].some((k) => ["size", "color", "inStock", "sort"].includes(k)) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-primary underline underline-offset-4"
        >
          Clear
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
