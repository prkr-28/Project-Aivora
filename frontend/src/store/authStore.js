import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setToken: (token) => {
        // Also set in localStorage for api client
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("auth_token", token);
          } else {
            localStorage.removeItem("auth_token");
          }
        }
        set({
          token,
          isAuthenticated: !!token,
        });
      },
      logout: () => {
        // Clear both zustand store and localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
