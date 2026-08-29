"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/stores/cart";
import { inr } from "@/lib/format";
import { ButtonLink } from "@/components/ui";

export function CartDrawer({
  open,
  onClose,
  freeShipThreshold,
}: {
  open: boolean;
  onClose: () => void;
  freeShipThreshold: number;
}) {
  const { lines, setQty, remove, subtotal } = useCart();
  const total = subtotal();
  const toFree = Math.max(0, freeShipThreshold - total);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bg shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="Shopping bag"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl text-primary">Your bag ({lines.length})</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-blush">
            <X className="h-5 w-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Your bag is empty.</p>
            <ButtonLink href="/collections/kurtis" onClick={onClose}>
              Start shopping
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {toFree > 0 ? (
                <p className="mb-4 rounded-lg bg-blush px-3 py-2 text-xs text-primary">
                  Add {inr(toFree)} more for free shipping
                </p>
              ) : (
                <p className="mb-4 rounded-lg bg-blush px-3 py-2 text-xs text-primary">
                  You&apos;ve unlocked free shipping ♥
                </p>
              )}
              <ul className="space-y-4">
                {lines.map((l) => (
                  <li key={l.variantId} className="flex gap-3">
                    <Link href={`/products/${l.productSlug}`} onClick={onClose} className="shrink-0">
                      <div className="relative h-24 w-20 overflow-hidden rounded-md bg-blush/40">
                        {l.image && <Image src={l.image} alt={l.title} fill className="object-cover" sizes="80px" />}
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <span className="line-clamp-2 text-sm font-medium">{l.title}</span>
                        <button onClick={() => remove(l.variantId)} aria-label="Remove">
                          <Trash2 className="h-4 w-4 text-muted hover:text-sale" />
                        </button>
                      </div>
                      <span className="text-xs text-muted">
                        {l.size} · {l.color}
                      </span>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            className="p-1.5"
                            onClick={() => setQty(l.variantId, l.qty - 1)}
                            aria-label="Decrease"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm">{l.qty}</span>
                          <button
                            className="p-1.5"
                            onClick={() => setQty(l.variantId, l.qty + 1)}
                            aria-label="Increase"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{inr(l.unitPrice * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-line px-5 py-4">
              <div className="mb-3 flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{inr(total)}</span>
              </div>
              <p className="mb-3 text-xs text-muted">Shipping &amp; taxes calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-2">
                <ButtonLink href="/cart" variant="outline" onClick={onClose}>
                  View bag
                </ButtonLink>
                <ButtonLink href="/checkout" onClick={onClose}>
                  Checkout
                </ButtonLink>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
