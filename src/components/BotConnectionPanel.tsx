import { useState, useEffect } from "react";
import { Server, Plug, Unplug, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useBotControl, useWebSocket } from "@/hooks/useBot";
import { toast } from "sonner";

export function BotConnectionPanel() {
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("25565");
  const [username, setUsername] = useState("MinecraftBot");
  const [version, setVersion] = useState("");
  const { connectBot, disconnectBot, loading } = useBotControl();
  const { status } = useWebSocket();

  useEffect(() => {
    // Load config on mount
    api.getConfig().then(config => {
      if (config.server) {
        setHost(config.server.host || "localhost");
        setPort(String(config.server.port || 25565));
        setUsername(config.server.username || "MinecraftBot");
        setVersion(config.server.version || "");
      }
    }).catch(console.error);
  }, []);

  const handleConnect = async () => {
    try {
      await connectBot({
        host,
        port: parseInt(port),
        username,
        version: version || undefined
      });
      toast.success("正在连接服务器...");
    } catch (error) {
      toast.error("连接失败");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectBot();
      toast.success("已断开连接");
    } catch (error) {
      toast.error("断开失败");
    }
  };

  const isConnected = status?.connected;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">服务器连接</span>
        <div className={`ml-auto h-2 w-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">服务器地址</label>
          <Input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="localhost"
            className="bg-muted/50 border-border text-sm"
            disabled={isConnected}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">端口</label>
          <Input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="25565"
            className="bg-muted/50 border-border text-sm"
            disabled={isConnected}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">机器人用户名</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="MinecraftBot"
            className="bg-muted/50 border-border text-sm"
            disabled={isConnected}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">游戏版本 (可选)</label>
          <Input
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="自动检测"
            className="bg-muted/50 border-border text-sm"
            disabled={isConnected}
          />
        </div>
      </div>

      <Button
        className={`w-full ${isConnected ? 'bg-redstone hover:bg-redstone/90' : 'bg-primary hover:bg-primary/90'} text-primary-foreground`}
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isConnected ? (
          <Unplug className="mr-2 h-4 w-4" />
        ) : (
          <Plug className="mr-2 h-4 w-4" />
        )}
        {isConnected ? "断开连接" : "连接服务器"}
      </Button>

      {isConnected && status && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>服务器: {status.serverAddress}</p>
          <p>版本: {status.version}</p>
          <p>在线玩家: {status.players?.length || 0}</p>
        </div>
      )}
    </div>
  );
}
