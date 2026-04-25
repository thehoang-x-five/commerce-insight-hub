// Zustand cart store with localStorage persistence
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/domain";

interface CartState {
  items: CartItem[];
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalQuantity: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId, quantity = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...s.items, { productId, quantity }] };
        }),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((s) => ({
          items: quantity <= 0
            ? s.items.filter((i) => i.productId !== productId)
            : s.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
      totalQuantity: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "tgdd-cart" },
  ),
);
