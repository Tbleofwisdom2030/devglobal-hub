import Redis from 'ioredis';
import { logger } from './logger';

class RedisConnection {
  private static instance: Redis;
  private static subscriber: Redis;
  private static retryCount = 0;
  private static maxRetries = 5;
  private static retryDelay = 3000;

  public static getInstance(): Redis {
    if (!RedisConnection.instance) {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      // Detect Upstash (TLS required)
      const isUpstash = redisUrl.includes('upstash.io');
      
      RedisConnection.instance = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > RedisConnection.maxRetries) {
            logger.error('Redis max retries reached');
            return null;
          }
          return Math.min(times * 100, RedisConnection.retryDelay);
        },
        lazyConnect: false,
        enableOfflineQueue: true,
        ...(isUpstash && {
          tls: {
            rejectUnauthorized: false,
          },
        }),
      });

      RedisConnection.instance.on('connect', () => {
        logger.info('✅ Redis connected successfully');
        RedisConnection.retryCount = 0;
      });

      RedisConnection.instance.on('error', (error) => {
        RedisConnection.retryCount++;
        logger.error(`Redis error (attempt ${RedisConnection.retryCount}): ${error.message}`);
      });

      RedisConnection.instance.on('close', () => {
        logger.warn('Redis connection closed');
      });

      RedisConnection.instance.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });
    }
    return RedisConnection.instance;
  }

  public static getSubscriber(): Redis {
    if (!RedisConnection.subscriber) {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      const isUpstash = redisUrl.includes('upstash.io');
      
      RedisConnection.subscriber = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > RedisConnection.maxRetries) return null;
          return Math.min(times * 100, RedisConnection.retryDelay);
        },
        ...(isUpstash && {
          tls: {
            rejectUnauthorized: false,
          },
        }),
      });
    }
    return RedisConnection.subscriber;
  }

  public static async disconnect(): Promise<void> {
    if (RedisConnection.instance) {
      await RedisConnection.instance.quit();
      logger.info('Redis disconnected');
    }
    if (RedisConnection.subscriber) {
      await RedisConnection.subscriber.quit();
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const redis = RedisConnection.getInstance();
      const result = await redis.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}

export const redis = RedisConnection.getInstance();
export const redisConnection = RedisConnection;