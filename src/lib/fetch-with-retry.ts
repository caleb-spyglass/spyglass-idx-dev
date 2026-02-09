/**
 * Resilient HTTP Fetch Utility
 *
 * Wraps the standard fetch() with:
 *   - Configurable timeouts (default 10 s)
 *   - Retry with exponential back-off (default 2 retries)
 *   - Abort-controller management
 *
 * Implements Enterprise Architecture Guidelines v1.0, §8 — "Fail safely:
 * Timeouts, retries, idempotency, circuit breakers" and §Integration Patterns —
 * "All external calls must have timeouts + retries."
 *
 * @module fetch-with-retry
 */

export interface FetchWithRetryOptions extends RequestInit {
  /** Total timeout per attempt in milliseconds (default: 10 000) */
  timeoutMs?: number;
  /** Maximum number of retries after the initial attempt (default: 2) */
  maxRetries?: number;
  /** Base delay between retries in milliseconds — doubled each attempt (default: 500) */
  retryBaseMs?: number;
  /** HTTP methods considered safe to retry. Non-matching methods only retry on network errors, not 5xx. */
  idempotentMethods?: string[];
}

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_BASE_MS = 500;
const DEFAULT_IDEMPOTENT = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];

/**
 * Determine whether a response status warrants a retry.
 * Only 502 / 503 / 504 are considered transient server errors.
 */
function isRetryableStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}

/**
 * Execute a fetch with timeout + retry.
 *
 * Usage mirrors the standard fetch() API — just add the extra options:
 *
 * ```ts
 * const res = await fetchWithRetry(url, {
 *   method: 'GET',
 *   headers: { 'REPLIERS-API-KEY': key },
 *   timeoutMs: 8000,
 *   maxRetries: 2,
 * });
 * ```
 */
export async function fetchWithRetry(
  url: string | URL,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    retryBaseMs = DEFAULT_RETRY_BASE_MS,
    idempotentMethods = DEFAULT_IDEMPOTENT,
    ...fetchInit
  } = options;

  const method = (fetchInit.method || 'GET').toUpperCase();
  const isIdempotent = idempotentMethods.includes(method);

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url instanceof URL ? url.toString() : url, {
        ...fetchInit,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Return immediately for success or non-retryable status
      if (response.ok || !isRetryableStatus(response.status)) {
        return response;
      }

      // Retry on transient 5xx only for idempotent methods
      if (!isIdempotent) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status} from ${method} ${url}`);
    } catch (err) {
      clearTimeout(timer);

      // Network errors (timeout, DNS, etc.) are always retryable
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    // Don't sleep after the last attempt
    if (attempt < maxRetries) {
      const delay = retryBaseMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError ?? new Error(`fetchWithRetry exhausted ${maxRetries} retries for ${url}`);
}
