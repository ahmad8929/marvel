"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { inr } from "@/lib/format";

type Item = {
  productId: string;
  product: {
    title: string;
    slug: string;
    price: number;
    mrp: number;
    images: { url: string; alt: string | null }[];
  };
};

export default function WishlistPage() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    authFetch("/wishlist")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setItems(j.data ?? []))
      .catch(() => setItems([]));
  }, [authFetch]);

  if (items === null) return <p className="text-sm text-muted">Loading…</p>;
  if (items.length === 0)
    return (
      <p className="text-sm text-muted">
        Your wishlist is empty.{" "}
        <Link href="/collections/kurtis" className="text-primary underline">
          Browse
        </Link>
      </p>
    );

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {items.map((it) => (
        <Link key={it.productId} href={`/products/${it.product.slug}`} className="group">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-blush/40">
            {it.product.images[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={it.product.images[0].url}
                alt={it.product.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <p className="mt-2 line-clamp-1 text-sm font-medium">{it.product.title}</p>
          <p className="text-sm text-muted">{inr(it.product.price)}</p>
        </Link>
      ))}
    </div>
  );
}
