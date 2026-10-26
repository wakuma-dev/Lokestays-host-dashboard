import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  login as loginService,
  signup as signupService,
  logout as logoutService,
} from "../api/auth.api";
import type { LoginDataType, RegisterDataType } from "../types/auth.types";
import type { User } from "firebase/auth";

interface AuthState {
  readonly user: User | null;
  readonly loading: boolean;
  readonly isSubmitting: boolean;
  readonly error: string | null;
}

interface AuthActions {
  readonly setUser: (user: User | null) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly login: (data: LoginDataType) => Promise<void>;
  readonly signup: (data: RegisterDataType) => Promise<void>;
  readonly logOut: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      isSubmitting: false,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      login: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          const user = await loginService(data);
          set({ user, error: null });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to log in";
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isSubmitting: false });
        }
      },

      signup: async (data) => {
        set({ isSubmitting: true, error: null });
        try {
          await signupService(data);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create an account";
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isSubmitting: false });
        }
      },

      logOut: async () => {
        set({ isSubmitting: true, error: null });
        try {
          await logoutService();
          set({ user: null, error: null });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to logout";
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isSubmitting: false });
        }
      },
    }),
    { name: "auth-store" }
  )
);