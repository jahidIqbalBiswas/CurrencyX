import { HistoryRepository } from "@/repositories/history.repository";
import type { ExchangeMode } from "@/types/common.types";
import type { HistoryEntry } from "@/types/database.types";
import type { HistoryResponse } from "@/types/api.types";

export const HistoryService = {
  /** Logs a rate change event to the exchange history */
  async logChange(
    oldRate: number,
    newRate: number,
    mode: ExchangeMode,
    changedBy: string
  ): Promise<void> {
    await HistoryRepository.create({
      oldRate,
      newRate,
      mode,
      changedBy,
    });
  },

  /** Retrieves paginated history with cursor-based navigation */
  async getHistory(
    cursor: string | undefined,
    limit: number
  ): Promise<HistoryResponse> {
    const result = await HistoryRepository.findPaginated(cursor, limit);

    const items: HistoryEntry[] = result.items.map((item) => ({
      id: item._id.toString(),
      oldRate: item.oldRate,
      newRate: item.newRate,
      mode: item.mode,
      changedBy: item.changedBy,
      createdAt: item.createdAt.toISOString(),
    }));

    return {
      items,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      total: result.total,
    };
  },
};
