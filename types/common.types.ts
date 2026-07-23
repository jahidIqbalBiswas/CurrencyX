/** Exchange rate mode — either manually set by admin or fetched from live API */
export type ExchangeMode = "manual" | "live";

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Pagination cursor for history queries */
export interface PaginationParams {
  cursor?: string;
  limit: number;
}

/** Paginated response with cursor-based navigation */
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

/** JWT payload embedded in admin tokens */
export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

/** Currency direction for the converter */
export type CurrencyDirection = "USD_TO_BDT" | "BDT_TO_USD";

/** Rate display info shown to users */
export interface RateInfo {
  rate: number;
  mode: ExchangeMode;
  lastUpdated: string;
  apiStatus: ApiStatus;
}

/** API health status */
export type ApiStatus = "healthy" | "degraded" | "down";
