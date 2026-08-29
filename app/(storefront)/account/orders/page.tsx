"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { inr, formatDate } from "@/lib/format";

type OrderRow = {
  number: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: { title: string; image: string; qty: number }[];
};

export default function OrdersPage() {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    authFetch("/orders")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setOrders(j.data ?? []))
      .catch(() => setOrders([]));
  }, [authFetch]);

  if (orders === null) return <p className="text-sm text-muted">Loading…</p>;
  if (orders.length === 0) return <p className="text-sm text-muted">You have no orders yet.</p>;

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.number} className="rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">{o.number}</span>
            <span className="rounded-full bg-blush px-2.5 py-0.5 text-xs text-primary">
              {o.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Placed {formatDate(o.createdAt)} · {inr(o.total)} · Payment {o.paymentStatus}
          </p>
          <div className="mt-3 flex gap-2">
            {o.items.slice(0, 4).map((it, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={it.image}
                alt={it.title}
                className="h-14 w-12 rounded-md object-cover"
              />
            ))}
          </div>
          <Link
            href={`/account/orders/${o.number}`}
            className="mt-3 inline-block text-sm text-primary hover:underline"
          >
            View details
          </Link>
        </li>
      ))}
    </ul>
  );
}
