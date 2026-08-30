"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { ProductDetail } from "@/lib/types";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { Button } from "@/components/ui";
import { WishlistButton } from "./WishlistButton";

export function BuyBox({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const colours = product.colours;
  const [color, setColor] = useState(colours[0]?.name ?? "");
  const [size, setSize] = useState<string>("");
  const [added, setAdded] = useState(false);

  const sizesForColor = useMemo(
    () =>
      product.variants
        .filter((v) => v.color === color)
        .sort((a, b) => a.size.localeCompare(b.size)),
    [product.variants, color],
  );

  const selected = product.variants.find((v) => v.color === color && v.size === size);

  function addToCart() {
    if (!selected) return;
    add(
      {
        variantId: selected.id,
        productSlug: product.slug,
        title: product.title,
        size: selected.size,
        color: selected.color,
        colorHex: selected.colorHex,
        image: product.images[0]?.url ?? "",
        unitPrice: selected.priceOverride ?? product.price,
        mrp: product.mrp,
        maxStock: selected.stock,
      },
      1,
    );
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-6">
      {colours.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Colour: <span className="text-muted">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colours.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setColor(c.name);
                  setSize("");
                }}
                aria-pressed={c.name === color}
                title={c.name}
                className={`h-9 w-9 rounded-full border-2 ${
                  c.name === color ? "border-primary" : "border-line"
                }`}
                style={{ background: c.hex ?? "#ccc" }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizesForColor.map((v) => (
            <button
              key={v.id}
              disabled={v.stock === 0}
              onClick={() => setSize(v.size)}
              aria-pressed={v.size === size}
              className={`min-w-11 rounded-lg border px-3 py-2 text-sm ${
                v.size === size
                  ? "border-primary bg-primary text-bg"
                  : "border-line hover:border-primary"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {v.size}
            </button>
          ))}
        </div>
        {selected && selected.stock > 0 && selected.stock <= 4 && (
          <p className="mt-2 text-xs text-sale">Only {selected.stock} left</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={addToCart}
          disabled={!selected || selected.stock === 0}
          className="flex-1"
          size="lg"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : selected && selected.stock === 0 ? (
            "Sold out"
          ) : (
            "Add to bag"
          )}
        </Button>
        <div className="grid place-items-center rounded-full border border-line px-3">
          <WishlistButton productId={product.id} className="bg-transparent shadow-none" />
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        disabled={!selected || selected.stock === 0}
        onClick={() => {
          addToCart();
          router.push("/checkout");
        }}
      >
        Buy it now
      </Button>

      <div className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
        <PincodeCheck />
      </div>
    </div>
  );
}

function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (/^\d{6}$/.test(pin)) {
          const days = 3 + (Number(pin[5]) % 4);
          setMsg(`Delivers in ~${days}–${days + 2} days · COD available`);
        } else {
          setMsg("Enter a valid 6-digit pincode");
        }
      }}
      className="flex items-center gap-2"
    >
      <input
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="Delivery pincode"
        className="h-9 flex-1 rounded-lg border border-line bg-bg px-3 text-sm text-ink"
      />
      <button type="submit" className="text-sm font-medium text-primary">
        Check
      </button>
      {msg && <span className="sr-only">{msg}</span>}
      {msg && <p className="basis-full pt-1 text-xs text-ink">{msg}</p>}
    </form>
  );
}
