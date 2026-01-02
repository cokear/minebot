import { useState, useEffect } from "react";
import {
  MessageSquare,
  Timer,
  RefreshCw,
  Loader2,
  Zap,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function QuickControlPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  const [autoChatEnabled, setAutoChatEnabled] = useState(false);
  const [autoChatMessages, setAutoChatMessages] = useState<string[]>([]);
  const [autoChatInterval, setAutoChatInterval] = useState(60);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerHours, setTimerHours] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messagesText, setMessagesText] = useState("");
  const { toast } = useToast();

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await api.getFullConfig();
        if (config.autoChat) {
          setAutoChatEnabled(config.autoChat.enabled || false);
          setAutoChatMessages(config.autoChat.messages || []);
          setAutoChatInterval(Math.floor((config.autoChat.interval || 60000) / 1000));
          setMessagesText((config.autoChat.messages || []).join("\n"));
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    };
    loadConfig();
  }, []);

  // 切换自动喊话
  const handleAutoChatToggle = async (enabled: boolean) => {
    setLoading("autoChat");
    try {
      await api.setMode("autoChat", enabled);
      setAutoChatEnabled(enabled);
      toast({
        title: enabled ? "已开启" : "已关闭",
        description: enabled ? "自动喊话已启动" : "自动喊话已停止",
      });
    } catch (error) {
      toast({ title: "错误", description: String(error), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  // 保存自动喊话配置
  const handleSaveAutoChat = async () => {
    setLoading("saveAutoChat");
    try {
      const messages = messagesText.split("\n").filter(m => m.trim());
      await api.updateConfig({
        autoChat: {
          enabled: autoChatEnabled,
          interval: autoChatInterval * 1000,
          messages,
        },
      });
      setAutoChatMessages(messages);
      toast({ title: "成功", description: "自动喊话配置已保存" });
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "错误", description: String(error), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  // 设置定时重启
  const handleSetTimer = async () => {
    if (timerMinutes <= 0 && timerHours <= 0) {
      toast({ title: "错误", description: "请输入有效的时间", variant: "destructive" });
      return;
    }

    setLoading("timer");
    try {
      await api.setTimer(timerMinutes, timerHours, "restart");
      const totalMinutes = timerHours * 60 + timerMinutes;
      toast({
        title: "定时器已设置",
        description: `将在 ${timerHours > 0 ? `${timerHours}小时` : ""}${timerMinutes > 0 ? `${timerMinutes}分钟` : ""} 后重启`,
      });
    } catch (error) {
      toast({ title: "错误", description: String(error), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  // 立即重启
  const handleRestartNow = async () => {
    setLoading("restart");
    try {
      await api.restart();
      toast({ title: "成功", description: "正在重启..." });
    } catch (error) {
      toast({ title: "错误", description: String(error), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5" />
          快捷控制
        </CardTitle>
        <CardDescription>自动喊话和定时重启</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 自动喊话 */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium text-sm">自动喊话</div>
              <div className="text-xs text-muted-foreground">
                {autoChatMessages.length > 0
                  ? `${autoChatMessages.length} 条消息，间隔 ${autoChatInterval} 秒`
                  : "未配置消息"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>自动喊话配置</DialogTitle>
                  <DialogDescription>
                    设置自动发送的消息内容和间隔时间
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>消息列表（每行一条）</Label>
                    <Textarea
                      placeholder="欢迎来到服务器！&#10;有问题可以问我 !ask [问题]&#10;需要帮助请输入 !help"
                      value={messagesText}
                      onChange={(e) => setMessagesText(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>发送间隔（秒）</Label>
                    <Input
                      type="number"
                      min="10"
                      value={autoChatInterval}
                      onChange={(e) => setAutoChatInterval(parseInt(e.target.value) || 60)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSaveAutoChat} disabled={loading === "saveAutoChat"}>
                    {loading === "saveAutoChat" && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    保存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Switch
              checked={autoChatEnabled}
              onCheckedChange={handleAutoChatToggle}
              disabled={loading === "autoChat"}
            />
          </div>
        </div>

        {/* 定时重启 */}
        <div className="p-3 rounded-lg border bg-card space-y-3">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-muted-foreground" />
            <div className="font-medium text-sm">定时重启</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={timerMinutes || ""}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                  className="h-9"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">分</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={timerHours || ""}
                  onChange={(e) => setTimerHours(parseInt(e.target.value) || 0)}
                  className="h-9"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">时</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetTimer}
              disabled={loading === "timer"}
              className="w-full"
            >
              {loading === "timer" ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Timer className="h-4 w-4 mr-1" />
              )}
              设定时器
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRestartNow}
              disabled={loading === "restart"}
              className="w-full"
            >
              {loading === "restart" ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-1" />
              )}
              立即重启
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
