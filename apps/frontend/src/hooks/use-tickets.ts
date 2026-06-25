'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { SupportTicket, CreateTicketData, PaginatedResponse } from '@devglobal/shared';
import { useToast } from '@devglobal/ui';
import { useRouter } from 'next/navigation';

export function useTickets(page: number = 1, limit: number = 10) {
  return useQuery<PaginatedResponse<SupportTicket>>({
    queryKey: ['tickets', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/tickets?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data.data as SupportTicket;
    },
    enabled: !!id,
    retry: false, // Don't retry on 404
    staleTime: 30000, // Keep data fresh for 30 seconds
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const response = await apiClient.post('/tickets', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Ticket created',
        description: 'Your support ticket has been created successfully.',
        variant: 'success',
      });
      // Navigate to the new ticket
      if (data?.id) {
        router.push(`/dashboard/tickets/${data.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create ticket.',
        variant: 'destructive',
      });
    },
  });
}

export function useAddMessage(ticketId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await apiClient.post(`/tickets/${ticketId}/messages`, {
        content,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to send message.',
        variant: 'destructive',
      });
    },
  });
}