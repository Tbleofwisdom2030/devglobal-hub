import { prisma } from '../../config/database';
import { logger } from '../../config/logger';

export class SettingsService {
  public static async getSettings() {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'DevGlobal Hub',
          tagline: 'AI-Powered Developer Platform',
          description: 'All-in-one platform for independent developers',
          primaryColor: '#4F46E5',
          socialLinks: {},
        },
      });
    }
    return settings;
  }

  public static async updateSettings(data: any) {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data });
    } else {
      settings = await prisma.siteSettings.update({ where: { id: settings.id }, data });
    }
    logger.info('Site settings updated');
    return settings;
  }
}