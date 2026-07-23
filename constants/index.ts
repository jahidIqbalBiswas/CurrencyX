/** Singleton discriminator key for the Settings collection */
export const SETTINGS_KEY = "exchange_settings" as const;

/** Default manual rate when first initializing the database */
export const DEFAULT_MANUAL_RATE = 131.5;

/** Default live rate fallback */
export const DEFAULT_LIVE_RATE = 0;

/** JWT token expiry duration */
export const JWT_EXPIRY = "24h" as const;

/** JWT cookie name */
export const AUTH_COOKIE_NAME = "auth_token" as const;

/** Cookie max age in seconds (24 hours) */
export const COOKIE_MAX_AGE = 60 * 60 * 24;

/** Exchange rate API base URL */
export const EXCHANGE_API_BASE_URL = "https://v6.exchangerate-api.com/v6";

/** API request timeout in milliseconds */
export const API_TIMEOUT_MS = 8000;

/** Maximum retry attempts for API calls */
export const MAX_RETRIES = 3;

/** Retry delay base in milliseconds (exponential backoff) */
export const RETRY_DELAY_MS = 1000;

/** Rate limiter: max requests for auth endpoints per window */
export const RATE_LIMIT_AUTH_MAX = 5;

/** Rate limiter: max requests for general API endpoints per window */
export const RATE_LIMIT_API_MAX = 30;

/** Rate limiter: window duration in milliseconds (60 seconds) */
export const RATE_LIMIT_WINDOW_MS = 60_000;

/** History pagination: default page size */
export const HISTORY_PAGE_SIZE = 20;

/** Currency codes */
export const CURRENCY = {
  USD: "USD",
  BDT: "BDT",
} as const;

/** Currency display info */
export const CURRENCY_INFO = {
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "",
    flag: "🇺🇸",
  },
  BDT: {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "",
    flag: "🇧🇩",
  },
} as const;

/** Admin-protected route prefixes */
export const PROTECTED_ROUTES = [
  "/admin/dashboard",
  "/api/history",
  "/api/auth/logout",
] as const;

/** Routes that should have stricter rate limiting */
export const AUTH_ROUTES = ["/api/auth/login"] as const;
