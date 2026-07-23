"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CurrencyInput } from "./currency-input";
import { SwapButton } from "./swap-button";
import { ResultDisplay } from "./result-display";
import { useConverter } from "@/hooks/use-converter";
import { formatNumber } from "@/lib/utils";
import type { RateInfo } from "@/types/common.types";

interface ConverterCardProps {
  rateInfo: RateInfo;
}

export function ConverterCard({ rateInfo }: ConverterCardProps) {
  const { amount, result, direction, setAmount, swap, clear } = useConverter({
    rate: rateInfo.rate,
  });

  const isUsdToBdt = direction === "USD_TO_BDT";

  const fromCurrency = isUsdToBdt ? "USD" : "BDT";
  const toCurrency = isUsdToBdt ? "BDT" : "USD";
  const fromLabel = isUsdToBdt ? "You send" : "You send";
  const toLabel = isUsdToBdt ? "You receive" : "You receive";

  const resultDisplay = result !== null ? formatNumber(result) : "";

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xl shadow-primary/5 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Currency Converter
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">
        {/* From currency */}
        <CurrencyInput
          currency={fromCurrency}
          value={amount}
          onChange={setAmount}
          label={fromLabel}
          autoFocus
        />

        {/* Swap button */}
        <SwapButton onSwap={swap} />

        {/* To currency (read-only result) */}
        <CurrencyInput
          currency={toCurrency}
          value={resultDisplay}
          readOnly
          label={toLabel}
        />

        {/* Result info and actions */}
        <ResultDisplay
          result={result}
          rate={rateInfo.rate}
          mode={rateInfo.mode}
          lastUpdated={rateInfo.lastUpdated}
          onClear={clear}
          resultCurrency={toCurrency}
        />
      </CardContent>
    </Card>
  );
}
