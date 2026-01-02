import { useState } from "react";
import {
  UserPlus,
  Sword,
  Navigation,
  Pickaxe,
  Square,
  ArrowUp,
  ChevronDown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface BotControlPanelProps {
  botId: string;
  botName: string;
  connected: boolean;
  modes?: {
    follow?: boolean;
    autoAttack?: boolean;
    patrol?: boolean;
    mining?: boolean;
  };
  players?: string[];
  onUpdate?: () => void;
}

export function BotControlPanel({
  botId,
  botName,
  connected,
  modes = {},
  players = [],
  onUpdate
}: BotControlPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [followTarget, setFollowTarget] = useState<string>("");
  const [attackMode, setAttackMode] = useState<string>("hostile");
  const { toast } = useToast();

  const handleBehavior = async (behavior: string, enabled: boolean, options?: Record<string, unknown>) => {
    if (!connected) {
      toast({ title: "错误", description: "Bot 未连接", variant: "destructive" });
      return;
    }

    setLoading(behavior);
    try {
      const result = await api.setBehavior(botId, behavior, enabled, options);
      toast({ title: enabled ? "已启用" : "已停止", description: result.message });
      onUpdate?.();
    } catch (error) {
      toast({ title: "错误", description: String(error), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleAction = async (action: string, params?: Record<string, unknown>) => {
    if (!connected) {
      toast({ title: "错误", description: "Bot 未连接", variant: "destructive" });
      return;
    }

    setLoading(action);
    try {
      const result = await api.doAction(botId, action, params);
      toast({ title: "执行成功", description: result.message });
    } catch (error) {
      toast({ title: "错误", description: String(error), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleStopAll = async () => {
    setLoading("stop");
    try {
      await api.stopAllBehaviors(botId);
      toast({ title: "已停止", description: "所有行为已停止" });
      onUpdate?.();
    } catch (error) {
      toast({ title: "错误", description: String(error), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  if (!connected) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between mt-2">
          <span className="text-xs">行为控制</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-3">
        {/* 活动状态 */}
        <div className="flex flex-wrap gap-1">
          {modes.follow && <Badge variant="secondary">跟随中</Badge>}
          {modes.autoAttack && <Badge variant="destructive">攻击中</Badge>}
          {modes.patrol && <Badge variant="secondary">巡逻中</Badge>}
          {modes.mining && <Badge variant="secondary">挖矿中</Badge>}
        </div>

        {/* 跟随控制 */}
        <div className="flex gap-2">
          <Select value={followTarget} onValueChange={setFollowTarget}>
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SelectValue placeholder="选择玩家" />
            </SelectTrigger>
            <SelectContent>
              {players.filter(p => p !== botName).map(player => (
                <SelectItem key={player} value={player}>{player}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant={modes.follow ? "destructive" : "outline"}
            onClick={() => handleBehavior("follow", !modes.follow, { target: followTarget })}
            disabled={loading !== null || (!modes.follow && !followTarget)}
          >
            {loading === "follow" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          </Button>
        </div>

        {/* 攻击控制 */}
        <div className="flex gap-2">
          <Select value={attackMode} onValueChange={setAttackMode}>
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hostile">敌对生物</SelectItem>
              <SelectItem value="all">所有生物</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant={modes.autoAttack ? "destructive" : "outline"}
            onClick={() => handleBehavior("attack", !modes.autoAttack, { mode: attackMode })}
            disabled={loading !== null}
          >
            {loading === "attack" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sword className="h-4 w-4" />}
          </Button>
        </div>

        {/* 其他行为按钮 */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            size="sm"
            variant={modes.patrol ? "destructive" : "outline"}
            onClick={() => handleBehavior("patrol", !modes.patrol)}
            disabled={loading !== null}
            title="巡逻"
          >
            {loading === "patrol" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant={modes.mining ? "destructive" : "outline"}
            onClick={() => handleBehavior("mining", !modes.mining)}
            disabled={loading !== null}
            title="挖矿"
          >
            {loading === "mining" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pickaxe className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction("jump")}
            disabled={loading !== null}
            title="跳跃"
          >
            {loading === "jump" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleStopAll}
            disabled={loading !== null}
            title="停止所有"
          >
            {loading === "stop" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
