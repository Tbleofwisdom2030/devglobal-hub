'use client';

import { useState, useEffect, useRef } from 'react';
import { useConversations, useConversation, useSendMessage, useCreateConversation } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import { Button, Input } from '@devglobal/ui';
import { formatTimeAgo } from '@/lib/utils';
import { Send, Plus, MessageSquare, Bot, User } from 'lucide-react';

export default function ChatPage() {
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();

  const { data: conversationsData, refetch: refetchConversations } = useConversations();
  const { data: conversation, refetch: refetchConversation } = useConversation(selectedConv || '');
  const sendMessage = useSendMessage(selectedConv || '');
  const createConversation = useCreateConversation();

  const conversations = conversationsData?.data || [];
  const messages = conversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (!message.trim() || !selectedConv) return;
    const content = message;
    setMessage('');
    setStreamingContent('');
    try {
      await sendMessage.mutateAsync({ content });
      refetchConversation();
      refetchConversations();
    } catch {
      setMessage(content);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConversation = await createConversation.mutateAsync({});
      // newConversation is already the conversation object (response.data.data)
      if (newConversation && newConversation.id) {
        setSelectedConv(newConversation.id);
        await refetchConversations();
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Sidebar */}
      <div className="w-80 border rounded-lg flex flex-col bg-background">
        <div className="p-4 border-b">
          <Button
            variant="gradient"
            className="w-full"
            size="sm"
            onClick={handleNewConversation}
            disabled={createConversation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {createConversation.isPending ? 'Creating...' : 'New Conversation'}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <MessageSquare className="h-12 w-12 mb-2" />
              <p className="text-sm text-center">No conversations yet.</p>
            </div>
          ) : (
            conversations.map((conv: any) => (
              <button
                key={conv.id}
                onClick={() => { setSelectedConv(conv.id); setStreamingContent(''); }}
                className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedConv === conv.id ? 'bg-muted' : ''}`}
              >
                <p className="font-medium text-sm truncate">{conv.title || 'New Conversation'}</p>
                {conv.lastMessage && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {typeof conv.lastMessage.content === 'string' ? conv.lastMessage.content.substring(0, 50) : ''}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {conv.lastMessageAt ? formatTimeAgo(conv.lastMessageAt) : 'No messages'}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 border rounded-lg flex flex-col bg-background">
        {selectedConv ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg p-3 ${
                    msg.senderType === 'USER' ? 'bg-primary text-primary-foreground' :
                    msg.senderType === 'AI' ? 'bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800' : 'bg-muted'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {msg.senderType === 'AI' && <Bot className="h-4 w-4 text-indigo-600" />}
                      {msg.senderType === 'USER' && <User className="h-4 w-4" />}
                      <span className="text-xs font-medium">
                        {msg.senderType === 'AI' ? 'DevBot AI' : msg.senderType === 'USER' ? 'You' : 'System'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">{formatTimeAgo(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex gap-1">
                        <span className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                        <span className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message... (Enter to send)"
                  className="flex-1 min-h-[44px] max-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={sendMessage.isPending}
                />
                <Button onClick={handleSend} disabled={!message.trim() || sendMessage.isPending} size="icon" className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <Bot className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">DevBot AI Assistant</h3>
              <p className="text-muted-foreground mb-6 max-w-md">Get AI-powered support instantly. Ask questions about products, licensing, or technical issues.</p>
              <Button variant="gradient" size="lg" onClick={handleNewConversation} disabled={createConversation.isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}