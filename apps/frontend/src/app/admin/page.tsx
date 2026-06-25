'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@devglobal/ui';
import { 
  Users, Package, ShoppingCart, Ticket, TrendingUp, DollarSign, Activity, MessageSquare 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data.data;
    },
  });

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950' },
    { title: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-purple-600 bg-purple-100 dark:bg-purple-950' },
    { title: 'Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-green-600 bg-green-100 dark:bg-green-950' },
    { title: 'Revenue', value: `$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`, icon: DollarSign, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950' },
    { title: 'Active Licenses', value: stats?.activeLicenses || 0, icon: Activity, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950' },
    { title: 'Open Tickets', value: stats?.openTickets || 0, icon: Ticket, color: 'text-red-600 bg-red-100 dark:bg-red-950' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Activity feed coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              AI-powered insights will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}