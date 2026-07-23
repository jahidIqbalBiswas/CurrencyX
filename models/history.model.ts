import mongoose, { Schema, type Model } from "mongoose";
import type { IExchangeHistory } from "@/types/database.types";

const exchangeHistorySchema = new Schema<IExchangeHistory>(
  {
    oldRate: {
      type: Number,
      required: true,
    },
    newRate: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      enum: ["manual", "live"],
      required: true,
    },
    changedBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "exchangehistories",
  }
);

/** Index for efficient cursor-based pagination (newest first) */
exchangeHistorySchema.index({ createdAt: -1 });

export const ExchangeHistory: Model<IExchangeHistory> =
  mongoose.models.ExchangeHistory ??
  mongoose.model<IExchangeHistory>("ExchangeHistory", exchangeHistorySchema);
