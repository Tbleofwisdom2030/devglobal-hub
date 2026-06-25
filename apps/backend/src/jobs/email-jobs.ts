// Email sending worker
// TODO: Add email jobs
import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { EmailService } from '../services/email-service';

export class EmailWorker {
  public static async process(job: Job): Promise<void> {
    const { payload } = job.data;
    const { to, subject, template, data } = payload;

    logger.info(`Processing email job: ${template} to ${to}`);

    try {
      switch (template) {
        case 'email-verification':
          await EmailService.sendVerificationEmail(to, data);
          break;
        case 'password-reset':
          await EmailService.sendPasswordResetEmail(to, data);
          break;
        case 'ticket-created':
          await EmailService.sendTicketCreatedEmail(to, data);
          break;
        case 'ticket-updated':
          await EmailService.sendTicketUpdatedEmail(to, data);
          break;
        case 'purchase-confirmation':
          await EmailService.sendPurchaseConfirmation(to, data);
          break;
        case 'license-expiring':
          await EmailService.sendLicenseExpiringEmail(to, data);
          break;
        default:
          await EmailService.sendCustomEmail(to, subject, data);
      }

      logger.info(`Email sent successfully: ${template} to ${to}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to send email (${template}): ${message}`);
      throw error;
    }
  }
}