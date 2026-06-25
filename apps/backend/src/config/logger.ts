// Pino structured logger
// TODO: Add logger setup
import pino from 'pino';
import { env } from './env';

const transport = {
  target: env.NODE_ENV === 'production' ? 'pino/file' : 'pino-pretty',
  options: {
    colorize: env.NODE_ENV !== 'production',
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    ignore: 'pid,hostname',
    singleLine: false,
  },
};

export const logger = pino({
  level: env.LOG_LEVEL,
  name: 'devglobal-hub',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  serializers: {
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  transport: env.NODE_ENV !== 'test' ? transport : undefined,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'passwordHash',
      'token',
      'accessToken',
      'refreshToken',
    ],
    censor: '[REDACTED]',
  },
});

export type Logger = typeof logger;