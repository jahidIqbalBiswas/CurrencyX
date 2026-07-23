import { SettingsRepository } from "@/repositories/settings.repository";
import {
  EXCHANGE_API_BASE_URL,
  API_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} from "@/constants";
import type { ExchangeRateApiResponse } from "@/types/api.types";
import type { ApiStatus, RateInfo } from "@/types/common.types";

/** In-memory cache for API health status */
let apiStatus: ApiStatus = "healthy";

function getApiKey(): string {
  const key = process.env.EXCHANGE_API_KEY;
  if (!key) throw new Error("EXCHANGE_API_KEY is not defined");
  return key;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const ExchangeService = {
  /**
   * Fetches the live USD→BDT rate from ExchangeRate-API with retry and timeout.
   * Returns null if all retries fail.
   */
  async fetchFromApi(): Promise<number | null> {
    const url = `${EXCHANGE_API_BASE_URL}/${getApiKey()}/pair/USD/BDT`;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(
          () => controller.abort(),
          API_TIMEOUT_MS
        );

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data: ExchangeRateApiResponse = await response.json();

        if (data.result !== "success") {
          throw new Error(`API returned result: ${data.result}`);
        }

        apiStatus = "healthy";
        return data.conversion_rate;
      } catch (error) {
        const isLastAttempt = attempt === MAX_RETRIES;

        if (isLastAttempt) {
          console.error(
            `❌ Exchange API failed after ${MAX_RETRIES} attempts:`,
            error instanceof Error ? error.message : error
          );
          apiStatus = "down";
          return null;
        }

        apiStatus = "degraded";
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }

    return null;
  },

  /**
   * Refreshes the live rate: fetches from API and persists to database.
   * Falls back to the cached DB value if the API is unreachable.
   */
  async refreshLiveRate(): Promise<number> {
    const fetchedRate = await this.fetchFromApi();

    if (fetchedRate !== null) {
      const settings = await SettingsRepository.updateLiveRate(fetchedRate);
      return settings.liveRate;
    }

    // Fallback: return cached live rate from DB
    const settings = await SettingsRepository.getSettings();
    return settings.liveRate;
  },

  /**
   * Returns the currently active rate based on the configured mode.
   * This is the primary method called by the public converter.
   */
  async getCurrentRate(): Promise<RateInfo> {
    const settings = await SettingsRepository.getSettings();

    const rate =
      settings.mode === "manual" ? settings.manualRate : settings.liveRate;

    return {
      rate,
      mode: settings.mode,
      lastUpdated: settings.lastUpdated.toISOString(),
      apiStatus,
    };
  },

  /** Returns the current API health status */
  getApiStatus(): ApiStatus {
    return apiStatus;
  },
};
