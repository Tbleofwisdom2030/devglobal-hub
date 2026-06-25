'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@devglobal/ui';
import { formatDate, formatTimeAgo, formatPrice, getStatusColor } from '@/lib/utils';
import {
  Key,
  ShoppingCart,
  Ticket,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Fetch licenses - CORRECT URL
  const { data: licensesData, isLoading: licensesLoading } = useQuery({
    queryKey: ['licenses', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/licenses?limit=5');
      return response.data;
    },
  });

  // Fetch orders - CORRECT URL
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/orders?limit=5');
      return response.data;
    },
  });

  // Fetch tickets - CORRECT URL (not /tickets/dashboard)
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/tickets?limit=5');
      return response.data;
    },
  });

  const licenses = licensesData?.data || [];
  const orders = ordersData?.data || [];
  const tickets = ticketsData?.data || [];

  // Calculate stats
  const activeLicenses = licenses.filter((l: any) => l.status === 'ACTIVE').length;
  const openTickets = tickets.filter((t: any) => t.status !== 'CLOSED' && t.status !== 'RESOLVED').length;
  const totalOrders = ordersData?.meta?.total || 0;

  const stats = [
    {
      title: 'Active Licenses',
      value: activeLicenses,
      icon: Key,
      href: '/dashboard/licenses',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      href: '/dashboard/orders',
      color: 'text-green-600 bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Open Tickets',
      value: openTickets,
      icon: Ticket,
      href: '/dashboard/tickets',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-950',
    },
    {
      title: 'AI Chat',
      value: 'Active',
      icon: MessageSquare,
      href: '/dashboard/chat',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-950',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Licenses & Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Licenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Licenses</CardTitle>
            <Link
              href="/dashboard/licenses"
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {licensesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : licenses.length > 0 ? (
              <div className="space-y-2">
                {licenses.slice(0, 5).map((license: any) => (
                  <div
                    key={license.id}
                    className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {license.product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {license.licenseKey}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${getStatusColor(license.status)}`}
                    >
                      {license.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No licenses yet.{' '}
                  <Link href="/products" className="text-primary hover:underline">
                    Browse products
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Tickets</CardTitle>
            <Link
              href="/dashboard/tickets"
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {ticketsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-2">
                {tickets.slice(0, 5).map((ticket: any) => (
                  <Link
                    key={ticket.id}
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(ticket.createdAt)} &bull;{' '}
                        {ticket._count?.messages || 0} messages
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${getStatusColor(ticket.status)}`}
                    >
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Ticket className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No tickets yet.{' '}
                  <Link href="/dashboard/tickets/new" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary hover:underline inline-flex items-center"
          >
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {order.product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)} &bull; Order #{order.id.substring(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-semibold text-sm">
                      {formatPrice(order.amountCents, order.currency)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No orders yet.{' '}
                <Link href="/products" className="text-primary hover:underline">
                  Browse products
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}