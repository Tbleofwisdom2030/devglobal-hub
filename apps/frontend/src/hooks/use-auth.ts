'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@devglobal/ui';
import { apiClient } from '@/lib/api-client';
import { authUtils } from '@/lib/auth';

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, login, register, logout, fetchUser, setUser } =
    useAuthStore();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        // ✅ Call the API directly and check role BEFORE updating store
        const response = await apiClient.post('/auth/login', { email, password });
        const { user: loginUser, accessToken } = response.data.data;

        console.log('🔍 Role check:', loginUser.role);

        // Save tokens
        authUtils.setTokens(accessToken, response.data.data.refreshToken);
        authUtils.setUser(loginUser);
        document.cookie = `accessToken=${accessToken}; path=/; max-age=900`;
        document.cookie = `userRole=${loginUser.role}; path=/; max-age=900`;

        // Update store
        setUser(loginUser);

        toast({
          title: 'Welcome back!',
          description: 'You have been logged in successfully.',
          variant: 'success',
        });

        // ✅ Redirect based on role from API response
        if (loginUser.role === 'ADMIN') {
          console.log('🔍 Redirecting to /admin');
          router.push('/admin');
        } else {
          console.log('🔍 Redirecting to /dashboard');
          router.push('/dashboard');
        }
      } catch (error: any) {
        const message =
          error.response?.data?.error || 'Login failed. Please try again.';
        toast({
          title: 'Login failed',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [router, toast, setUser]
  );

  const handleRegister = useCallback(
    async (email: string, password: string, fullName?: string) => {
      try {
        await register(email, password, fullName);
        toast({
          title: 'Account created!',
          description: 'Welcome to DevGlobal Hub.',
          variant: 'success',
        });
        router.push('/dashboard');
      } catch (error: any) {
        const message =
          error.response?.data?.error || 'Registration failed. Please try again.';
        toast({
          title: 'Registration failed',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [register, router, toast]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    router.push('/');
  }, [logout, router, toast]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchUser,
  };
}