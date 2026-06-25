'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTicket, useAddMessage } from '@/hooks/use-tickets';
import { Button, Card, Badge, Skeleton } from '@devglobal/ui';
import { formatDateTime, getStatusColor, getPriorityColor, cn } from '@/lib/utils';
import { Send, User, Bot, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);
  const addMessage = useAddMessage(ticketId);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const content = message;
    setMessage('');

    try {
      await addMessage.mutateAsync(content);
    } catch (error) {
      setMessage(content);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This ticket may have been deleted or you don't have access to it.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/tickets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tickets
            </Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link href="/dashboard/tickets/new">Create New Ticket</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to tickets
      </Link>

      {/* Ticket Header */}
      <div>
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <Badge className={getStatusColor(ticket.status)}>
            {ticket.status.replace(/_/g, ' ')}
          </Badge>
          <Badge className={getPriorityColor(ticket.priority)}>
            {ticket.priority} Priority
          </Badge>
          {ticket.category && (
            <Badge variant="outline">{ticket.category}</Badge>
          )}
          {ticket.product && (
            <Badge variant="secondary">{ticket.product.name}</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span>Created {formatDateTime(ticket.createdAt)}</span>
          <span>Ticket ID: {ticket.id.substring(0, 8)}</span>
        </div>
      </div>

      {/* AI Summary */}
      {ticket.aiSummary && (
        <Card className="p-4 bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-sm text-indigo-600">
              AI Analysis
            </span>
          </div>
          <p className="text-sm">{ticket.aiSummary}</p>
          {ticket.aiSuggestedAction && (
            <p className="text-sm mt-2 text-indigo-600 dark:text-indigo-400">
              <strong>Suggested Action:</strong> {ticket.aiSuggestedAction}
            </p>
          )}
        </Card>
      )}

      {/* Messages */}
      <div className="space-y-4">
        {ticket.messages?.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-4',
              msg.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.senderType !== 'CUSTOMER' && (
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {msg.senderType === 'AI' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <Shield className="h-5 w-5" />
                  )}
                </div>
              </div>
            )}
            <div
              className={cn(
                'max-w-[60%] rounded-lg p-4',
                msg.senderType === 'CUSTOMER'
                  ? 'bg-primary text-primary-foreground'
                  : msg.isInternal
                  ? 'bg-yellow-100 dark:bg-yellow-950 border border-yellow-300'
                  : 'bg-muted'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold">
                  {msg.senderType === 'CUSTOMER'
                    ? 'You'
                    : msg.sender?.fullName || msg.senderType}
                </span>
                {msg.isInternal && (
                  <Badge variant="warning" className="text-xs">
                    Internal Note
                  </Badge>
                )}
              </div>
              <div className="text-sm prose prose-sm dark:prose-invert">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              <p className="text-xs opacity-70 mt-2">
                {formatDateTime(msg.createdAt)}
              </p>
            </div>
            {msg.senderType === 'CUSTOMER' && (
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
        ))}
        {addMessage.isPending && (
          <div className="flex justify-end">
            <div className="bg-primary/50 text-primary-foreground rounded-lg p-4">
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-white rounded-full animate-bounce" />
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-100" />
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      {ticket.status !== 'CLOSED' && (
        <Card className="p-4">
          <div className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={addMessage.isPending}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSend}
                disabled={!message.trim() || addMessage.isPending}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Cmd/Ctrl + Enter to send
          </p>
        </Card>
      )}

      {ticket.status === 'CLOSED' && (
        <Card className="p-8 text-center bg-muted">
          <p className="text-muted-foreground">
            This ticket has been closed. If you need further assistance, please
            create a new ticket.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/tickets/new">Create New Ticket</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}