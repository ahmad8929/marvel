"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/stores/cart";
import { inr } from "@/lib/format";
import { Container, Button, ButtonLink, Input } from "@/components/ui";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function CartPage() {
  const { lines, setQty, remove, subtotal } = useCart();
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<{ discount: number; message: string | null; valid: boolean } | null>(null);

  const sub = subtotal();
  const discount = coupon?.valid ? coupon.discount : 0;

  async function applyCoupon() {
    const res = await fetch(`${API}/coupons/apply`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code,
        items: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
      }),
    });
    if (res.ok) setCoupon(await res.json());
  }

  if (lines.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-primary">Your bag is empty</h1>
        <p className="mt-2 text-muted">Let&apos;s find something you&apos;ll love.</p>
        <ButtonLink href="/collections/kurtis" className="mt-6">
          Shop new arrivals
        </ButtonLink>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="mb-8 font-display text-3xl text-primary">Your bag</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line">
          {lines.map((l) => (
            <li key={l.variantId} className="flex gap-4 py-5">
              <Link href={`/products/${l.productSlug}`} className="shrink-0">
                <div className="relative h-32 w-24 overflow-hidden rounded-lg bg-blush/40">
                  {l.image && <Image src={l.image} alt={l.title} fill sizes="96px" className="object-cover" />}
                </div>
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link href={`/products/${l.productSlug}`} className="text-sm font-medium hover:text-primary">
                    {l.title}
                  </Link>
                  <span className="text-sm font-medium">{inr(l.unitPrice * l.qty)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {l.size} · {l.color}
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-line">
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

        <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-xl text-primary">Order summary</h2>
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <Button variant="outline" size="sm" onClick={applyCoupon}>
              Apply
            </Button>
          </div>
          {coupon?.message && (
            <p className={`mt-2 text-xs ${coupon.valid ? "text-primary" : "text-sale"}`}>
              {coupon.valid ? "Coupon applied" : coupon.message}
            </p>
          )}

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{inr(sub)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary">
                <dt>Discount</dt>
                <dd>-{inr(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-muted">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{inr(sub - discount)}</dd>
            </div>
          </dl>

          <ButtonLink
            href={`/checkout${coupon?.valid ? `?coupon=${code}` : ""}`}
            className="mt-5 w-full"
            size="lg"
          >
            Checkout
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
