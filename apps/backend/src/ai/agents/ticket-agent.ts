// Ticket analysis AI
// TODO: Add ticket agent
import { LLMClient } from '../llm-client';
import { TICKET_ANALYSIS_PROMPT } from '../prompts/ticket.prompts';
import { logger } from '../../config/logger';
import { prisma } from '../../config/database';

export class TicketAgent {
  public async analyzeTicket(ticketId: string): Promise<void> {
    try {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!ticket || !ticket.messages[0]) {
        logger.warn(`Ticket ${ticketId} not found or has no messages`);
        return;
      }

      const firstMessage = ticket.messages[0].content;

      const prompt = `${TICKET_ANALYSIS_PROMPT}\n\nTicket Subject: ${ticket.subject}\n\nTicket Message:\n${firstMessage}`;

      const response = await LLMClient.generateCompletion([
        {
          role: 'system',
          content: 'You are a support ticket analysis AI. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ], {
        temperature: 0.3,
        maxTokens: 500,
      });

      // Parse the JSON response
      const analysis = this.parseAnalysisResponse(response);

      // Update ticket with AI analysis
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
          aiSummary: analysis.summary,
          aiSentiment: analysis.sentiment,
          aiSuggestedAction: analysis.suggestedAction,
          aiSimilarTickets: analysis.relatedIssues || [],
          priority: this.mapPriority(analysis.priority),
          ...(analysis.category && { category: analysis.category }),
        },
      });

      logger.info(`Ticket ${ticketId} analyzed by AI`);
    } catch (error) {
      logger.error(`Failed to analyze ticket ${ticketId}: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    }
  }

  private parseAnalysisResponse(response: string): {
    summary: string;
    sentiment: string;
    priority: string;
    category: string;
    suggestedAction: string;
    relatedIssues: string[];
  } {
    try {
      // Try to parse JSON
      const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      // Fallback to extracting information manually
      return {
        summary: response.substring(0, 200),
        sentiment: 'neutral',
        priority: 'MEDIUM',
        category: 'General',
        suggestedAction: 'Review and respond to customer',
        relatedIssues: [],
      };
    }
  }

  private mapPriority(priority: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
      low: 'LOW',
      medium: 'MEDIUM',
      high: 'HIGH',
      urgent: 'URGENT',
    };
    return priorityMap[priority?.toLowerCase()] || 'MEDIUM';
  }
}