// Account settings
// TODO: Add account settings
'use client';

import { useState } from 'react';
import { Button, Card, Input } from '@devglobal/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordFormData } from '@devglobal/shared';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@devglobal/ui';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Lock, Bell, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { toast } = useToast();
  const { logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    setIsSaving(true);
    try {
      await apiClient.put('/auth/change-password', data);
      toast({
        title: 'Password changed',
        description: 'Your password has been changed. Please log in again.',
        variant: 'success',
      });
      reset();
      setIsChangingPassword(false);
      
      // Logout after password change
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('system')}
          >
            System
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive email updates about your tickets and orders
              </p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-input text-primary focus:ring-primary"
              defaultChecked
            />
          </label>
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Product Updates</p>
              <p className="text-xs text-muted-foreground">
                Get notified about new features and updates
              </p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-input text-primary focus:ring-primary"
              defaultChecked
            />
          </label>
        </div>
      </Card>

      {/* Language */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5" />
          <h3 className="font-semibold">Language</h3>
        </div>
        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5" />
          <h3 className="font-semibold">Security</h3>
        </div>

        {!isChangingPassword ? (
          <Button
            variant="outline"
            onClick={() => setIsChangingPassword(true)}
          >
            Change Password
          </Button>
        ) : (
          <form
            onSubmit={handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <Input
                type="password"
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                type="password"
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Changing...' : 'Change Password'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 dark:border-red-900">
        <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="destructive" size="sm">
          Delete Account
        </Button>
      </Card>
    </div>
  );
}