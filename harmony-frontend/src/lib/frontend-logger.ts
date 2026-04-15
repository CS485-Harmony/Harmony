type FrontendLogLevel = 'info' | 'warn' | 'error';
type FrontendRuntime = 'browser' | 'next-server';
type FrontendLogValue = string | number | boolean;

export interface FrontendLogEntry {
  service: 'frontend';
  runtime: FrontendRuntime;
  level: FrontendLogLevel;
  message: string;
  timestamp: string;
  fields: Record<string, FrontendLogValue>;
}

export interface FrontendLogger {
  info: (message: string, metadata?: Record<string, unknown>) => void;
  warn: (message: string, metadata?: Record<string, unknown>) => void;
  error: (message: string, metadata?: Record<string, unknown>) => void;
}

const PATH_FIELDS = new Set(['route', 'target']);
const ALLOWED_METADATA_KEYS = new Set([
  'attempt',
  'component',
  'correlationId',
  'digest',
  'errorCode',
  'errorName',
  'event',
  'feature',
  'method',
  'operation',
  'phase',
  'procedure',
  'reason',
  'requestId',
  'retryCount',
  'route',
  'scope',
  'source',
  'statusCode',
  'target',
  'transport',
]);

function detectRuntime(): FrontendRuntime {
  return typeof window === 'undefined' ? 'next-server' : 'browser';
}

function toSafePath(value: string): string {
  try {
    if (/^https?:\/\//.test(value)) {
      return new URL(value).pathname || '/';
    }
  } catch {}

  const [withoutQuery] = value.split(/[?#]/, 1);
  return withoutQuery || '/';
}

function toSafeLogValue(key: string, value: unknown): FrontendLogValue | undefined {
  if (typeof value === 'string') {
    return PATH_FIELDS.has(key) ? toSafePath(value) : value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  return undefined;
}

function extractSafeErrorFields(error: unknown): Record<string, FrontendLogValue> {
  if (!error || typeof error !== 'object') {
    return {};
  }

  const candidate = error as Record<string, unknown>;
  const safeFields: Record<string, FrontendLogValue> = {};

  if (typeof candidate.name === 'string') safeFields.errorName = candidate.name;
  if (typeof candidate.code === 'string') safeFields.errorCode = candidate.code;
  if (typeof candidate.digest === 'string') safeFields.digest = candidate.digest;
  if (typeof candidate.status === 'number') safeFields.statusCode = candidate.status;

  return safeFields;
}

export function sanitizeLogMetadata(
  metadata: Record<string, unknown> = {},
): Record<string, FrontendLogValue> {
  const safeFields: Record<string, FrontendLogValue> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (key === 'error' || key === 'err') {
      Object.assign(safeFields, extractSafeErrorFields(value));
      continue;
    }

    if (!ALLOWED_METADATA_KEYS.has(key)) {
      continue;
    }

    const safeValue = toSafeLogValue(key, value);
    if (safeValue !== undefined) {
      safeFields[key] = safeValue;
    }
  }

  return safeFields;
}

export function buildFrontendLogEntry(
  level: FrontendLogLevel,
  message: string,
  metadata: Record<string, unknown> = {},
): FrontendLogEntry {
  return {
    service: 'frontend',
    runtime: detectRuntime(),
    level,
    message,
    timestamp: new Date().toISOString(),
    fields: sanitizeLogMetadata(metadata),
  };
}

function writeLog(
  level: FrontendLogLevel,
  message: string,
  metadata?: Record<string, unknown>,
): void {
  const entry = buildFrontendLogEntry(level, message, metadata);
  const writer = console[level] ?? console.error;
  writer('[frontend]', entry);
}

export function createFrontendLogger(bindings: Record<string, unknown> = {}): FrontendLogger {
  return {
    info(message, metadata) {
      writeLog('info', message, { ...bindings, ...metadata });
    },
    warn(message, metadata) {
      writeLog('warn', message, { ...bindings, ...metadata });
    },
    error(message, metadata) {
      writeLog('error', message, { ...bindings, ...metadata });
    },
  };
}
