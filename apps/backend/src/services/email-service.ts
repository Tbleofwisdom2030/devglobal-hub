// Resend email service
// TODO: Add email service
import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class EmailService {
  private static resend: Resend | null = null;

  private static getClient(): Resend {
    if (!EmailService.resend && env.RESEND_API_KEY) {
      EmailService.resend = new Resend(env.RESEND_API_KEY);
    }
    return EmailService.resend!;
  }

  public static async sendVerificationEmail(
    to: string,
    data: { name: string; verificationLink: string }
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS) return;

    await EmailService.send({
      to,
      subject: 'Verify your email - DevGlobal Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to DevGlobal Hub, ${data.name}!</h2>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${data.verificationLink}" 
             style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
            Verify Email
          </a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    });
  }

  public static async sendPasswordResetEmail(
    to: string,
    data: { name: string; resetLink: string }
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS) return;

    await EmailService.send({
      to,
      subject: 'Reset your password - DevGlobal Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${data.name},</p>
          <p>We received a request to reset your password. Click the link below to proceed:</p>
          <a href="${data.resetLink}" 
             style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  public static async sendTicketCreatedEmail(
    to: string,
    data: { ticketId: string; subject: string }
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS) return;

    await EmailService.send({
      to,
      subject: `Ticket Created: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Support Ticket Created</h2>
          <p>Your support ticket has been created:</p>
          <p><strong>Ticket ID:</strong> ${data.ticketId.substring(0, 8)}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p>Our support team will respond shortly. You can track your ticket in your dashboard.</p>
        </div>
      `,
    });
  }

  public static async sendTicketUpdatedEmail(
    to: string,
    data: { ticketId: string; subject: string; status: string }
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS) return;

    await EmailService.send({
      to,
      subject: `Ticket Updated: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ticket Update</h2>
          <p>Your support ticket has been updated:</p>
          <p><strong>Ticket ID:</strong> ${data.ticketId.substring(0, 8)}</p>
          <p><strong>Status:</strong> ${data.status}</p>
          <p>View the full update in your dashboard.</p>
        </div>
      `,
    });
  }

  public static async sendPurchaseConfirmation(
    to: string,
    data: { name: string; productName: string; licenseKey: string }
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS) return;

    await EmailService.send({
      to,
      subject: `Purchase Confirmed: ${data.productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank You for Your Purchase!</h2>
          <p>Hi ${data.name},</p>
          <p>Your purchase of <strong>${data.productName}</strong> has been confirmed.</p>
          <p><strong>License Key:</strong> ${data.licenseKey}</p>
          <p>You can download and activate your software from your dashboard.</p>
        </div>
      `,
    });
  }

  public static async sendLicenseExpiringEmail(
    to: string,
    data: { name: string; productName: string; licenseKey: string; expiresAt: Date }
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS) return;

    const daysLeft = Math.ceil(
      (data.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    await EmailService.send({
      to,
      subject: `License Expiring Soon: ${data.productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>License Expiration Notice</h2>
          <p>Hi ${data.name},</p>
          <p>Your license for <strong>${data.productName}</strong> will expire in <strong>${daysLeft} days</strong>.</p>
          <p><strong>License Key:</strong> ${data.licenseKey}</p>
          <p>Renew your license to continue enjoying uninterrupted service.</p>
        </div>
      `,
    });
  }

  public static async sendCustomEmail(
    to: string,
    subject: string,
    data: any
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS) return;

    await EmailService.send({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${JSON.stringify(data)}
        </div>
      `,
    });
  }

  private static async send(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      const client = EmailService.getClient();

      await client.emails.send({
        from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      logger.info(`Email sent: ${params.subject} to ${params.to}`);
    } catch (error) {
      logger.error(`Failed to send email: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      throw error;
    }
  }
}