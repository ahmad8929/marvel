"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { ProductCard } from "@/lib/types";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { inr } from "@/lib/format";

/**
 * Fast path to the bag from any product grid. One size + one colour → adds
 * instantly. Otherwise a compact sheet to pick, then adds and opens the drawer.
 */
export function QuickAdd({
  product,
  onClose,
  buyNow = false,
}: {
  product: ProductCard;
  onClose: () => void;
  buyNow?: boolean;
}) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);

  const colours = product.colours ?? [];
  const variants = product.variants ?? [];
  const [color, setColor] = useState(colours[0]?.name ?? "");
  const [size, setSize] = useState<string>("");

  const sizesForColor = useMemo(
    () =>
      variants
        .filter((v) => v.color === color)
        .sort((a, b) => a.size.localeCompare(b.size)),
    [variants, color],
  );

  const only = variants.length === 1 ? variants[0] : null;

  function commit(variantId: string, sz: string, col: string, colHex: string | null) {
    add(
      {
        variantId,
        productSlug: product.slug,
        title: product.title,
        size: sz,
        color: col,
        colorHex: colHex,
        image: (product.images ?? [])[0]?.url ?? "",
        unitPrice: product.price,
        mrp: product.mrp,
        maxStock:
          variants.find((v) => v.id === variantId)?.stock ?? 1,
      },
      1,
    );
    onClose();
    if (buyNow) router.push("/checkout");
    else openCart();
  }

  // Single-variant product: just add, no sheet.
  useEffect(() => {
    if (only) {
      commit(only.id, only.size, only.color, only.colorHex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (only) return null;

  const selected = variants.find((v) => v.color === color && v.size === size);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-bg p-5 sm:inset-x-auto sm:right-6 sm:top-1/2 sm:w-[360px] sm:-translate-y-1/2 sm:rounded-lg">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{product.title}</p>
            <p className="text-sm text-primary">{inr(product.price)}</p>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {colours.length > 1 && (
          <>
            <p className="mb-1.5 text-xs uppercase tracking-wide text-muted">Colour: {color}</p>
            <div className="mb-3 flex gap-2">
              {colours.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setColor(c.name);
                    setSize("");
                  }}
                  aria-pressed={c.name === color}
                  className={`h-8 w-8 rounded-full border-2 ${
                    c.name === color ? "border-primary" : "border-line"
                  }`}
                  style={{ background: c.hex ?? "#ccc" }}
                  title={c.name}
                />
              ))}
            </div>
          </>
        )}

        <p className="mb-1.5 text-xs uppercase tracking-wide text-muted">Size</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {sizesForColor.map((v) => (
            <button
              key={v.id}
              disabled={v.stock === 0}
              onClick={() => setSize(v.size)}
              aria-pressed={v.size === size}
              className={`min-w-10 border px-3 py-2 text-sm ${
                v.size === size
                  ? "border-primary bg-primary text-bg"
                  : "border-line hover:border-primary"
              } disabled:opacity-40`}
            >
              {v.size}
            </button>
          ))}
        </div>

        <button
          disabled={!selected || selected.stock === 0}
          onClick={() =>
            selected && commit(selected.id, selected.size, selected.color, selected.colorHex)
          }
          className="w-full bg-primary py-3 text-xs font-medium uppercase tracking-[0.14em] text-bg disabled:opacity-50"
        >
          {buyNow ? "Buy it now" : "Add to bag"}
        </button>
        {!selected && (
          <p className="mt-2 text-center text-xs text-muted">Select a size to continue</p>
        )}
      </div>
    </div>
  );
}
