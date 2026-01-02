import { Eye, MessageCircle, Route, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModes } from "@/hooks/useBot";

interface ModeButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

function ModeButton({ icon, label, isActive, onClick, variant = "default", disabled }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
        isActive && variant === "default" && "bg-primary/20 text-primary border border-primary/50",
        isActive && variant === "danger" && "bg-redstone/20 text-redstone border border-redstone/50",
        !isActive && "bg-secondary text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function ModeToggles() {
  const { modes, toggleMode, loading } = useModes();

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid grid-cols-3 gap-3">
        <ModeButton
          icon={<Eye className="h-4 w-4" />}
          label="AI视角"
          isActive={modes.aiView}
          onClick={() => toggleMode("aiView")}
          disabled={loading}
        />
        <ModeButton
          icon={<Route className="h-4 w-4" />}
          label="巡逻模式"
          isActive={modes.patrol}
          onClick={() => toggleMode("patrol")}
          disabled={loading}
        />
        <ModeButton
          icon={<MessageCircle className="h-4 w-4" />}
          label="自动喊话"
          isActive={modes.autoChat}
          onClick={() => toggleMode("autoChat")}
          variant="danger"
          disabled={loading}
        />
      </div>
    </div>
  );
}
