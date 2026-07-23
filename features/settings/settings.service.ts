import { SettingsRepository } from "@/repositories/settings.repository";
import type { ExchangeMode } from "@/types/common.types";
import type { SettingsData } from "@/types/database.types";

function toSettingsData(doc: {
  mode: ExchangeMode;
  manualRate: number;
  liveRate: number;
  lastUpdated: Date;
  updatedAt: Date;
}): SettingsData {
  return {
    mode: doc.mode,
    manualRate: doc.manualRate,
    liveRate: doc.liveRate,
    lastUpdated: doc.lastUpdated,
    updatedAt: doc.updatedAt,
  };
}

export const SettingsService = {
  async getSettings(): Promise<SettingsData> {
    const settings = await SettingsRepository.getSettings();
    return toSettingsData(settings);
  },

  /**
   * Updates the manual rate and returns both old and new values.
   * The caller is responsible for logging the history entry.
   */
  async updateManualRate(
    rate: number
  ): Promise<{ oldRate: number; newRate: number }> {
    const current = await SettingsRepository.getSettings();
    const oldRate = current.manualRate;

    await SettingsRepository.updateManualRate(rate);

    return { oldRate, newRate: rate };
  },

  /**
   * Switches the exchange rate mode.
   * Returns the previous mode for history logging.
   */
  async switchMode(
    mode: ExchangeMode
  ): Promise<{ previousMode: ExchangeMode }> {
    const current = await SettingsRepository.getSettings();
    const previousMode = current.mode;

    await SettingsRepository.updateMode(mode);

    return { previousMode };
  },
};
