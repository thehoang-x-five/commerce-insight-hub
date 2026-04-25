// Lightweight UI store (cart drawer, mobile nav, etc.)
import { create } from "zustand";

interface UiState {
  cartDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartDrawerOpen: false,
  openCart: () => set({ cartDrawerOpen: true }),
  closeCart: () => set({ cartDrawerOpen: false }),
  toggleCart: () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),
}));
