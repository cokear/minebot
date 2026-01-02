import { Key, RefreshCw, Save, Server, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function CredentialsPanel() {
  const [panelUrl, setPanelUrl] = useState("");
  const [id, setId] = useState("");
  const [path, setPath] = useState("/");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveCredentials({ panelUrl, id, path, apiKey });
      toast.success('凭据已保存');
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // This would trigger a file sync operation
      toast.success('同步成功');
    } catch (error) {
      toast.error('同步失败');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Panel URL */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Server className="h-3 w-3" />
          面板 URL
        </label>
        <Input
          value={panelUrl}
          onChange={(e) => setPanelUrl(e.target.value)}
          placeholder="https://panel.example.com"
          className="bg-muted/50 border-border font-mono text-sm"
        />
      </div>

      {/* ID and Path */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">ID</label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="server-id"
            className="bg-muted/50 border-border text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">/</label>
          <Input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="path"
            className="bg-muted/50 border-border text-sm"
          />
        </div>
      </div>

      {/* API Key */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Key className="h-3 w-3" />
          Key
        </label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API Key"
          className="bg-muted/50 border-border font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          variant="outline"
          className="border-border hover:bg-secondary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          存凭据
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          同步文件
        </Button>
      </div>
    </div>
  );
}
