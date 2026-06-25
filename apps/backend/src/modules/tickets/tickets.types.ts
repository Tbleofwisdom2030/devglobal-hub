export interface CreateTicketDTO {
  subject: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  productId?: string;
  message: string;
}

export interface UpdateTicketDTO {
  subject?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category?: string;
  assignedTo?: string;
}

export interface AddMessageDTO {
  content: string;
  isInternal?: boolean;
}

export interface TicketFilterParams {
  status?: string;
  priority?: string;
  category?: string;
  productId?: string;
  assignedTo?: string;
  search?: string;
}