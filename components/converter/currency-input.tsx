"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENCY_INFO } from "@/constants";

interface CurrencyInputProps {
  currency: "USD" | "BDT";
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label: string;
  autoFocus?: boolean;
}

export function CurrencyInput({
  currency,
  value,
  onChange,
  readOnly = false,
  label,
  autoFocus = false,
}: CurrencyInputProps) {
  const id = useId();
  const info = CURRENCY_INFO[currency];

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <span className="text-xl" role="img" aria-label={`${info.name} flag`}>
            {info.flag}
          </span>
          <span className="ml-2.5 text-sm font-semibold text-foreground">
            {info.code}
          </span>
          <div className="ml-3 h-6 w-px bg-border" />
        </div>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          autoFocus={autoFocus}
          className={`h-14 pl-28 pr-4 text-right text-xl font-semibold tabular-nums transition-all ${
            readOnly
              ? "cursor-default bg-muted/50 text-foreground"
              : "bg-background hover:border-primary/50 focus:border-primary"
          }`}
          aria-label={`${label} in ${info.name}`}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <span className="text-sm text-muted-foreground">{info.symbol}</span>
        </div>
      </div>
    </div>
  );
}
