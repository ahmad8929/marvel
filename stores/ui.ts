"use client";

import { create } from "zustand";

type UIState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  navOpen: false,
  setNavOpen: (v) => set({ navOpen: v }),
}));
