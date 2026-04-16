import pino, { Logger, LoggerOptions } from 'pino';

type LoggerBindings = Record<string, string | number | boolean | null | undefined>;
interface LoggerConfigInput {
  env?: string;
  logLevel?: string;
}

export function detectServiceName(entrypoint: string = process.argv[1] ?? ''): string {
  const normalizedEntrypoint = entrypoint.replace(/\\/g, '/');

  if (/(^|\/)worker(\.[cm]?[jt]s)?$/.test(normalizedEntrypoint)) {
    return 'backend-worker';
  }

  if (/(^|\/)index(\.[cm]?[jt]s)?$/.test(normalizedEntrypoint)) {
    return 'backend-api';
  }

  return 'backend';
}

export function buildLoggerOptions({
  env = process.env.NODE_ENV ?? 'development',
  logLevel = process.env.LOG_LEVEL,
}: LoggerConfigInput = {}): LoggerOptions {
  const isDevelopment = env === 'development';
  const isTestEnv = env === 'test' || env === 'e2e';

  const loggerOptions: LoggerOptions = {
    level: logLevel ?? (isTestEnv ? 'silent' : 'info'),
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
    },
    serializers: {
      err: pino.stdSerializers.err,
    },
    // Redact obvious sensitive fields as a last line of defense. Call sites
    // should still avoid attaching request bodies, tokens, or message content.
    redact: {
      paths: [
        'password',
        'passwordHash',
        'email',
        'content',
        'token',
        'accessToken',
        'refreshToken',
        'authorization',
        'cookie',
        'headers.authorization',
        'headers.cookie',
        'req.headers.authorization',
        'req.headers.cookie',
        'query.token',
        'body.email',
        'body.password',
        'body.token',
        'body.content',
      ],
      censor: '[REDACTED]',
    },
  };

  if (isDevelopment) {
    loggerOptions.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }

  return loggerOptions;
}

const rootLogger = pino(buildLoggerOptions());

export const logger = rootLogger.child({ service: detectServiceName() });

export function createLogger(bindings: LoggerBindings): Logger {
  return logger.child(bindings);
}
