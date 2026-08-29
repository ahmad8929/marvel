"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  variantId: string;
  productSlug: string;
  title: string;
  size: string;
  color: string;
  colorHex: string | null;
  image: string;
  unitPrice: number; // paise, snapshot
  mrp: number;
  qty: number;
  maxStock: number;
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === line.variantId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === line.variantId
                  ? { ...l, qty: Math.min(l.maxStock, l.qty + qty) }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, qty: Math.min(line.maxStock, qty) }] };
        }),
      setQty: (variantId, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.variantId === variantId
                ? { ...l, qty: Math.max(0, Math.min(l.maxStock, qty)) }
                : l,
            )
            .filter((l) => l.qty > 0),
        })),
      remove: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((n, l) => n + l.qty, 0),
      subtotal: () => get().lines.reduce((n, l) => n + l.qty * l.unitPrice, 0),
    }),
    { name: "marvels-cart" },
  ),
);
