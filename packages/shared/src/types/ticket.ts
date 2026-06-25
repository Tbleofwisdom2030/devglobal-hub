export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface SupportTicket {
  id: string;
  userId: string;
  productId: string | null;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string | null;
  aiSummary: string | null;
  aiSentiment: string | null;
  aiSuggestedAction: string | null;
  aiSimilarTickets: string[];
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  product?: {
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  messages?: TicketMessage[];
  _count?: {
    messages: number;
  };
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'CUSTOMER' | 'SUPPORT' | 'ADMIN' | 'AI';
  content: string;
  isInternal: boolean;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
  };
}

export interface CreateTicketData {
  subject: string;
  priority?: TicketPriority;
  category?: string;
  productId?: string;
  message: string;
}