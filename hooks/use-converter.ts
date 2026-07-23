"use client";

import { useState, useCallback, useMemo } from "react";
import type { CurrencyDirection } from "@/types/common.types";
import { safeParseFloat } from "@/lib/utils";

interface UseConverterProps {
  rate: number;
}

interface UseConverterReturn {
  amount: string;
  result: number | null;
  direction: CurrencyDirection;
  setAmount: (value: string) => void;
  swap: () => void;
  clear: () => void;
}

export function useConverter({ rate }: UseConverterProps): UseConverterReturn {
  const [amount, setAmountState] = useState<string>("");
  const [direction, setDirection] = useState<CurrencyDirection>("USD_TO_BDT");

  const setAmount = useCallback((value: string) => {
    // Allow only valid numeric input (digits, one decimal point)
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmountState(value);
    }
  }, []);

  const result = useMemo(() => {
    const parsed = safeParseFloat(amount);
    if (parsed === null || rate <= 0) return null;

    if (direction === "USD_TO_BDT") {
      return Math.round(parsed * rate * 100) / 100;
    }
    return Math.round((parsed / rate) * 100) / 100;
  }, [amount, rate, direction]);

  const swap = useCallback(() => {
    setDirection((prev) =>
      prev === "USD_TO_BDT" ? "BDT_TO_USD" : "USD_TO_BDT"
    );
    setAmountState("");
  }, []);

  const clear = useCallback(() => {
    setAmountState("");
  }, []);

  return {
    amount,
    result,
    direction,
    setAmount,
    swap,
    clear,
  };
}
