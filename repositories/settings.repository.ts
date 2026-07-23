import { connectToDatabase } from "@/config/database";
import { Settings } from "@/models/settings.model";
import type { ISettings } from "@/types/database.types";
import type { ExchangeMode } from "@/types/common.types";
import { SETTINGS_KEY, DEFAULT_MANUAL_RATE, DEFAULT_LIVE_RATE } from "@/constants";

export const SettingsRepository = {
  /**
   * Gets the singleton settings document, creating it with defaults if it doesn't exist.
   * Uses upsert to avoid race conditions on first access.
   */
  async getSettings(): Promise<ISettings> {
    await connectToDatabase();
    const settings = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      {
        $setOnInsert: {
          key: SETTINGS_KEY,
          mode: "manual" as ExchangeMode,
          manualRate: DEFAULT_MANUAL_RATE,
          liveRate: DEFAULT_LIVE_RATE,
          lastUpdated: new Date(),
        },
      },
      { upsert: true, new: true, lean: true }
    );

    return settings as ISettings;
  },

  async updateManualRate(rate: number): Promise<ISettings> {
    await connectToDatabase();
    const settings = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: { manualRate: rate } },
      { new: true, lean: true }
    );

    if (!settings) {
      throw new Error("Settings document not found");
    }

    return settings as ISettings;
  },

  async updateLiveRate(rate: number): Promise<ISettings> {
    await connectToDatabase();
    const settings = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      {
        $set: {
          liveRate: rate,
          lastUpdated: new Date(),
        },
      },
      { new: true, lean: true }
    );

    if (!settings) {
      throw new Error("Settings document not found");
    }

    return settings as ISettings;
  },

  async updateMode(mode: ExchangeMode): Promise<ISettings> {
    await connectToDatabase();
    const settings = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: { mode } },
      { new: true, lean: true }
    );

    if (!settings) {
      throw new Error("Settings document not found");
    }

    return settings as ISettings;
  },
};
