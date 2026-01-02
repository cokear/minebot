import { useState, useEffect } from "react";
import { Brain, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function AIConfigPanel() {
  const [apiKey, setApiKey] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getConfig().then(config => {
      if (config.ai) {
        setBaseURL(config.ai.baseURL || "");
        setModel(config.ai.model || "gpt-3.5-turbo");
        setSystemPrompt(config.ai.systemPrompt || "");
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateConfig({
        ai: {
          enabled: true,
          apiKey: apiKey || undefined,
          baseURL,
          model,
          systemPrompt
        }
      });
      toast.success("AI 配置已保存");
      setApiKey(""); // Clear API key after saving
    } catch (error) {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">AI 配置</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">API Key</label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-... (留空则使用已保存的)"
            className="bg-muted/50 border-border font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">API Base URL (可选)</label>
          <Input
            value={baseURL}
            onChange={(e) => setBaseURL(e.target.value)}
            placeholder="https://api.openai.com/v1"
            className="bg-muted/50 border-border text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">模型</label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-3.5-turbo"
            className="bg-muted/50 border-border text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">系统提示词 (可选)</label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="你是一个 Minecraft 服务器中的友好机器人助手..."
            className="bg-muted/50 border-border text-sm min-h-[80px]"
          />
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          保存 AI 配置
        </Button>
      </div>
    </div>
  );
}
