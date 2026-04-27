// Address store with localStorage persistence
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}

interface AddressState {
  list: Address[];
  add: (a: Omit<Address, "id">) => void;
  update: (id: string, patch: Partial<Address>) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      list: [],
      add: (a) => set((s) => {
        const id = `addr${Date.now()}`;
        const isFirst = s.list.length === 0;
        return { list: [...s.list, { ...a, id, isDefault: isFirst || a.isDefault }] };
      }),
      update: (id, patch) => set((s) => ({ list: s.list.map((x) => x.id === id ? { ...x, ...patch } : x) })),
      remove: (id) => set((s) => ({ list: s.list.filter((x) => x.id !== id) })),
      setDefault: (id) => set((s) => ({ list: s.list.map((x) => ({ ...x, isDefault: x.id === id })) })),
    }),
    { name: "tgdd-addresses" },
  ),
);
