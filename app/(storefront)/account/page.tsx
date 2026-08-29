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

export default function AccountOverview() {
  const { user, authFetch } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    authFetch("/orders")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setOrders(j.data ?? []))
      .catch(() => undefined);
  }, [authFetch]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="text-sm text-muted">Signed in as</p>
        <p className="font-medium">{user?.email}</p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-primary">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <li key={o.number} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{o.number}</span>
                  <span className="rounded-full bg-blush px-2 py-0.5 text-xs text-primary">
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {formatDate(o.createdAt)} · {inr(o.total)} · {o.items.length} item(s)
                </p>
                <Link
                  href={`/account/orders/${o.number}`}
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  View order
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
