import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BotTypeCardProps {
  title: string;
  icon: LucideIcon;
  features: string[];
  color: "emerald" | "diamond" | "amethyst" | "gold";
}

export function BotTypeCard({ title, icon: Icon, features, color }: BotTypeCardProps) {
  const colorStyles = {
    emerald: {
      border: "border-primary/30 hover:border-primary",
      icon: "text-primary",
      bg: "from-primary/10 to-transparent",
    },
    diamond: {
      border: "border-diamond/30 hover:border-diamond",
      icon: "text-diamond",
      bg: "from-diamond/10 to-transparent",
    },
    amethyst: {
      border: "border-amethyst/30 hover:border-amethyst",
      icon: "text-amethyst",
      bg: "from-amethyst/10 to-transparent",
    },
    gold: {
      border: "border-gold/30 hover:border-gold",
      icon: "text-gold",
      bg: "from-gold/10 to-transparent",
    },
  };

  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card p-6 transition-all duration-300",
        styles.border
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100", styles.bg)} />
      
      <div className="relative space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg bg-secondary p-2.5", styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold">{title}</h4>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", styles.icon.replace("text-", "bg-"))} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
