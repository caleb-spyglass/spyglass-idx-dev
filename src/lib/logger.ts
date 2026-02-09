/**
 * Structured Logging Utility
 *
 * Provides JSON-formatted logs with request IDs and correlation IDs for
 * distributed tracing. Designed for Vercel serverless functions where log
 * aggregation depends on structured stdout.
 *
 * Implements Enterprise Architecture Guidelines v1.0, §Observability Baseline:
 *   - Structured logs (JSON)
 *   - Request IDs
 *   - Correlation IDs (propagated from upstream via X-Correlation-Id header)
 *   - Key metrics: latency (duration_ms), error/warn level, throughput counts
 *
 * Usage:
 *   import { createRequestLogger } from '@/lib/logger';
 *   const log = createRequestLogger(request, '/api/listings');
 *   log.info('Search completed', { resultCount: 24 });
 *   log.error('Failed to fetch', { error: err.message });
 *
 * @module logger
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId: string;
  correlationId: string;
  route: string;
  method: string;
  message: string;
  duration_ms?: number;
  [key: string]: unknown;
}

/**
 * Generate a unique request ID.
 * Format: req_<random12> — short enough for log readability.
 */
export function generateRequestId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'req_';
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * Write a structured log entry as a single JSON line.
 */
function writeLog(entry: LogEntry): void {
  const { level, ...rest } = entry;
  const output = JSON.stringify({ level, ...rest });

  switch (level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'debug':
      console.debug(output);
      break;
    default:
      console.log(output);
  }
}

export interface RequestLogger {
  /** Unique ID for this request — include in X-Request-Id response header */
  requestId: string;
  /** Correlation ID — propagated from upstream or generated fresh */
  correlationId: string;
  debug: (message: string, extra?: Record<string, unknown>) => void;
  info: (message: string, extra?: Record<string, unknown>) => void;
  warn: (message: string, extra?: Record<string, unknown>) => void;
  error: (message: string, extra?: Record<string, unknown>) => void;
  /** Log a completed request with automatic duration_ms calculation */
  done: (message: string, extra?: Record<string, unknown>) => void;
}

/**
 * Create a request-scoped logger.
 *
 * Accepts either a full Request object (to extract method + correlation ID
 * from headers) or a plain method string for backward compatibility.
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const log = createRequestLogger(request, '/api/listings');
 *   log.info('Search started', { filters: { city: 'Austin' } });
 *   // ... do work ...
 *   log.done('Search completed', { resultCount: 24 });
 *
 *   return NextResponse.json(data, {
 *     headers: {
 *       'X-Request-Id': log.requestId,
 *       'X-Correlation-Id': log.correlationId,
 *     }
 *   });
 * }
 * ```
 */
export function createRequestLogger(
  methodOrRequest: string | Request,
  route: string,
): RequestLogger {
  const requestId = generateRequestId();
  const startTime = Date.now();

  let method: string;
  let correlationId: string;

  if (typeof methodOrRequest === 'string') {
    method = methodOrRequest;
    correlationId = requestId; // no upstream header — use requestId
  } else {
    method = methodOrRequest.method;
    correlationId =
      methodOrRequest.headers.get('x-correlation-id') ||
      methodOrRequest.headers.get('x-request-id') ||
      requestId;
  }

  function log(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
    writeLog({
      timestamp: new Date().toISOString(),
      level,
      requestId,
      correlationId,
      route,
      method,
      message,
      ...extra,
    });
  }

  return {
    requestId,
    correlationId,
    debug: (message, extra) => log('debug', message, extra),
    info: (message, extra) => log('info', message, extra),
    warn: (message, extra) => log('warn', message, extra),
    error: (message, extra) => log('error', message, extra),
    done: (message, extra) => {
      log('info', message, {
        duration_ms: Date.now() - startTime,
        ...extra,
      });
    },
  };
}
