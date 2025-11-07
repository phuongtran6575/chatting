import { create } from "zustand";
import type { User } from "../Types";



interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  setAuth: (user: User, role: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("access_token"),

  login: (token) => {
    localStorage.setItem("access_token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ token: null, user: null});
  },

  setAuth: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user});
  },
}));