"use client";

import { useTransition } from "react";
import { Loader2, Zap, Wrench, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { switchMode, refreshLiveRate } from "@/actions/admin.actions";
import type { ExchangeMode } from "@/types/common.types";

interface ModeSwitchProps {
  currentMode: ExchangeMode;
  currentLiveRate: number;
}

export function ModeSwitch({ currentMode, currentLiveRate }: ModeSwitchProps) {
  const [isSwitching, startSwitching] = useTransition();
  const [isRefreshing, startRefreshing] = useTransition();

  const isLive = currentMode === "live";

  const handleModeChange = (checked: boolean) => {
    const newMode: ExchangeMode = checked ? "live" : "manual";
    const formData = new FormData();
    formData.set("mode", newMode);

    startSwitching(async () => {
      const result = await switchMode(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error ?? result.message);
      }
    });
  };

  const handleRefresh = () => {
    startRefreshing(async () => {
      const result = await refreshLiveRate();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4 transition-colors hover:bg-muted/30">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              isLive ? "bg-green-500/10" : "bg-amber-500/10"
            }`}
            aria-hidden="true"
          >
            {isLive ? (
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <Label
              htmlFor="mode-switch"
              className="cursor-pointer text-sm font-medium"
            >
              {isLive ? "Live Mode" : "Manual Mode"}
            </Label>
            <p className="text-xs text-muted-foreground">
              {isLive
                ? "Using real-time API rate"
                : "Using admin-defined rate"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSwitching && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <Switch
            id="mode-switch"
            checked={isLive}
            onCheckedChange={handleModeChange}
            disabled={isSwitching}
            aria-label={`Switch to ${isLive ? "manual" : "live"} mode`}
          />
        </div>
      </div>

      {/* Live rate info & refresh */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Live API Rate
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold tabular-nums">
              {currentLiveRate > 0 ? `${currentLiveRate.toFixed(2)} BDT` : "Not fetched"}
            </span>
            {currentLiveRate > 0 && (
              <Badge variant="secondary" className="text-xs">
                per USD
              </Badge>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 shrink-0"
          aria-label={isRefreshing ? "Refreshing live rate..." : "Refresh live rate from API"}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
