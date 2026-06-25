import { create } from 'zustand';
import { User } from '@devglobal/shared';
import { apiClient } from '@/lib/api-client';
import { authUtils } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { user, accessToken } = response.data.data;

    console.log('🔍 Login response user:', JSON.stringify(user, null, 2));
    console.log('🔍 User role from backend:', user.role);

    authUtils.setTokens(accessToken, response.data.data.refreshToken);
    authUtils.setUser(user);
    document.cookie = `accessToken=${accessToken}; path=/; max-age=900`;
    document.cookie = `userRole=${user.role}; path=/; max-age=900`;

    set({ user, isAuthenticated: true });
  },

  register: async (email: string, password: string, fullName?: string) => {
    const response = await apiClient.post('/auth/register', { email, password, fullName });
    const { user, tokens } = response.data.data;

    authUtils.setTokens(tokens.accessToken, tokens.refreshToken);
    authUtils.setUser(user);
    document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=900`;
    document.cookie = `userRole=${user.role}; path=/; max-age=900`;

    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      const refreshToken = authUtils.getRefreshToken();
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Ignore errors during logout
    } finally {
      authUtils.clearAuth();
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'userRole=; path=/; max-age=0';
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchUser: async () => {
    try {
      if (!authUtils.isAuthenticated()) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const response = await apiClient.get('/auth/me');
      const user = response.data.data;
      console.log('🔍 fetchUser response:', JSON.stringify(user, null, 2));

      authUtils.setUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      authUtils.clearAuth();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
}));