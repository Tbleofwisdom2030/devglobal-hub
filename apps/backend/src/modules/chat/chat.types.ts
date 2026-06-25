export interface CreateConversationDTO {
  title?: string;
  productId?: string;
}

export interface SendMessageDTO {
  content: string;
}

export interface ChatMessageResponse {
  id: string;
  conversationId: string;
  senderType: string;
  content: string;
  metadata: any;
  createdAt: Date;
}

export interface ConversationResponse {
  id: string;
  title: string | null;
  status: string;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    senderType: string;
    createdAt: Date;
  };
  unreadCount?: number;
}