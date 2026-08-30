"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import { useCart } from "@/stores/cart";
import { useAuth } from "@/lib/auth-client";
import { inr } from "@/lib/format";
import type { Address, CartQuote } from "@/lib/types";
import { Container, Button, Input, Label } from "@/components/ui";
import { PriceBreakdown } from "@/components/storefront/PriceBreakdown";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
const CF_MODE =
  (process.env.NEXT_PUBLIC_CASHFREE_ENV as "sandbox" | "production") ?? "sandbox";

const EMPTY_ADDR = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, ready, authFetch } = useAuth();
  const { lines, clear } = useCart();

  const [method, setMethod] = useState<"CASHFREE" | "COD">("CASHFREE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState(EMPTY_ADDR);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | "new">("new");

  const [couponInput, setCouponInput] = useState(params.get("coupon") ?? "");
  const [coupon, setCoupon] = useState<string | undefined>(
    params.get("coupon") ?? undefined,
  );
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const items = useMemo(
    () => lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
    [lines],
  );

  // Prefill contact + saved addresses for signed-in users.
  useEffect(() => {
    if (!ready || !user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail((e) => e || user.email);
    authFetch("/addresses")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j: { data: Address[] }) => {
        setSavedAddresses(j.data);
        const def = j.data.find((a) => a.isDefault) ?? j.data[0];
        if (def) {
          setSelectedAddrId(def.id);
          setPhone(def.phone);
          setAddr({
            fullName: def.fullName,
            line1: def.line1,
            line2: def.line2 ?? "",
            city: def.city,
            state: def.state,
            pincode: def.pincode,
          });
        }
      })
      .catch(() => undefined);
  }, [ready, user, authFetch]);

  const refreshQuote = useCallback(async () => {
    if (items.length === 0) return;
    const res = await fetch(`${API}/cart/quote`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items, couponCode: coupon, cod: method === "COD" }),
    });
    if (res.ok) {
      const q: CartQuote = await res.json();
      setQuote(q);
      setCouponMsg(q.couponMessage);
      if (coupon && !q.couponApplied) setCoupon(undefined);
    }
  }, [items, coupon, method]);

  useEffect(() => {
    // Re-price whenever items, coupon or payment method change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshQuote();
  }, [refreshQuote]);

  function pickAddress(id: string) {
    setSelectedAddrId(id);
    if (id === "new") {
      setAddr(EMPTY_ADDR);
      return;
    }
    const a = savedAddresses.find((x) => x.id === id);
    if (a) {
      setPhone(a.phone);
      setAddr({
        fullName: a.fullName,
        line1: a.line1,
        line2: a.line2 ?? "",
        city: a.city,
        state: a.state,
        pincode: a.pincode,
      });
    }
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const payload = {
      items,
      contact: { email, phone },
      shippingAddress: {
        fullName: addr.fullName,
        phone,
        line1: addr.line1,
        line2: addr.line2 || undefined,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      },
      couponCode: coupon,
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
      if (data.devFallback) {
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
      <Container className="py-24 text-center">
        <h1 className="font-display text-3xl text-primary">Your bag is empty</h1>
        <Button className="mt-6" onClick={() => router.push("/collections/kurtis")}>
          Shop now
        </Button>
      </Container>
    );
  }

  const usingSaved = selectedAddrId !== "new";

  return (
    <Container className="py-12">
      <h1 className="mb-8 text-center font-display text-3xl uppercase tracking-[0.12em] text-primary">
        Checkout
      </h1>
      <form onSubmit={placeOrder} className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          {!user && (
            <p className="border border-line bg-surface p-3 text-sm text-muted">
              Checking out as a guest.{" "}
              <a href="/login?next=/checkout" className="text-primary underline">
                Sign in
              </a>{" "}
              for saved addresses and order history.
            </p>
          )}

          <fieldset className="space-y-3">
            <legend className="mb-3 font-display text-lg uppercase tracking-[0.1em] text-primary">
              Contact
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  required
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-3 font-display text-lg uppercase tracking-[0.1em] text-primary">
              Delivery address
            </legend>

            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                {savedAddresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer gap-3 border p-3 text-sm ${
                      selectedAddrId === a.id ? "border-primary bg-blush/40" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addr"
                      checked={selectedAddrId === a.id}
                      onChange={() => pickAddress(a.id)}
                      className="mt-1"
                    />
                    <span>
                      <strong>{a.fullName}</strong> · {a.phone}
                      <br />
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} - {a.pincode}
                    </span>
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-3 border border-line p-3 text-sm">
                  <input
                    type="radio"
                    name="addr"
                    checked={selectedAddrId === "new"}
                    onChange={() => pickAddress("new")}
                  />
                  Use a new address
                </label>
              </div>
            )}

            {(savedAddresses.length === 0 || !usingSaved) && (
              <div className="space-y-3 pt-1">
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" required value={addr.fullName} onChange={(e) => setAddr((f) => ({ ...f, fullName: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="line1">Address line 1</Label>
                  <Input id="line1" required value={addr.line1} onChange={(e) => setAddr((f) => ({ ...f, line1: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="line2">Address line 2 (optional)</Label>
                  <Input id="line2" value={addr.line2} onChange={(e) => setAddr((f) => ({ ...f, line2: e.target.value }))} />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required value={addr.city} onChange={(e) => setAddr((f) => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required value={addr.state} onChange={(e) => setAddr((f) => ({ ...f, state: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      required
                      inputMode="numeric"
                      pattern="\d{6}"
                      value={addr.pincode}
                      onChange={(e) => setAddr((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-3 font-display text-lg uppercase tracking-[0.1em] text-primary">
              Payment
            </legend>
            <label className="flex items-center gap-3 border border-line p-3 text-sm">
              <input type="radio" name="method" checked={method === "CASHFREE"} onChange={() => setMethod("CASHFREE")} />
              Pay online — UPI / Card / Netbanking (via Cashfree)
            </label>
            <label className="flex items-center gap-3 border border-line p-3 text-sm">
              <input type="radio" name="method" checked={method === "COD"} onChange={() => setMethod("COD")} />
              Cash on delivery
            </label>
          </fieldset>

          {error && <p className="text-sm text-sale">{error}</p>}
        </div>

        <aside className="h-fit border border-line bg-surface p-6">
          <h2 className="font-display text-lg uppercase tracking-[0.12em] text-primary">
            Order summary
          </h2>

          <ul className="mt-4 space-y-3 border-b border-line pb-4 text-sm">
            {lines.map((l) => (
              <li key={l.variantId} className="flex justify-between gap-2">
                <span className="text-muted">
                  {l.title} · {l.size}/{l.color} × {l.qty}
                </span>
                <span>{inr(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              className="rounded-none"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none"
              onClick={() => setCoupon(couponInput || undefined)}
            >
              Apply
            </Button>
          </div>
          {quote?.couponApplied && (
            <p className="mt-2 text-xs text-primary">Coupon applied</p>
          )}
          {couponMsg && !quote?.couponApplied && (
            <p className="mt-2 text-xs text-sale">{couponMsg}</p>
          )}

          <div className="mt-5">
            {quote ? (
              <PriceBreakdown quote={quote} showCod={method === "COD"} />
            ) : (
              <p className="text-sm text-muted">Calculating…</p>
            )}
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full rounded-none" disabled={busy}>
            {busy
              ? "Processing…"
              : method === "COD"
                ? `Place order · ${quote ? inr(quote.total) : ""}`
                : `Pay ${quote ? inr(quote.total) : "now"}`}
          </Button>
        </aside>
      </form>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Container className="py-24 text-center text-muted">Loading…</Container>}>
      <CheckoutInner />
    </Suspense>
  );
}
