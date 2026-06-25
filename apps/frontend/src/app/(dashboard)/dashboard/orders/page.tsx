// Order history
// TODO: Add order history
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, Badge } from '@devglobal/ui';
import { formatDate, formatPrice, getStatusColor } from '@/lib/utils';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders?limit=50');
      return response.data;
    },
  });

  const orders = data?.data || [];

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground">
          Your purchase history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-1">View your purchase history</p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                {order.product?.imageUrls?.[0] && (
                  <img
                    src={order.product.imageUrls[0]}
                    alt={order.product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">
                    {order.product?.name || 'Unknown Product'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>Order ID: {order.id.substring(0, 8)}</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  {order.license && (
                    <p className="text-sm mt-1">
                      License: {order.license.licenseKey}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {formatPrice(order.amountCents, order.currency)}
                </p>
                <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                  {order.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}