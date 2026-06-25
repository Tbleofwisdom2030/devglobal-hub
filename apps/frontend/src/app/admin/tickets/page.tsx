'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, Badge, Button } from '@devglobal/ui';
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils';
import { Ticket } from 'lucide-react';

export default function AdminTicketsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets', page],
    queryFn: async () => {
      // Use the correct endpoint - tickets with auth will return all for admin
      const response = await apiClient.get(`/tickets?page=${page}&limit=20`);
      return response.data;
    },
  });

  const tickets = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Tickets</h1>
        <p className="text-muted-foreground mt-1">Manage all support tickets ({data?.meta?.total || 0} total)</p>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tickets...</p>
        </Card>
      ) : tickets.length === 0 ? (
        <Card className="p-12 text-center">
          <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">No tickets found</h3>
          <p className="text-muted-foreground">No support tickets have been created yet.</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium">Subject</th>
                  <th className="text-left p-4 text-sm font-medium">User</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Priority</th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket: any) => (
                  <tr key={ticket.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">ID: {ticket.id?.substring(0, 8)}</p>
                    </td>
                    <td className="p-4 text-sm">
                      {ticket.user?.fullName || ticket.user?.email || 'N/A'}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status?.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {data.meta.totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= data.meta.totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}