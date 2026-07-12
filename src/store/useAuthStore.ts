import { create } from "zustand";
import * as api from "@/lib/api";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  isAdmin: boolean;
  email: string | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAdmin: false,
  email: null,
  status: "idle",

  hydrate: async () => {
    set({ status: "loading" });
    try {
      const { isAdmin, email } = await api.fetchMe();
      set({ isAdmin, email, status: isAdmin ? "authenticated" : "unauthenticated" });
    } catch {
      set({ isAdmin: false, email: null, status: "unauthenticated" });
    }
  },

  login: async (email, password) => {
    const { token, user } = await api.login(email, password);
    api.setAuthToken(token);
    set({ isAdmin: true, email: user.email, status: "authenticated" });
  },

  logout: async () => {
    try {
      await api.logout();
    } finally {
      api.clearAuthToken();
    }
    set({ isAdmin: false, email: null, status: "unauthenticated" });
  },
}));
