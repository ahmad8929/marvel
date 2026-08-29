"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-client";
import { inr, formatDate } from "@/lib/format";

type OrderDetail = {
  number: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  codFee: number;
  total: number;
  couponCode: string | null;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  createdAt: string;
  items: {
    title: string;
    size: string;
    color: string;
    image: string;
    unitPrice: number;
    qty: number;
  }[];
  events: { status: string; note: string | null; createdAt: string }[];
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = use(params);
  const { authFetch } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    authFetch(`/orders/${number}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((j) => j && setOrder(j))
      .catch(() => setNotFound(true));
  }, [authFetch, number]);

  if (notFound) return <p className="text-sm text-muted">Order not found.</p>;
  if (!order) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="text-sm text-primary hover:underline">
        ← All orders
      </Link>

      <div className="rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl text-primary">{order.number}</h2>
          <span className="rounded-full bg-blush px-2.5 py-0.5 text-xs text-primary">
            {order.status}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          Placed {formatDate(order.createdAt)} · {order.paymentMethod} · {order.paymentStatus}
        </p>
        {order.trackingNumber && (
          <p className="mt-2 text-sm">
            Tracking: {order.trackingCarrier} · <strong>{order.trackingNumber}</strong>
          </p>
        )}
      </div>

      <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
        {order.items.map((it, i) => (
          <li key={i} className="flex gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image} alt={it.title} className="h-20 w-16 rounded-md object-cover" />
            <div className="flex flex-1 flex-col text-sm">
              <span className="font-medium">{it.title}</span>
              <span className="text-xs text-muted">
                {it.size} · {it.color} · Qty {it.qty}
              </span>
              <span className="mt-auto">{inr(it.unitPrice * it.qty)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5 text-sm">
          <h3 className="mb-2 font-medium">Delivery address</h3>
          <p className="text-muted">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
            {order.shippingAddress.pincode}
            <br />
            {order.shippingAddress.phone}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 text-sm">
          <h3 className="mb-2 font-medium">Summary</h3>
          <dl className="space-y-1 text-muted">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{inr(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-primary">
                <dt>Discount {order.couponCode ? `(${order.couponCode})` : ""}</dt>
                <dd>-{inr(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{order.shippingFee === 0 ? "Free" : inr(order.shippingFee)}</dd>
            </div>
            {order.codFee > 0 && (
              <div className="flex justify-between">
                <dt>COD fee</dt>
                <dd>{inr(order.codFee)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-1 font-medium text-ink">
              <dt>Total</dt>
              <dd>{inr(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-5">
        <h3 className="mb-3 font-medium">Timeline</h3>
        <ol className="space-y-3">
          {order.events.map((e, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <div>
                <p className="font-medium">{e.status}</p>
                {e.note && <p className="text-xs text-muted">{e.note}</p>}
                <p className="text-xs text-muted">{formatDate(e.createdAt)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
