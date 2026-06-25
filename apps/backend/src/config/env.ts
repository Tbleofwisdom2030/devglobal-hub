import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  HOST: z.string().default('0.0.0.0'),
  
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  REDIS_URL: z.string().min(1, 'Redis URL is required'),
  
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT access secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM_ADDRESS: z.string().default('support@devglobalhub.com'),
  EMAIL_FROM_NAME: z.string().default('DevGlobal Hub'),
  
  CLOUDFLARE_R2_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_R2_SECRET_KEY: z.string().optional(),
  CLOUDFLARE_R2_ENDPOINT: z.string().optional(),
  CLOUDFLARE_R2_BUCKET: z.string().default('devglobal-hub'),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().optional(),
  
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  ENABLE_AI_FEATURES: z.string().default('true'),
  ENABLE_EMAIL_NOTIFICATIONS: z.string().default('true'),
  ENABLE_LICENSE_CHECK: z.string().default('true'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  PORT: parseInt(parsedEnv.data.PORT),
  RATE_LIMIT_WINDOW_MS: parseInt(parsedEnv.data.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX_REQUESTS: parseInt(parsedEnv.data.RATE_LIMIT_MAX_REQUESTS),
  ENABLE_AI_FEATURES: parsedEnv.data.ENABLE_AI_FEATURES === 'true',
  ENABLE_EMAIL_NOTIFICATIONS: parsedEnv.data.ENABLE_EMAIL_NOTIFICATIONS === 'true',
  ENABLE_LICENSE_CHECK: parsedEnv.data.ENABLE_LICENSE_CHECK === 'true',
} as const;

export type Env = typeof env;