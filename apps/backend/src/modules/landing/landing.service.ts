import { prisma } from '../../config/database';
import { logger } from '../../config/logger';

export class LandingService {
  public static async getLandingPage() {
    let landing = await prisma.landingPage.findFirst();
    
    if (!landing) {
      landing = await prisma.landingPage.create({
        data: {
          heroTitle: 'Build, Sell, and Support Your Software',
          heroSubtitle: 'DevGlobal Hub is the all-in-one platform for independent developers.',
          heroCtaText: 'Browse Products',
          heroCtaLink: '/products',
          heroImage: null,
          features: [
            { icon: 'Code2', title: 'Developer Tools', description: 'Access powerful developer tools.' },
            { icon: 'Bot', title: 'AI-Powered Support', description: 'Get instant AI answers.' },
            { icon: 'Shield', title: 'License Management', description: 'Secure license key management.' },
            { icon: 'Zap', title: 'Fast Performance', description: 'Real-time updates.' },
            { icon: 'Cloud', title: 'Cloud Platform', description: 'Accessible from anywhere.' },
            { icon: 'Users', title: 'Customer Portal', description: 'Self-service portal.' },
          ],
          testimonials: [],
        },
      });
    }
    
    return landing;
  }

  public static async updateLandingPage(data: any) {
    let landing = await prisma.landingPage.findFirst();
    
    if (!landing) {
      landing = await prisma.landingPage.create({ data });
    } else {
      landing = await prisma.landingPage.update({
        where: { id: landing.id },
        data,
      });
    }
    
    logger.info('Landing page updated');
    return landing;
  }
}