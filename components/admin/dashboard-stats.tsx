import { TrendingUp, Clock, Activity, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ApiStatusBadge } from "./api-status-badge";
import { formatNumber, formatDateTime } from "@/lib/utils";
import type { RateInfo } from "@/types/common.types";

interface DashboardStatsProps {
  rateInfo: RateInfo;
}

export function DashboardStats({ rateInfo }: DashboardStatsProps) {
  const stats = [
    {
      id: "current-rate",
      label: "Current Active Rate",
      value: `${formatNumber(rateInfo.rate)} BDT`,
      subValue: "per 1 USD",
      icon: TrendingUp,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      id: "exchange-mode",
      label: "Exchange Mode",
      value: rateInfo.mode === "live" ? "Live API" : "Manual",
      subValue: rateInfo.mode === "live" ? "Real-time rate" : "Admin controlled",
      icon: Settings,
      iconColor: rateInfo.mode === "live" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400",
      iconBg: rateInfo.mode === "live" ? "bg-green-500/10" : "bg-amber-500/10",
    },
    {
      id: "last-updated",
      label: "Last Updated",
      value: formatDateTime(rateInfo.lastUpdated).split(",")[0],
      subValue: formatDateTime(rateInfo.lastUpdated).split(",").slice(1).join(",").trim(),
      icon: Clock,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      id: "api-status",
      label: "API Status",
      value: null,
      subValue: "ExchangeRate-API",
      icon: Activity,
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-500/10",
      badge: <ApiStatusBadge status={rateInfo.apiStatus} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.id}
            id={stat.id}
            className="border-border/60 transition-shadow hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="mt-2">
                    {stat.badge ? (
                      stat.badge
                    ) : (
                      <p className="truncate text-xl font-bold tabular-nums">
                        {stat.value}
                      </p>
                    )}
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {stat.subValue}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                  aria-hidden="true"
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
