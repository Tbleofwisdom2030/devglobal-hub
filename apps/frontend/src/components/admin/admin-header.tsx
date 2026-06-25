'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@devglobal/ui';
import { LogOut, Bell, Search } from 'lucide-react';

export function AdminHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-accent">
          <Search className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user?.fullName?.charAt(0) || 'A'}</span>
          </div>
          <span className="text-sm font-medium">{user?.fullName || 'Admin'}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}