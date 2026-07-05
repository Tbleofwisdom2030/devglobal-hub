'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { apiClient } from '@/lib/api-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  LogOut, Bell, Search, User, Settings, X, Camera, 
  Key, Mail, Check, Loader2, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[@$!%*?&]/, 'Must contain special character'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Profile schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
});

export function AdminHeader() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // UI States
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.fullName || '' },
  });

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/admin/notifications');
        return res.data.data || [];
      } catch { return []; }
    },
    refetchInterval: 30000, // Poll every 30s
  });

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // Upload avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const avatarUrl = res.data.data?.url;
      await apiClient.put('/auth/me', { avatarUrl });
      setUser({ ...user!, avatarUrl });
      toast({ title: 'Profile picture updated!', variant: 'success' });
    } catch {
      toast({ title: 'Upload failed', description: 'Please try again', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  // Change password
  const onPasswordSubmit = async (data: any) => {
    setIsChangingPassword(true);
    try {
      await apiClient.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast({ title: 'Password changed successfully!', variant: 'success' });
      setShowPasswordModal(false);
      passwordForm.reset();
    } catch (err: any) {
      toast({ 
        title: 'Failed', 
        description: err.response?.data?.error || 'Try again', 
        variant: 'destructive' 
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Update profile
  const onProfileSubmit = async (data: any) => {
    try {
      const res = await apiClient.put('/auth/me', data);
      setUser(res.data.data);
      toast({ title: 'Profile updated!', variant: 'success' });
      setShowProfileModal(false);
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' });
    }
  };

  return (
    <>
      <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold hidden sm:block">Admin Panel</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, users, tickets..."
                className="w-40 lg:w-72 h-9"
              />
              <button type="button" onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-1 rounded-md hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setShowSearch(true)} className="p-2 rounded-md hover:bg-accent" title="Search (Ctrl+K)">
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md hover:bg-accent relative"
              title="Notifications"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {notifications?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-popover border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <span className="text-xs text-muted-foreground">3 new</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications?.length > 0 ? notifications.map((n: any, i: number) => (
                    <div key={i} className="p-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  )) : (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>All caught up!</p>
                      <p className="text-xs mt-1">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent"
              title="Profile"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium hidden lg:block">
                {user?.fullName || 'Admin'}
              </span>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-64 bg-popover border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b text-center">
                  <div className="relative inline-block mb-2">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden mx-auto">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {user?.fullName?.charAt(0) || 'A'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                  <p className="font-semibold">{user?.fullName || 'Admin User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <BadgeSmall text={user?.role || 'ADMIN'} />
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setShowProfile(false); setShowProfileModal(true); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    <div className="flex-1 text-left">
                      <p>Edit Profile</p>
                      <p className="text-xs text-muted-foreground">Change name</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => { setShowProfile(false); setShowPasswordModal(true); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-accent"
                  >
                    <Key className="h-4 w-4" />
                    <div className="flex-1 text-left">
                      <p>Change Password</p>
                      <p className="text-xs text-muted-foreground">Update security</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="p-1 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-accent text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" {...passwordForm.register('currentPassword')} placeholder="••••••••" />
              {passwordForm.formState.errors.currentPassword?.message && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.currentPassword?.message as React.ReactNode}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" {...passwordForm.register('newPassword')} placeholder="••••••••" />
              {passwordForm.formState.errors.newPassword?.message && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword?.message as React.ReactNode}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" {...passwordForm.register('confirmPassword')} placeholder="••••••••" />
              {passwordForm.formState.errors.confirmPassword?.message && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword?.message as React.ReactNode}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowPasswordModal(false); passwordForm.reset(); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Edit Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {user?.fullName?.charAt(0) || 'A'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input {...profileForm.register('fullName')} placeholder="Your name" />
              {profileForm.formState.errors.fullName && (
                <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.fullName.message as React.ReactNode}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={user?.email || ''} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground mt-1">Contact support to change email</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowProfileModal(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Small badge component
function BadgeSmall({ text }: { text: string }) {
  const colors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    SUPPORT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    CUSTOMER: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  };
  return (
    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[text] || 'bg-gray-100 text-gray-700'}`}>
      {text}
    </span>
  );
}