'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge, Input } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { formatDate } from '@/lib/utils';
import { Search, Shield, User, Users } from 'lucide-react';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      if (search) params.set('search', search);
      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data;
    },
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      toast({ title: 'Role updated!', variant: 'success' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.error, variant: 'destructive' });
    }
  };

  const users = data?.data || [];

  const roleBadgeVariant: Record<string, string> = {
    ADMIN: 'destructive',
    SUPPORT: 'warning',
    CUSTOMER: 'secondary',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Manage platform users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium">User</th>
                <th className="text-left p-4 text-sm font-medium">Email</th>
                <th className="text-left p-4 text-sm font-medium">Role</th>
                <th className="text-left p-4 text-sm font-medium">Verified</th>
                <th className="text-left p-4 text-sm font-medium">Joined</th>
                <th className="text-left p-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {user.avatarUrl ? <img src={user.avatarUrl} className="h-8 w-8 rounded-full" /> : <User className="h-4 w-4" />}
                      </div>
                      <span className="font-medium">{user.fullName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 bg-background"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="SUPPORT">Support</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.emailVerified ? 'success' : 'warning'}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}