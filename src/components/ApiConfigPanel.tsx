import { ChevronDown, Download, Settings, Save, TestTube, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function ApiConfigPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [method, setMethod] = useState<"GET" | "POST">("GET");
  const [autoRead, setAutoRead] = useState(false);
  const [url, setUrl] = useState("");
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateConfig({
        autoRenew: {
          enabled: autoRead,
          url,
          method,
          headers: headerKey ? { [headerKey]: headerValue } : {},
          body,
          interval: 300000
        }
      });
      toast.success('配置已保存');
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">高级自动读取</span>
          <span className="text-xs text-muted-foreground">(DOM扫描+网络监听)</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "GET" | "POST")}
            className="rounded border border-border bg-secondary px-2 py-1 text-xs font-medium"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          <Switch checked={autoRead} onCheckedChange={setAutoRead} />
        </div>
      </div>

      {/* URL Input */}
      <div className="p-4 space-y-3">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="续期接口 URL（可自动检测）"
          className="bg-muted/50 border-border font-mono text-sm"
        />

        {/* Expandable Config Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">基础请求配置 ›</span>
          </button>

          <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm transition-colors hover:bg-secondary">
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">高级抓取配置 ›</span>
          </button>
        </div>

        {/* Primary Action */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          保存设置并测试
        </Button>
      </div>

      {/* Expanded Config */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/20 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Header Key"
              className="bg-muted/50 text-sm"
              value={headerKey}
              onChange={(e) => setHeaderKey(e.target.value)}
            />
            <Input
              placeholder="Header Value"
              className="bg-muted/50 text-sm"
              value={headerValue}
              onChange={(e) => setHeaderValue(e.target.value)}
            />
          </div>
          <Input
            placeholder="Request Body (JSON)"
            className="bg-muted/50 text-sm font-mono"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
