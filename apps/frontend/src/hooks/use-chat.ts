'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useConversations(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['conversations', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/chat/conversations?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 30000,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const response = await apiClient.get(`/chat/conversations/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data?: { title?: string; productId?: string }) => {
      const response = await apiClient.post('/chat/conversations', data || {});
      // The backend returns { success: true, message: "...", data: { ...conversation } }
      // So we need response.data.data to get the conversation
      console.log('Create conversation response:', response.data);
      return response.data.data;
    },
    onSuccess: (newConversation) => {
      console.log('New conversation:', newConversation);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      console.error('Create conversation error:', error);
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await apiClient.post(`/chat/conversations/${conversationId}/messages`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}