// AI processing worker
// TODO: Add AI jobs
import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { TicketAgent } from '../ai/agents/ticket-agent';

export class AIWorker {
  public static async process(job: Job): Promise<void> {
    const { payload } = job.data;
    const { ticketId, action } = payload;

    logger.info(`Processing AI job: ${action} for ticket ${ticketId}`);

    try {
      switch (action) {
        case 'analyze':
          const ticketAgent = new TicketAgent();
          await ticketAgent.analyzeTicket(ticketId);
          break;
        case 'summarize':
          const agent = new TicketAgent();
          await agent.analyzeTicket(ticketId);
          break;
        default:
          logger.warn(`Unknown AI action: ${action}`);
      }

      logger.info(`AI job completed: ${action}`);
    } catch (error) {
      logger.error(`AI job failed (${action}): ${String(error)}`);
      throw error;
    }
  }
}