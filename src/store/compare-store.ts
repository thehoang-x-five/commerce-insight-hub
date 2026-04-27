// Zustand compare store — max 4 products
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

const MAX = 4;

interface CompareState {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const { ids } = get();
        if (ids.includes(productId)) {
          set({ ids: ids.filter((i) => i !== productId) });
        } else {
          if (ids.length >= MAX) {
            toast.error(`Chỉ so sánh tối đa ${MAX} sản phẩm`);
            return;
          }
          set({ ids: [...ids, productId] });
        }
      },
      has: (productId) => get().ids.includes(productId),
      remove: (productId) => set((s) => ({ ids: s.ids.filter((i) => i !== productId) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "tgdd-compare" },
  ),
);
