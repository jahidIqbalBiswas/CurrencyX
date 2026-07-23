import mongoose from "mongoose";
import { connectToDatabase } from "@/config/database";
import { ExchangeHistory } from "@/models/history.model";
import type { IExchangeHistory } from "@/types/database.types";
import type { ExchangeMode } from "@/types/common.types";

interface CreateHistoryInput {
  oldRate: number;
  newRate: number;
  mode: ExchangeMode;
  changedBy: string;
}

interface PaginatedHistory {
  items: IExchangeHistory[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export const HistoryRepository = {
  async create(input: CreateHistoryInput): Promise<IExchangeHistory> {
    await connectToDatabase();
    const entry = await ExchangeHistory.create(input);
    return entry.toObject() as IExchangeHistory;
  },

  /**
   * Cursor-based pagination for exchange history.
   * Uses `_id` as cursor since documents are sorted by `createdAt` descending
   * and `_id` is monotonically increasing (same ordering).
   */
  async findPaginated(
    cursor: string | undefined,
    limit: number
  ): Promise<PaginatedHistory> {
    await connectToDatabase();

    const query = cursor
      ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } }
      : {};

    const [items, total] = await Promise.all([
      ExchangeHistory.find(query)
        .sort({ _id: -1 })
        .limit(limit + 1)
        .lean<IExchangeHistory[]>(),
      ExchangeHistory.countDocuments(),
    ]);

    const hasMore = items.length > limit;
    const paginatedItems = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore
      ? paginatedItems[paginatedItems.length - 1]._id.toString()
      : null;

    return {
      items: paginatedItems,
      nextCursor,
      hasMore,
      total,
    };
  },
};
