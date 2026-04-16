import { Writable } from 'stream';
import pino from 'pino';

type LoggerModule = typeof import('../src/lib/logger');

const originalNodeEnv = process.env.NODE_ENV;
const originalLogLevel = process.env.LOG_LEVEL;
const originalArgv1 = process.argv[1];

async function loadLoggerModule(): Promise<LoggerModule> {
  return import('../src/lib/logger');
}

describe('logger helpers', () => {
  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
    if (originalLogLevel === undefined) {
      delete process.env.LOG_LEVEL;
    } else {
      process.env.LOG_LEVEL = originalLogLevel;
    }
    process.argv[1] = originalArgv1;
    jest.resetModules();
  });

  it('detectServiceName maps API and worker entrypoints to stable service names', async () => {
    const { detectServiceName } = await loadLoggerModule();

    expect(detectServiceName('/app/src/index.ts')).toBe('backend-api');
    expect(detectServiceName('/app/dist/worker.js')).toBe('backend-worker');
    expect(detectServiceName('/app/scripts/demo-seed.ts')).toBe('backend');
    expect(detectServiceName('C:\\app\\dist\\worker.js')).toBe('backend-worker');
  });

  it('buildLoggerOptions enables pretty logs only in development', async () => {
    const { buildLoggerOptions } = await loadLoggerModule();

    const developmentOptions = buildLoggerOptions({ env: 'development' });
    const productionOptions = buildLoggerOptions({ env: 'production' });

    expect(developmentOptions.transport).toMatchObject({
      target: 'pino-pretty',
      options: expect.objectContaining({
        colorize: true,
        translateTime: 'SYS:standard',
      }),
    });
    expect(productionOptions.transport).toBeUndefined();
  });

  it('defaults to silent logging in test-like envs unless LOG_LEVEL overrides it', async () => {
    const { buildLoggerOptions } = await loadLoggerModule();

    expect(buildLoggerOptions({ env: 'test' }).level).toBe('silent');
    expect(buildLoggerOptions({ env: 'e2e' }).level).toBe('silent');
    expect(buildLoggerOptions({ env: 'test', logLevel: 'debug' }).level).toBe('debug');
  });

  it('binds the detected service once on the shared singleton and extends it with createLogger', async () => {
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'info';
    process.argv[1] = '/srv/backend/worker.ts';

    const { logger, createLogger } = await loadLoggerModule();
    const childLogger = createLogger({ component: 'cache-service', instanceId: 'worker-1' });

    expect(logger.bindings()).toMatchObject({ service: 'backend-worker' });
    expect(childLogger.bindings()).toMatchObject({
      service: 'backend-worker',
      component: 'cache-service',
      instanceId: 'worker-1',
    });
  });

  it('redacts sensitive fields while preserving operational metadata and error serialization', async () => {
    const { buildLoggerOptions, detectServiceName } = await loadLoggerModule();
    const writes: string[] = [];
    const stream = new Writable({
      write(chunk, _encoding, callback) {
        writes.push(chunk.toString());
        callback();
      },
    });

    const rootLogger = pino(buildLoggerOptions({ env: 'production', logLevel: 'info' }), stream);
    const childLogger = rootLogger
      .child({ service: detectServiceName('/srv/backend/index.ts') })
      .child({ component: 'auth-router' });

    childLogger.error(
      {
        err: new Error('boom'),
        channelId: 'channel-123',
        token: 'super-secret-token',
        headers: { authorization: 'Bearer secret-token' },
        body: {
          email: 'person@example.com',
          password: 'hunter2',
          content: 'hello world',
        },
      },
      'Auth route failed',
    );

    expect(writes).toHaveLength(1);

    const payload = JSON.parse(writes[0]);
    expect(payload.service).toBe('backend-api');
    expect(payload.component).toBe('auth-router');
    expect(payload.channelId).toBe('channel-123');
    expect(payload.token).toBe('[REDACTED]');
    expect(payload.headers.authorization).toBe('[REDACTED]');
    expect(payload.body).toEqual({
      email: '[REDACTED]',
      password: '[REDACTED]',
      content: '[REDACTED]',
    });
    expect(payload.err).toMatchObject({
      type: 'Error',
      message: 'boom',
    });
    expect(payload.msg).toBe('Auth route failed');
  });
});
