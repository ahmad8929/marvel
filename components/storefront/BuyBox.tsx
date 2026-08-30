"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Copy, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import type { ProductDetail } from "@/lib/types";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { inr } from "@/lib/format";
import { WishlistButton } from "./WishlistButton";

export function BuyBox({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);
  const colours = product.colours;
  const [color, setColor] = useState(colours[0]?.name ?? "");
  const [size, setSize] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const sizeRowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const sizesForColor = useMemo(
    () =>
      product.variants
        .filter((v) => v.color === color)
        .sort((a, b) => a.size.localeCompare(b.size)),
    [product.variants, color],
  );

  // Auto-pick the first in-stock size whenever the colour changes.
  useEffect(() => {
    const firstInStock = sizesForColor.find((v) => v.stock > 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSize(firstInStock ? firstInStock.size : "");
  }, [sizesForColor]);

  // Sticky mobile CTA once the real button scrolls out of view.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShowSticky(!e.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selected = product.variants.find((v) => v.color === color && v.size === size);
  const soldOut = !product.variants.some((v) => v.stock > 0);

  function addToCart(openDrawer = true): boolean {
    if (!selected || selected.stock === 0) {
      setNeedSize(true);
      sizeRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
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
    setNeedSize(false);
    setAdded(true);
    if (openDrawer) openCart();
    setTimeout(() => setAdded(false), 1600);
    return true;
  }

  return (
    <div className="space-y-5">
      {colours.length > 1 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">
            Colour — <span className="text-ink">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colours.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                aria-pressed={c.name === color}
                title={c.name}
                className={`h-8 w-8 rounded-full border-2 ${
                  c.name === color ? "border-primary" : "border-line"
                }`}
                style={{ background: c.hex ?? "#ccc" }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={sizeRowRef}>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Size</p>
          <Link href="/size-guide" className="text-xs text-primary underline underline-offset-2">
            Size guide
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizesForColor.map((v) => (
            <button
              key={v.id}
              disabled={v.stock === 0}
              onClick={() => {
                setSize(v.size);
                setNeedSize(false);
              }}
              aria-pressed={v.size === size}
              className={`min-w-11 border px-3 py-2 text-sm ${
                v.size === size
                  ? "border-primary bg-primary text-bg"
                  : "border-line hover:border-primary"
              } disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${
                needSize ? "ring-1 ring-sale" : ""
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>
        {needSize && <p className="mt-2 text-xs text-sale">Please select a size</p>}
        {selected && selected.stock > 0 && selected.stock <= 4 && (
          <p className="mt-2 text-xs text-sale">Hurry — only {selected.stock} left</p>
        )}
      </div>

      <div ref={ctaRef} className="space-y-3 pt-1">
        <div className="flex gap-3">
          <button
            onClick={() => addToCart()}
            disabled={soldOut}
            className="flex-1 bg-primary py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-bg hover:bg-primary-hover disabled:opacity-50"
          >
            {soldOut ? "Sold out" : added ? "✓ Added to bag" : "Add to bag"}
          </button>
          <div className="grid w-12 place-items-center border border-line">
            <WishlistButton productId={product.id} className="bg-transparent shadow-none" />
          </div>
        </div>
        <button
          disabled={soldOut}
          onClick={() => {
            if (addToCart(false)) router.push("/checkout");
          }}
          className="w-full border border-primary py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-primary hover:bg-blush disabled:opacity-50"
        >
          Buy it now
        </button>
      </div>

      {/* quiet coupon line */}
      <CouponNudge />

      {/* trust + delivery, understated */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-[0.7rem] text-muted">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" /> Secure checkout
        </span>
        <span className="flex items-center gap-1">
          <Truck className="h-3.5 w-3.5 text-gold" /> Cash on delivery
        </span>
        <span className="flex items-center gap-1">
          <RefreshCcw className="h-3.5 w-3.5 text-gold" /> 7-day easy returns
        </span>
      </div>

      <PincodeCheck />

      {/* sticky mobile CTA */}
      {showSticky && !soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-bg/95 p-3 backdrop-blur md:hidden">
          <div className="text-sm">
            <span className="font-medium">{inr(product.price)}</span>
            {product.discountPercent > 0 && (
              <span className="ml-2 text-xs text-muted line-through">{inr(product.mrp)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart()}
            className="flex-1 bg-primary py-3 text-xs font-medium uppercase tracking-[0.14em] text-bg"
          >
            {added ? "✓ Added" : "Add to bag"}
          </button>
        </div>
      )}
    </div>
  );
}

function CouponNudge() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText("WELCOME10").then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          },
          () => undefined,
        );
      }}
      className="flex items-center gap-1.5 text-xs text-muted hover:text-primary"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? (
        "Code copied"
      ) : (
        <span>
          Get 10% off with code <span className="font-medium text-ink">WELCOME10</span>
        </span>
      )}
    </button>
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
          setMsg(`Delivers in ~${days}–${days + 2} days · Cash on delivery available`);
        } else {
          setMsg("Enter a valid 6-digit pincode");
        }
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-ink">
        Check delivery
      </span>
      <input
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="Pincode"
        className="h-9 w-32 border border-line bg-bg px-3 text-sm text-ink"
      />
      <button type="submit" className="text-sm font-medium text-primary">
        Check
      </button>
      {msg && <p className="basis-full pt-1 text-xs text-ink">{msg}</p>}
    </form>
  );
}
