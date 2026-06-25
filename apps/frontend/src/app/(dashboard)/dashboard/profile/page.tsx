// User profile
// TODO: Add user profile
'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Button, Card, Input, Badge } from '@devglobal/ui';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@devglobal/ui';
import { useState } from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
    },
  });

  const onSubmit = async (data: { fullName: string }) => {
    setIsSaving(true);
    try {
      const response = await apiClient.put('/auth/me', data);
      setUser(response.data.data);
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.fullName || 'User'}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Role: {user?.role}
            </p>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Name:</span>
                <span>{user?.fullName || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Role:</span>
                <span>{user?.role}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span>{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} className="mt-4">
              Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                {...register('fullName', {
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                placeholder="Enter your full name"
                error={errors.fullName?.message}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Account Info Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Email Verified</span>
            <Badge variant={user?.emailVerified ? 'success' : 'warning'}>
              {user?.emailVerified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Last Login</span>
            <span>
              {user?.lastLoginAt
                ? formatDate(user.lastLoginAt)
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Account ID</span>
            <span className="font-mono text-xs">{user?.id}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}