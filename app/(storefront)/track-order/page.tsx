"use client";

import { useState } from "react";
import { Container, Button, Input, Label } from "@/components/ui";
import { formatDate } from "@/lib/format";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

type Result = {
  number: string;
  status: string;
  paymentStatus: string;
  trackingCarrier: string | null;
  trackingNumber: string | null;
  createdAt: string;
  events: { status: string; note: string | null; createdAt: string }[];
};

export default function TrackOrderPage() {
  const [form, setForm] = useState({ number: "", email: "" });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const res = await fetch(`${API}/track-order`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setResult(await res.json());
    else setError("No order found with those details.");
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl text-primary">Track your order</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Order number</Label>
            <Input
              required
              placeholder="MRVL-2026-000123"
              value={form.number}
              onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <Button type="submit" className="w-full">
            Track
          </Button>
          {error && <p className="text-sm text-sale">{error}</p>}
        </form>

        {result && (
          <div className="mt-8 rounded-xl border border-line bg-surface p-5">
            <p className="font-medium">{result.number}</p>
            <p className="text-sm text-muted">
              Status: {result.status} · Payment: {result.paymentStatus}
            </p>
            {result.trackingNumber && (
              <p className="mt-2 text-sm">
                {result.trackingCarrier}: <strong>{result.trackingNumber}</strong>
              </p>
            )}
            <ol className="mt-4 space-y-3">
              {result.events.map((e, i) => (
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
        )}
      </div>
    </Container>
  );
}
