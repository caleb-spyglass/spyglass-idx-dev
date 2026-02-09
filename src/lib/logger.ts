/**
 * Structured Logging Utility
 * 
 * Provides JSON-formatted logs with request IDs for traceability.
 * Designed for Vercel serverless functions where log aggregation
 * depends on structured output.
 * 
 * Usage:
 *   import { createRequestLogger } from '@/lib/logger';
 *   const log = createRequestLogger('GET', '/api/listings');
 *   log.info('Search completed', { resultCount: 24 });
 *   log.error('Failed to fetch', { error: err.message });
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId: string;
  route: string;
  method: string;
  message: string;
  duration_ms?: number;
  [key: string]: unknown;
}

/**
 * Generate a unique request ID.
 * Format: req_<random> (short enough for log readability)
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
 * Create a structured log entry and write it to stdout as JSON.
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
  requestId: string;
  debug: (message: string, extra?: Record<string, unknown>) => void;
  info: (message: string, extra?: Record<string, unknown>) => void;
  warn: (message: string, extra?: Record<string, unknown>) => void;
  error: (message: string, extra?: Record<string, unknown>) => void;
  /** Log a completed request with duration */
  done: (message: string, extra?: Record<string, unknown>) => void;
}

/**
 * Create a request-scoped logger.
 * 
 * @param method - HTTP method (GET, POST, etc.)
 * @param route - Route path (e.g., '/api/listings')
 * @returns Logger instance with bound request ID
 * 
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const log = createRequestLogger('GET', '/api/listings');
 *   log.info('Search started', { filters: { city: 'Austin' } });
 *   // ... do work ...
 *   log.done('Search completed', { resultCount: 24 });
 *   
 *   return NextResponse.json(data, {
 *     headers: { 'X-Request-Id': log.requestId }
 *   });
 * }
 * ```
 */
export function createRequestLogger(method: string, route: string): RequestLogger {
  const requestId = generateRequestId();
  const startTime = Date.now();

  function log(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
    writeLog({
      timestamp: new Date().toISOString(),
      level,
      requestId,
      route,
      method,
      message,
      ...extra,
    });
  }

  return {
    requestId,
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
