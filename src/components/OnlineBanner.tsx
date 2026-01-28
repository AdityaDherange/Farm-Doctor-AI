import { Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cn } from "@/lib/utils";

export function OnlineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <div
      className={cn(
        "status-indicator text-xs font-medium transition-all duration-300",
        isOnline
          ? "bg-success/15 text-success"
          : "bg-warning/15 text-warning"
      )}
    >
      {isOnline ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <Wifi className="h-3.5 w-3.5" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
