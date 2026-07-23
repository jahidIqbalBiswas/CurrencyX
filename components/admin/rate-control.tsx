"use client";

import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, DollarSign, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateManualRate } from "@/actions/admin.actions";
import { manualRateSchema, type ManualRateInput } from "@/validators/rate.validator";

interface RateControlProps {
  currentManualRate: number;
}

export function RateControl({ currentManualRate }: RateControlProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualRateInput>({
    resolver: zodResolver(manualRateSchema),
    defaultValues: { rate: currentManualRate },
  });

  const onSubmit = (data: ManualRateInput) => {
    const formData = new FormData();
    formData.set("rate", String(data.rate));

    startTransition(async () => {
      const result = await updateManualRate(formData);
      if (result.success) {
        toast.success(result.message);
        reset({ rate: data.rate });
      } else {
        toast.error(result.error ?? result.message);
      }
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      aria-label="Update manual exchange rate"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="manual-rate" className="text-sm font-medium">
          Manual Rate (BDT per 1 USD)
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="manual-rate"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="e.g. 121.50"
            className="pl-10 font-mono tabular-nums"
            aria-invalid={!!errors.rate}
            aria-describedby={errors.rate ? "rate-error" : "rate-hint"}
            {...register("rate", { valueAsNumber: true })}
          />
        </div>
        {errors.rate ? (
          <p id="rate-error" className="text-xs text-destructive" role="alert">
            {errors.rate.message}
          </p>
        ) : (
          <p id="rate-hint" className="text-xs text-muted-foreground">
            Current manual rate: {currentManualRate.toFixed(2)} BDT
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={isPending}
        aria-label={isPending ? "Updating rate..." : "Update manual rate"}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Update Rate
          </>
        )}
      </Button>
    </form>
  );
}
