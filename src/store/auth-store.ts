// Zustand auth store (mock)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/domain";

interface AuthState {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "tgdd-auth" },
  ),
);
