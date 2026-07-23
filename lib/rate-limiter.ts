import { RATE_LIMIT_WINDOW_MS } from "@/constants";

interface RateLimitEntry {
  timestamps: number[];
}

/**
 * In-memory sliding window rate limiter.
 * Suitable for single-instance deployments (Vercel serverless).
 * For multi-instance production, upgrade to Upstash Redis.
 */
const store = new Map<string, RateLimitEntry>();

/** Periodically clean stale entries to prevent memory leaks */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Checks if a request from the given identifier is within rate limits.
 * Uses a sliding window approach: counts requests within the last `windowMs`.
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier) ?? { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const reset = oldestInWindow + windowMs;

    return {
      success: false,
      remaining: 0,
      reset,
    };
  }

  entry.timestamps.push(now);
  store.set(identifier, entry);

  return {
    success: true,
    remaining: maxRequests - entry.timestamps.length,
    reset: now + windowMs,
  };
}
