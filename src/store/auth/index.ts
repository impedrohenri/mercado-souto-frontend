import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  clientId: number;
  tokenExpiresIn: number;
  roles: string[];
  token: string;
}

interface DecodedToken {
  email?: string;
  sub?: string;
  exp?: number;
  [key: string]: any;
}

interface AuthState {
  clientId: number | null;
  tokenExpiresIn: number | null;
  roles: string[];
  token: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  setUserEmail: (email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      clientId: null,
      tokenExpiresIn: null,
      roles: [],
      token: null,
      userEmail: null,
      isAuthenticated: false,

      setAuth: (data) => {
        let decoded: DecodedToken | null = null;

        try {
          decoded = jwtDecode<DecodedToken>(data.token);
        } catch (e) {
          console.error('Erro ao decodificar token:', e);
        }

        set({
          clientId: data.clientId,
          tokenExpiresIn: data.tokenExpiresIn,
          roles: data.roles,
          token: data.token,
          userEmail: decoded?.email || decoded?.sub || null,
          isAuthenticated: true,
        });
      },

      setUserEmail: (email) => set({ userEmail: email }),

      clearAuth: () =>
        set({
          clientId: null,
          tokenExpiresIn: null,
          roles: [],
          token: null,
          userEmail: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
