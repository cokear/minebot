import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CommandCardProps {
  command: string;
  description: string;
  icon: LucideIcon;
  category: "movement" | "ai" | "utility";
}

export function CommandCard({ command, description, icon: Icon, category }: CommandCardProps) {
  const categoryStyles = {
    movement: "border-primary/30 hover:border-primary",
    ai: "border-amethyst/30 hover:border-amethyst",
    utility: "border-gold/30 hover:border-gold",
  };

  const iconStyles = {
    movement: "text-primary",
    ai: "text-amethyst",
    utility: "text-gold",
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-4 rounded-lg border bg-card p-4 transition-all duration-300 hover:bg-secondary/50",
        categoryStyles[category]
      )}
    >
      <div className={cn("mt-0.5 rounded-lg bg-secondary p-2.5", iconStyles[category])}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 space-y-1">
        <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm font-semibold text-foreground">
          {command}
        </code>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
