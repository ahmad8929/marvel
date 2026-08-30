"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/stores/cart";
import { inr } from "@/lib/format";
import type { CartQuote } from "@/lib/types";
import { Container, Button, ButtonLink, Input } from "@/components/ui";
import { PriceBreakdown } from "@/components/storefront/PriceBreakdown";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const refreshQuote = useCallback(
    async (couponCode?: string | null) => {
      if (lines.length === 0) {
        setQuote(null);
        return;
      }
      const res = await fetch(`${API}/cart/quote`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
          couponCode: couponCode ?? undefined,
        }),
      });
      if (res.ok) {
        const q: CartQuote = await res.json();
        setQuote(q);
        setCouponMsg(q.couponMessage);
        if (couponCode && q.couponApplied) setApplied(couponCode);
        if (couponCode && !q.couponApplied) setApplied(null);
      }
    },
    [lines],
  );

  useEffect(() => {
    // Re-price on the server whenever the cart contents change.
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    void refreshQuote(applied);
  }, [lines]);

  if (lines.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-3xl text-primary">Your bag is empty</h1>
        <p className="mt-2 text-muted">Let&apos;s find something you&apos;ll love.</p>
        <ButtonLink href="/collections/kurtis" className="mt-6">
          Shop new arrivals
        </ButtonLink>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <h1 className="mb-8 text-center font-display text-3xl uppercase tracking-[0.12em] text-primary">
        Your Bag
      </h1>
      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line border-t border-line">
          {lines.map((l) => (
            <li key={l.variantId} className="flex gap-4 py-6">
              <Link href={`/products/${l.productSlug}`} className="shrink-0">
                <div className="relative h-36 w-28 overflow-hidden bg-blush/40">
                  {l.image && (
                    <Image src={l.image} alt={l.title} fill sizes="112px" className="object-cover" />
                  )}
                </div>
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link
                    href={`/products/${l.productSlug}`}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {l.title}
                  </Link>
                  <span className="text-sm font-medium">{inr(l.unitPrice * l.qty)}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {l.size} · {l.color}
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center border border-line">
                    <button className="p-2" onClick={() => setQty(l.variantId, l.qty - 1)} aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{l.qty}</span>
                    <button className="p-2" onClick={() => setQty(l.variantId, l.qty + 1)} aria-label="Increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(l.variantId)}
                    className="flex items-center gap-1 text-xs text-muted hover:text-sale"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-line bg-surface p-6">
          <h2 className="font-display text-lg uppercase tracking-[0.12em] text-primary">
            Order summary
          </h2>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="rounded-none"
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-none"
              onClick={() => refreshQuote(code)}
            >
              Apply
            </Button>
          </div>
          {applied && quote?.couponApplied && (
            <p className="mt-2 text-xs text-primary">
              Coupon <strong>{applied}</strong> applied
            </p>
          )}
          {couponMsg && !quote?.couponApplied && (
            <p className="mt-2 text-xs text-sale">{couponMsg}</p>
          )}

          <div className="mt-5">
            {quote ? (
              <PriceBreakdown quote={quote} />
            ) : (
              <p className="text-sm text-muted">Calculating…</p>
            )}
          </div>

          <ButtonLink
            href={`/checkout${applied && quote?.couponApplied ? `?coupon=${applied}` : ""}`}
            className="mt-6 w-full rounded-none"
            size="lg"
          >
            Proceed to Checkout
          </ButtonLink>
          <Link
            href="/collections/kurtis"
            className="mt-3 block text-center text-sm text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </Container>
  );
}
