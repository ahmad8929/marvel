"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import { useCart } from "@/stores/cart";
import { inr } from "@/lib/format";
import { Container, Button, Input, Label } from "@/components/ui";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
const CF_MODE =
  (process.env.NEXT_PUBLIC_CASHFREE_ENV as "sandbox" | "production") ?? "sandbox";

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { lines, subtotal, clear } = useCart();
  const [method, setMethod] = useState<"CASHFREE" | "COD">("CASHFREE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const couponCode = params.get("coupon") ?? undefined;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const sub = subtotal();
  const items = useMemo(
    () => lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
    [lines],
  );

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const payload = {
      items,
      contact: { email: form.email, phone: form.phone },
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      couponCode,
    };

    try {
      const endpoint = method === "COD" ? "/checkout/cod" : "/checkout";
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not place order");

      if (method === "COD") {
        clear();
        router.push(`/checkout/success?order=${data.orderNumber}`);
        return;
      }

      // Cashfree
      if (data.devFallback) {
        // No gateway keys configured — verify directly (dev only).
        await fetch(`${API}/payments/verify`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderNumber: data.orderNumber }),
        });
        clear();
        router.push(`/checkout/success?order=${data.orderNumber}`);
        return;
      }

      const cashfree = await load({ mode: CF_MODE });
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });
      // Back from the modal — verify then route.
      await fetch(`${API}/payments/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderNumber: data.orderNumber }),
      });
      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-primary">Your bag is empty</h1>
        <Button className="mt-6" onClick={() => router.push("/collections/kurtis")}>
          Shop now
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="mb-8 font-display text-3xl text-primary">Checkout</h1>
      <form onSubmit={placeOrder} className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <fieldset className="space-y-3">
            <legend className="mb-2 font-display text-lg text-primary">Contact</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-2 font-display text-lg text-primary">Shipping address</legend>
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="line1">Address line 1</Label>
              <Input id="line1" required value={form.line1} onChange={(e) => set("line1", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="line2">Address line 2 (optional)</Label>
              <Input id="line2" value={form.line2} onChange={(e) => set("line2", e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" required value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" required value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  required
                  inputMode="numeric"
                  pattern="\d{6}"
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-2 font-display text-lg text-primary">Payment</legend>
            <label className="flex items-center gap-3 rounded-lg border border-line p-3 text-sm">
              <input type="radio" name="method" checked={method === "CASHFREE"} onChange={() => setMethod("CASHFREE")} />
              Pay online (UPI / Card / Netbanking) — via Cashfree
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-line p-3 text-sm">
              <input type="radio" name="method" checked={method === "COD"} onChange={() => setMethod("COD")} />
              Cash on delivery
            </label>
          </fieldset>

          {error && <p className="text-sm text-sale">{error}</p>}
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-xl text-primary">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.variantId} className="flex justify-between gap-2">
                <span className="text-muted">
                  {l.title} · {l.size}/{l.color} × {l.qty}
                </span>
                <span>{inr(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-medium">
            <span>Subtotal</span>
            <span>{inr(sub)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Shipping, discounts &amp; COD fee are applied on the next step.
          </p>
          <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy}>
            {busy ? "Processing…" : method === "COD" ? "Place order" : "Pay now"}
          </Button>
        </aside>
      </form>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Container className="py-20 text-center text-muted">Loading…</Container>}>
      <CheckoutInner />
    </Suspense>
  );
}
