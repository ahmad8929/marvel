"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const GUEST_KEY = "marvels-wishlist";

function readGuest(): string[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { user, authFetch } = useAuth();
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Sync from localStorage after hydration to avoid an SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(readGuest().includes(productId));
  }, [productId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    const next = !on;
    setOn(next);

    const guest = new Set(readGuest());
    if (next) guest.add(productId);
    else guest.delete(productId);
    localStorage.setItem(GUEST_KEY, JSON.stringify([...guest]));

    if (user) {
      await authFetch(`/wishlist/${productId}`, {
        method: next ? "POST" : "DELETE",
      }).catch(() => undefined);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur transition hover:text-primary",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", on && "fill-primary text-primary")} />
    </button>
  );
}
