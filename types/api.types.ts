import type { ExchangeMode, ApiStatus } from "./common.types";

/** POST /api/auth/login — request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /api/auth/login — response data */
export interface LoginResponse {
  email: string;
  message: string;
}

/** GET /api/rate — response data */
export interface RateResponse {
  rate: number;
  mode: ExchangeMode;
  lastUpdated: string;
  apiStatus: ApiStatus;
}

/** GET /api/history — response data */
export interface HistoryResponse {
  items: HistoryItem[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

/** Single history item in the history response */
export interface HistoryItem {
  id: string;
  oldRate: number;
  newRate: number;
  mode: ExchangeMode;
  changedBy: string;
  createdAt: string;
}

/** Server Action: update manual rate — input */
export interface UpdateManualRateInput {
  rate: number;
}

/** Server Action: switch mode — input */
export interface SwitchModeInput {
  mode: ExchangeMode;
}

/** Server Action result returned to client */
export interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

/** ExchangeRate-API response shape */
export interface ExchangeRateApiResponse {
  result: "success" | "error";
  base_code: string;
  target_code: string;
  conversion_rate: number;
  time_last_update_utc: string;
}
