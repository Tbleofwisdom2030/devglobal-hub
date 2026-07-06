'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { formatDate } from '@/lib/utils';
import { 
  Search, Shield, User, Users, CheckCircle, XCircle, 
  MoreVertical, Mail, Clock, Key, UserCheck, UserX,
  Loader2, ChevronLeft, ChevronRight, RefreshCw, Eye
} from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      if (search) params.set('search', search);
      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.put(`/admin/users/${userId}/verify`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: '✅ User verified successfully!', variant: 'success' });
      setOpenMenuId(null);
    },
    onError: (err: any) => {
      toast({ title: 'Failed', description: err.response?.data?.error, variant: 'destructive' });
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await apiClient.put(`/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: '✅ Role updated!', variant: 'success' });
      setOpenMenuId(null);
    },
    onError: (err: any) => {
      toast({ title: 'Failed', description: err.response?.data?.error, variant: 'destructive' });
    },
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const roleBadgeVariant: Record<string, 'default' | 'info' | 'outline'> = {
    ADMIN: 'default',
    SUPPORT: 'info',
    CUSTOMER: 'outline',
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="h-3 w-3" />;
      case 'SUPPORT': return <Users className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            {meta?.total || 0} total users registered
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or email..." 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          className="pl-10"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </Card>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            {search ? 'Try a different search term.' : 'Users will appear here when they register.'}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-semibold">User</th>
                  <th className="text-left p-4 text-sm font-semibold hidden md:table-cell">Email</th>
                  <th className="text-left p-4 text-sm font-semibold">Role</th>
                  <th className="text-left p-4 text-sm font-semibold hidden sm:table-cell">Status</th>
                  <th className="text-left p-4 text-sm font-semibold hidden lg:table-cell">Joined</th>
                  <th className="text-right p-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} className="h-9 w-9 rounded-full object-cover" alt="" />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {user.fullName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.fullName || 'No Name'}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={roleBadgeVariant[user.role] || 'outline'} className="gap-1">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-sm font-medium">
                          <Clock className="h-4 w-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="p-2 rounded-lg hover:bg-accent transition-colors"
                          title="Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openMenuId === user.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-10 w-52 bg-popover border rounded-xl shadow-xl z-20 animate-in fade-in zoom-in-95">
                              <div className="p-1.5">
                                <button
                                  onClick={() => { setSelectedUser(user); setShowDetailModal(true); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                                >
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  View Details
                                </button>

                                {!user.emailVerified && (
                                  <button
                                    onClick={() => verifyMutation.mutate(user.id)}
                                    disabled={verifyMutation.isPending}
                                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-green-50 dark:hover:bg-green-950 text-green-600 transition-colors"
                                  >
                                    {verifyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                                    Verify User
                                  </button>
                                )}

                                <div className="border-t my-1.5" />
                                <p className="px-3 py-1 text-xs text-muted-foreground font-medium">Change Role</p>

                                {['CUSTOMER', 'SUPPORT', 'ADMIN'].map(role => (
                                  user.role !== role && (
                                    <button
                                      key={role}
                                      onClick={() => roleMutation.mutate({ userId: user.id, role })}
                                      disabled={roleMutation.isPending}
                                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                                    >
                                      {role === 'ADMIN' ? <Shield className="h-4 w-4 text-red-500" /> :
                                       role === 'SUPPORT' ? <Users className="h-4 w-4 text-blue-500" /> :
                                       <User className="h-4 w-4 text-gray-500" />}
                                      Make {role.charAt(0) + role.slice(1).toLowerCase()}
                                    </button>
                                  )
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page <strong>{page}</strong> of <strong>{meta.totalPages}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= meta.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* User Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {selectedUser.fullName?.charAt(0) || selectedUser.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.fullName || 'No Name'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <Badge variant={roleBadgeVariant[selectedUser.role]} className="mt-1">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm border-t pt-4">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedUser.emailVerified ? '✅ Verified' : '⏳ Pending'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium text-xs font-mono">{selectedUser.id?.substring(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Login</p>
                  <p className="font-medium">{selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never'}</p>
                </div>
                {selectedUser._count && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Orders</p>
                      <p className="font-medium">{selectedUser._count.orders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Licenses</p>
                      <p className="font-medium">{selectedUser._count.licenses}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tickets</p>
                      <p className="font-medium">{selectedUser._count.supportTickets}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}