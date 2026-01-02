import { Clock, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useBotControl } from "@/hooks/useBot";
import { toast } from "sonner";

export function TimerControls() {
  const [minutes, setMinutes] = useState("");
  const [hours, setHours] = useState("");
  const [settingTimer, setSettingTimer] = useState(false);
  const { restartBot, loading: restartLoading } = useBotControl();

  const handleSetTimer = async (type: 'minutes' | 'hours') => {
    setSettingTimer(true);
    try {
      const mins = type === 'minutes' ? parseInt(minutes) || 0 : 0;
      const hrs = type === 'hours' ? parseInt(hours) || 0 : 0;
      await api.setTimer(mins, hrs, 'restart');
      toast.success(`定时器已设置: ${hrs}时${mins}分后重启`);
    } catch (error) {
      toast.error('设置定时器失败');
    } finally {
      setSettingTimer(false);
    }
  };

  const handleRestart = async () => {
    try {
      await restartBot();
      toast.success('机器人正在重启');
    } catch (error) {
      toast.error('重启失败');
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Minutes */}
        <div className="space-y-2">
          <Input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="分"
            className="bg-muted/50 border-border text-center"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full border-border hover:bg-secondary"
            onClick={() => handleSetTimer('minutes')}
            disabled={settingTimer}
          >
            设分
          </Button>
        </div>

        {/* Hours */}
        <div className="space-y-2">
          <Input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="时"
            className="bg-muted/50 border-border text-center"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full border-border hover:bg-secondary"
            onClick={() => handleSetTimer('hours')}
            disabled={settingTimer}
          >
            设时
          </Button>
        </div>
      </div>

      {/* Restart Button */}
      <Button
        className="w-full bg-gold hover:bg-gold/90 text-primary-foreground font-medium"
        onClick={handleRestart}
        disabled={restartLoading}
      >
        {restartLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Zap className="mr-2 h-4 w-4" />
        )}
        立即指令重启
      </Button>
    </div>
  );
}
