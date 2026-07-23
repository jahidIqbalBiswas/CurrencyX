import mongoose, { Schema, type Model } from "mongoose";
import type { ISettings } from "@/types/database.types";
import { SETTINGS_KEY, DEFAULT_MANUAL_RATE, DEFAULT_LIVE_RATE } from "@/constants";

const settingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: SETTINGS_KEY,
    },
    mode: {
      type: String,
      enum: ["manual", "live"],
      required: true,
      default: "manual",
    },
    manualRate: {
      type: Number,
      required: true,
      default: DEFAULT_MANUAL_RATE,
      min: 0,
    },
    liveRate: {
      type: Number,
      required: true,
      default: DEFAULT_LIVE_RATE,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "settings",
  }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings ??
  mongoose.model<ISettings>("Settings", settingsSchema);
