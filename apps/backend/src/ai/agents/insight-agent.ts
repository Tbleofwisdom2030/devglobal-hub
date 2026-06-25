// Business insights AI
// TODO: Add insight agent
import { LLMClient } from '../llm-client';
import { INSIGHT_GENERATION_PROMPT } from '../prompts/insight.prompts';
import { logger } from '../../config/logger';
import { prisma } from '../../config/database';

export class InsightAgent {
  public async generateInsights(): Promise<any> {
    try {
      // Gather data for analysis
      const [
        ticketCategories,
        recentTickets,
        totalTickets,
        resolvedTickets,
        activeLicenses,
        expiredLicenses,
      ] = await Promise.all([
        prisma.supportTicket.groupBy({
          by: ['category'],
          _count: true,
          orderBy: { _count: { category: 'desc' } },
        }),
        prisma.supportTicket.findMany({
          where: {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
          select: {
            subject: true,
            status: true,
            aiSentiment: true,
          },
        }),
        prisma.supportTicket.count(),
        prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
        prisma.license.count({ where: { status: 'ACTIVE' } }),
        prisma.license.count({ where: { status: 'EXPIRED' } }),
      ]);

      // Calculate satisfaction based on ticket sentiment
      const sentiments = recentTickets
        .filter((t: { aiSentiment: string | null }) => t.aiSentiment)
        .map((t: { aiSentiment: string | null }) => t.aiSentiment as string);

      const positiveSentiments = sentiments.filter(
        (s: string) => s === 'positive' || s === 'neutral'
      ).length;

      const satisfactionScore =
        sentiments.length > 0
          ? Math.round((positiveSentiments / sentiments.length) * 100)
          : 85; // Default score

      // Find common issues
      const commonIssues = this.extractCommonIssues(recentTickets);

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        ticketCategories,
        commonIssues,
        activeLicenses,
        expiredLicenses
      );

      // Predict renewals
      const predictedRenewals = Math.round(expiredLicenses * 0.4); // 40% renewal rate estimate

      return {
        topTicketCategories: ticketCategories.map((c: { category: string | null; _count: number }) => ({
          category: c.category || 'Uncategorized',
          count: c._count,
        })),
        customerSatisfaction: satisfactionScore,
        commonIssues,
        recommendations,
        predictedLicenseRenewals: predictedRenewals,
      };
    } catch (error) {
      logger.error(`Failed to generate insights: ${String(error)}`);
      throw error;
    }
  }

  private extractCommonIssues(tickets: any[]): string[] {
    // Simple keyword frequency analysis
    const keywordMap = new Map<string, number>();
    const keywords = [
      'installation', 'activation', 'license', 'error', 'crash',
      'update', 'configuration', 'performance', 'billing', 'password',
      'login', 'download', 'compatibility', 'bug', 'feature',
    ];

    tickets.forEach((ticket) => {
      const text = ticket.subject.toLowerCase();
      keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
        }
      });
    });

    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword, count]) => `${keyword} (${count} tickets)`);
  }

  private generateRecommendations(
    categories: any[],
    issues: string[],
    activeLicenses: number,
    expiredLicenses: number
  ): string[] {
    const recommendations: string[] = [];

    if (issues.length > 0) {
      recommendations.push(
        `Improve documentation for common issues: ${issues[0].split(' ')[0]}`
      );
    }

    if (categories.length > 0 && categories[0]._count > 5) {
      recommendations.push(
        `Consider creating dedicated FAQ section for "${categories[0].category}"`
      );
    }

    if (expiredLicenses > 0) {
      const renewalRate = ((activeLicenses / (activeLicenses + expiredLicenses)) * 100).toFixed(1);
      recommendations.push(
        `License renewal rate is approximately ${renewalRate}%. Consider sending renewal reminders.`
      );
    }

    recommendations.push(
      'Regularly update knowledge base articles based on common support queries'
    );

    return recommendations;
  }
}