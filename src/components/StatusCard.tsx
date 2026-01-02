import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  status?: "online" | "offline" | "warning";
  description?: string;
}

export function StatusCard({ title, value, icon: Icon, status = "online", description }: StatusCardProps) {
  const statusColors = {
    online: "bg-primary",
    offline: "bg-redstone",
    warning: "bg-gold",
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:glow-emerald">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full animate-pulse-glow", statusColors[status])} />
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="rounded-lg bg-secondary p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
