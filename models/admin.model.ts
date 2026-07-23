import mongoose, { Schema, type Model } from "mongoose";
import type { IAdmin } from "@/types/database.types";

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "admins",
  }
);

/**
 * Prevents model re-compilation during Next.js hot-reload.
 * Uses the compiled model if it already exists, otherwise creates it.
 */
export const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>("Admin", adminSchema);
