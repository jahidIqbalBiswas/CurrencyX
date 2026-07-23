import type { Types, Document } from "mongoose";
import type { ExchangeMode } from "./common.types";

/** Base document interface with Mongoose fields */
interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/** Admin document stored in the `admins` collection */
export interface IAdmin extends BaseDocument {
  email: string;
  passwordHash: string;
}

/** Settings document stored in the `settings` collection (singleton) */
export interface ISettings extends BaseDocument {
  key: string;
  mode: ExchangeMode;
  manualRate: number;
  liveRate: number;
  lastUpdated: Date;
}

/** Exchange history document stored in the `exchangehistories` collection */
export interface IExchangeHistory extends BaseDocument {
  oldRate: number;
  newRate: number;
  mode: ExchangeMode;
  changedBy: string;
}

/** Plain settings object (without Mongoose internals) for service layer */
export interface SettingsData {
  mode: ExchangeMode;
  manualRate: number;
  liveRate: number;
  lastUpdated: Date;
  updatedAt: Date;
}

/** Plain history entry for API responses */
export interface HistoryEntry {
  id: string;
  oldRate: number;
  newRate: number;
  mode: ExchangeMode;
  changedBy: string;
  createdAt: string;
}
