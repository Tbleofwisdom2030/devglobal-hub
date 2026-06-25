// DevBot AI assistant
// TODO: Add chat agent
import { LLMClient } from '../llm-client';
import { RAGPipeline, RAGContext } from '../rag-pipeline';
import { CHAT_SYSTEM_PROMPT } from '../prompts/chat.prompts';
import { logger } from '../../config/logger';
import { prisma } from '../../config/database';

export class ChatAgent {
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private maxHistoryLength = 10;

  public async generateResponse(
    conversationId: string,
    userId: string,
    recentMessages: any[]
  ): Promise<string> {
    try {
      // Get conversation history
      const history = recentMessages
        .filter((m) => m.senderType === 'USER' || m.senderType === 'AI')
        .slice(-this.maxHistoryLength)
        .map((m) => ({
          role: m.senderType === 'USER' ? 'user' as const : 'assistant' as const,
          content: m.content,
        }));

      // Get the last user message
      const lastUserMessage = history.reverse().find((m) => m.role === 'user');

      if (!lastUserMessage) {
        return "I'm not sure what you're asking. Could you please rephrase your question?";
      }

      // Retrieve relevant documentation
      const contexts = await RAGPipeline.retrieveContext(lastUserMessage.content);

      // Create RAG-enhanced prompt
      const messages = RAGPipeline.createRAGPrompt(
        CHAT_SYSTEM_PROMPT,
        lastUserMessage.content,
        contexts
      );

      // Add conversation history
      const fullMessages = [
        messages[0], // System prompt with context
        ...history.slice(-8).filter((m) => m !== lastUserMessage), // Previous messages
        messages[1], // Current user query
      ];

      // Generate response
      const response = await LLMClient.generateCompletion(fullMessages, {
        temperature: 0.7,
        maxTokens: 1000,
      });

      return response;
    } catch (error) {
      logger.error({ error }, 'Chat agent failed to generate response:');
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance.";
    }
  }

  public async searchKnowledgeBase(query: string): Promise<string> {
    const contexts = await RAGPipeline.retrieveContext(query, 3);

    if (contexts.length === 0) {
      return 'No relevant documentation found for your query.';
    }

    return contexts
      .map((ctx) => `📚 **${ctx.source}** (Relevance: ${(ctx.relevance * 100).toFixed(0)}%)\n${ctx.content}`)
      .join('\n\n---\n\n');
  }

  public async createSupportTicket(
    userId: string,
    subject: string,
    description: string
  ): Promise<string> {
    try {
      const { TicketsService } = require('../../modules/tickets/tickets.service');
      
      const ticket = await TicketsService.createTicket(userId, {
        subject,
        message: description,
        priority: 'MEDIUM',
      });

      return `I've created a support ticket for you: **#${ticket.id.substring(0, 8)}** - "${subject}". Our support team will respond shortly. You can track this ticket in your dashboard.`;
    } catch (error) {
      logger.error({ error }, 'Failed to create ticket via chat');
      return "I'm sorry, I couldn't create the support ticket. Please try creating one manually from your dashboard.";
    }
  }
}