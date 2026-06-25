// Ticket list
// TODO: Add ticket list
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTickets } from '@/hooks/use-tickets';
import { Button, Card, Badge } from '@devglobal/ui';
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils';
import { Plus, MessageSquare } from 'lucide-react';

export default function TicketsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTickets(page);

  const tickets = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your support requests
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/tickets/new">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Link>
        </Button>
      </div>

      {tickets.length === 0 && !isLoading ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
          <p className="text-muted-foreground mb-4">
            Create a support ticket to get help with any issues.
          </p>
          <Button variant="gradient" asChild>
            <Link href="/dashboard/tickets/new">Create Ticket</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      {ticket.category && (
                        <Badge variant="outline">{ticket.category}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Created {formatDate(ticket.createdAt)}
                      </span>
                      <span>
                        {ticket._count?.messages || 0} messages
                      </span>
                      {ticket.product && (
                        <span>{ticket.product.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage(Math.min(data.meta.totalPages, page + 1))
            }
            disabled={page === data.meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}