/**
 * In-Memory Rate Limiter
 *
 * Sliding-window rate limiter for Vercel serverless functions.
 * Uses an in-memory Map — state is per-isolate and may reset on cold start.
 * Suitable for burst protection; for durable rate limiting at scale, use
 * Upstash Redis or Vercel KV.
 *
 * Implements Enterprise Architecture Guidelines v1.0, §API Paved Road —
 * "Rate limiting per user/API key."
 *
 * @module rate-limit
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

export interface RateLimiterOptions {
  /** Maximum requests in the window */
  limit: number;
  /** Window duration in milliseconds (default: 60 000 = 1 min) */
  windowMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Remaining tokens in the current window */
  remaining: number;
  /** When the bucket fully refills (Unix ms) */
  resetAt: number;
  /** Total limit */
  limit: number;
}

/**
 * Create a token-bucket rate limiter scoped to a string key (typically IP).
 *
 * ```ts
 * const limiter = createRateLimiter({ limit: 10 });
 * const result = limiter.check(clientIp);
 * if (!result.allowed) { return 429; }
 * ```
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const { limit, windowMs = 60_000 } = options;
  const buckets = new Map<string, RateLimitEntry>();

  // Periodically prune stale buckets to prevent unbounded memory growth
  const PRUNE_INTERVAL = windowMs * 5;
  let lastPrune = Date.now();

  function prune(now: number) {
    if (now - lastPrune < PRUNE_INTERVAL) return;
    lastPrune = now;
    for (const [key, entry] of buckets) {
      if (now - entry.lastRefill > windowMs * 2) {
        buckets.delete(key);
      }
    }
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      prune(now);

      let entry = buckets.get(key);

      if (!entry) {
        entry = { tokens: limit, lastRefill: now };
        buckets.set(key, entry);
      }

      // Refill tokens based on elapsed time
      const elapsed = now - entry.lastRefill;
      const refillRate = limit / windowMs; // tokens per ms
      const refillTokens = elapsed * refillRate;
      entry.tokens = Math.min(limit, entry.tokens + refillTokens);
      entry.lastRefill = now;

      const resetAt = now + Math.ceil((limit - entry.tokens) / refillRate);

      if (entry.tokens >= 1) {
        entry.tokens -= 1;
        return { allowed: true, remaining: Math.floor(entry.tokens), resetAt, limit };
      }

      return { allowed: false, remaining: 0, resetAt, limit };
    },
  };
}

// ─── Shared per-route limiters ───────────────────────────────────────

/** NLP search — 10 req/min (expensive LLM calls) */
export const nlpLimiter = createRateLimiter({ limit: 10 });

/** Lead submission — 5 req/min (prevent spam) */
export const leadsLimiter = createRateLimiter({ limit: 5 });

/** Listing search — 60 req/min */
export const listingsLimiter = createRateLimiter({ limit: 60 });

/** Communities — 30 req/min */
export const communitiesLimiter = createRateLimiter({ limit: 30 });

// ─── Helper ──────────────────────────────────────────────────────────

/**
 * Extract the client IP from a Next.js request (Vercel sets X-Forwarded-For).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '0.0.0.0';
}
