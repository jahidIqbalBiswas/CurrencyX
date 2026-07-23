"use client";

import { useState, useCallback } from "react";
import { ChevronDown, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { formatNumber, formatDateTime } from "@/lib/utils";
import type { HistoryResponse, HistoryItem } from "@/types/api.types";

interface HistoryTableProps {
  initialData: HistoryResponse;
}

export function HistoryTable({ initialData }: HistoryTableProps) {
  const [items, setItems] = useState<HistoryItem[]>(initialData.items);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData.nextCursor
  );
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [total] = useState(initialData.total);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return;
    setIsLoading(true);

    try {
      const result = await apiClient<HistoryResponse>(
        `/api/history?cursor=${nextCursor}`
      );

      if (result.success && result.data) {
        setItems((prev) => [...prev, ...result.data!.items]);
        setNextCursor(result.data.nextCursor);
        setHasMore(result.data.hasMore);
      }
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, isLoading]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          No history yet
        </p>
        <p className="text-xs text-muted-foreground/60">
          Rate changes will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {items.length} of {total} changes
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Old Rate
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                New Rate
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Change
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Mode
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Changed By
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Date &amp; Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const rateChange = item.newRate - item.oldRate;
              const isIncrease = rateChange > 0;
              const isDecrease = rateChange < 0;

              return (
                <TableRow
                  key={item.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <TableCell className="font-mono tabular-nums text-sm">
                    {formatNumber(item.oldRate)}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums text-sm font-semibold">
                    {formatNumber(item.newRate)}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        isIncrease
                          ? "text-green-600 dark:text-green-400"
                          : isDecrease
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isIncrease ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : isDecrease ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      <span className="tabular-nums">
                        {rateChange > 0 ? "+" : ""}
                        {formatNumber(rateChange)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.mode === "live" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.mode === "live" ? "Live" : "Manual"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">
                    {item.changedBy}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(item.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadMore}
            disabled={isLoading}
            className="gap-2"
            aria-label="Load more history entries"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                Load More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export function HistoryTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
