export type ConversationStatus = 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export interface ChatConversation {
  id: string;
  userId: string;
  title: string | null;
  status: ConversationStatus;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    content: string;
    senderType: string;
    createdAt: string;
  };
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: 'USER' | 'AI' | 'ADMIN' | 'SYSTEM';
  content: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface SendMessageData {
  content: string;
}