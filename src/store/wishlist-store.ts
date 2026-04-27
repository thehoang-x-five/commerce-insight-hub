// Zustand wishlist store with localStorage persistence
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((s) => ({
          ids: s.ids.includes(productId)
            ? s.ids.filter((i) => i !== productId)
            : [...s.ids, productId],
        })),
      has: (productId) => get().ids.includes(productId),
      remove: (productId) => set((s) => ({ ids: s.ids.filter((i) => i !== productId) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "tgdd-wishlist" },
  ),
);
