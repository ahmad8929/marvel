"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import type { Reviews as ReviewsData } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export function Reviews({ slug }: { slug: string }) {
  const { user, authFetch } = useAuth();
  const [data, setData] = useState<ReviewsData | null>(null);
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [msg, setMsg] = useState<string | null>(null);

  const load = () =>
    fetch(`${API}/products/${slug}/reviews`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => undefined);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await authFetch("/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productSlug: slug, ...form }),
    });
    if (res.ok) {
      const j = await res.json();
      setMsg(
        j.status === "PUBLISHED"
          ? "Thanks! Your review is live."
          : "Thanks! Your review will appear once approved.",
      );
      setForm({ rating: 5, title: "", body: "" });
      void load();
    } else {
      setMsg("Could not submit your review.");
    }
  }

  if (!data) return null;

  return (
    <section id="reviews" className="mt-14">
      <h2 className="font-display text-2xl text-primary">
        Reviews {data.total > 0 && <span className="text-muted">({data.total})</span>}
      </h2>

      {data.total > 0 && (
        <div className="mt-4 space-y-1">
          {data.breakdown.map((b) => (
            <div key={b.star} className="flex items-center gap-2 text-xs text-muted">
              <span className="w-8">{b.star}★</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-blush">
                <div
                  className="h-full bg-gold"
                  style={{ width: `${data.total ? (b.count / data.total) * 100 : 0}%` }}
                />
              </div>
              <span className="w-6 text-right">{b.count}</span>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-6 space-y-5">
        {data.reviews.map((r) => (
          <li key={r.id} className="border-b border-line pb-5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-line"}`}
                />
              ))}
            </div>
            {r.title && <p className="mt-1 text-sm font-medium">{r.title}</p>}
            <p className="mt-1 text-sm text-muted">{r.body}</p>
            <p className="mt-1 text-xs text-muted">
              {r.user.name} · {formatDate(r.createdAt)}
            </p>
          </li>
        ))}
        {data.reviews.length === 0 && (
          <li className="text-sm text-muted">No reviews yet. Be the first.</li>
        )}
      </ul>

      {user ? (
        <form onSubmit={submit} className="mt-8 max-w-lg space-y-3 rounded-xl border border-line bg-surface p-5">
          <p className="text-sm font-medium">Write a review</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-6 w-6 ${n <= form.rating ? "fill-gold text-gold" : "text-line"}`}
                />
              </button>
            ))}
          </div>
          <input
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm"
          />
          <textarea
            required
            placeholder="Share your experience"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            className="min-h-24 w-full rounded-lg border border-line bg-bg p-3 text-sm"
          />
          <Button type="submit" size="sm">
            Submit review
          </Button>
          {msg && <p className="text-sm text-primary">{msg}</p>}
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted">
          <a href="/login" className="text-primary underline">
            Sign in
          </a>{" "}
          to write a review.
        </p>
      )}
    </section>
  );
}
