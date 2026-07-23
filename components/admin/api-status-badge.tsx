import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, WifiLow } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiStatus } from "@/types/common.types";

interface ApiStatusBadgeProps {
  status: ApiStatus;
  className?: string;
}

const statusConfig: Record<
  ApiStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  healthy: {
    label: "API Healthy",
    icon: <Wifi className="h-3 w-3" />,
    className:
      "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
  },
  degraded: {
    label: "API Degraded",
    icon: <WifiLow className="h-3 w-3" />,
    className:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  },
  down: {
    label: "API Down",
    icon: <WifiOff className="h-3 w-3" />,
    className:
      "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  },
};

export function ApiStatusBadge({ status, className }: ApiStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 text-xs font-medium", config.className, className)}
      aria-label={`Exchange API status: ${config.label}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
