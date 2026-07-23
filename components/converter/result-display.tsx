"use client";

import { Copy, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import type { ExchangeMode } from "@/types/common.types";

interface ResultDisplayProps {
  result: number | null;
  rate: number;
  mode: ExchangeMode;
  lastUpdated: string;
  onClear: () => void;
  resultCurrency: "USD" | "BDT";
}

export function ResultDisplay({
  result,
  rate,
  mode,
  lastUpdated,
  onClear,
  resultCurrency,
}: ResultDisplayProps) {
  const { copied, copy } = useCopyClipboard();

  const handleCopy = async () => {
    if (result !== null) {
      await copy(formatNumber(result));
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={result === null}
          className="gap-2 transition-all"
          aria-label="Copy result to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={result === null}
          className="gap-2 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Clear input"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>

      {/* Rate info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg bg-muted/50 p-3 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Rate:</span>
          <span className="font-semibold tabular-nums">
            1 USD = {formatNumber(rate)} BDT
          </span>
        </div>
        <Badge
          variant={mode === "live" ? "default" : "secondary"}
          className="text-xs"
        >
          {mode === "live" ? "🟢 Live" : "🔧 Manual"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(lastUpdated)}
        </span>
      </div>
    </div>
  );
}
