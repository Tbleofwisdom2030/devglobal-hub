// Real-time chat
// TODO: Add chat handler
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../config/logger';
import { ChatService } from '../modules/chat/chat.service';
import { ChatAgent } from '../ai/agents/chat-agent';
import { env } from '../config/env';

export class ChatHandler {
  private io: SocketIOServer;
  private socket: Socket;

  constructor(io: SocketIOServer, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  public register(): void {
    this.socket.on('chat:send', async (data: { conversationId: string; content: string }) => {
      await this.handleSendMessage(data);
    });

    this.socket.on('chat:typing', (data: { conversationId: string; isTyping: boolean }) => {
      this.handleTyping(data);
    });

    this.socket.on('chat:join', (conversationId: string) => {
      this.socket.join(`conversation:${conversationId}`);
    });

    this.socket.on('chat:leave', (conversationId: string) => {
      this.socket.leave(`conversation:${conversationId}`);
    });
  }

  private async handleSendMessage(data: { conversationId: string; content: string }): Promise<void> {
    const user = (this.socket as any).user;

    try {
      // Acknowledge receipt
      this.socket.emit('chat:messageSent', {
        conversationId: data.conversationId,
        content: data.content,
        senderType: 'USER',
        timestamp: new Date().toISOString(),
        tempId: Date.now().toString(),
      });

      // Stream AI response
      if (env.ENABLE_AI_FEATURES) {
        const { LLMClient } = require('../ai/llm-client');
        const { RAGPipeline } = require('../ai/rag-pipeline');
        const { CHAT_SYSTEM_PROMPT } = require('../ai/prompts/chat.prompts');

        // Get conversation context
        const { ChatService } = require('../modules/chat/chat.service');
        const conversation = await ChatService.getConversation(data.conversationId, user.sub);
        
        const recentMessages = conversation.messages
          .slice(-10)
          .map((m: any) => ({
            role: m.senderType === 'USER' ? 'user' : m.senderType === 'AI' ? 'assistant' : 'system',
            content: m.content,
          }));

        const contexts = await RAGPipeline.retrieveContext(data.content);
        const systemPrompt = RAGPipeline.createRAGPrompt(
          CHAT_SYSTEM_PROMPT,
          data.content,
          contexts
        )[0].content;

        let fullResponse = '';

        await LLMClient.generateStreamingCompletion(
          [
            { role: 'system', content: systemPrompt },
            ...recentMessages,
            { role: 'user', content: data.content },
          ],
          (token: string) => {
            fullResponse += token;
            this.socket.emit('chat:streamToken', {
              conversationId: data.conversationId,
              token,
            });
          }
        );

        // Save messages to database
        const result = await ChatService.sendMessage(
          data.conversationId,
          user.sub,
          data.content
        );

        // Send final message
        this.io.to(`conversation:${data.conversationId}`).emit('chat:message', {
          conversationId: data.conversationId,
          message: result.aiResponse,
        });
      } else {
        // Non-AI response
        const result = await ChatService.sendMessage(
          data.conversationId,
          user.sub,
          data.content
        );

        this.io.to(`conversation:${data.conversationId}`).emit('chat:message', {
          conversationId: data.conversationId,
          message: result.aiResponse,
        });
      }
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Chat message error'
      );
      this.socket.emit('chat:error', {
        conversationId: data.conversationId,
        error: 'Failed to send message',
      });
    }
  }

  private handleTyping(data: { conversationId: string; isTyping: boolean }): void {
    const user = (this.socket as any).user;
    
    this.socket.to(`conversation:${data.conversationId}`).emit('chat:typing', {
      conversationId: data.conversationId,
      userId: user.sub,
      isTyping: data.isTyping,
    });
  }
}