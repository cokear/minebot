import { ArrowDown, ArrowRight, Brain, Gamepad2, MessageSquare, Settings, Terminal, Zap } from "lucide-react";

export function ArchitectureDiagram() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
        <Settings className="h-5 w-5 text-primary" />
        系统架构
      </h3>
      
      <div className="flex flex-col items-center gap-4 font-mono text-sm">
        {/* Minecraft Layer */}
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="group relative flex w-full items-center justify-center gap-3 rounded-lg border border-primary/30 bg-secondary px-4 py-3 transition-all hover:border-primary hover:glow-emerald">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span className="font-medium">Minecraft</span>
            <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              玩家输入
            </span>
          </div>
          <ArrowDown className="my-2 h-5 w-5 text-muted-foreground" />
        </div>

        {/* Mineflayer Layer */}
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="group relative flex w-full items-center justify-center gap-3 rounded-lg border border-diamond/30 bg-secondary px-4 py-3 transition-all hover:border-diamond">
            <Terminal className="h-5 w-5 text-diamond" />
            <span className="font-medium">mineflayer</span>
            <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              事件监听
            </span>
          </div>
          <ArrowDown className="my-2 h-5 w-5 text-muted-foreground" />
        </div>

        {/* Command Layer */}
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="group relative flex w-full items-center justify-center gap-3 rounded-lg border border-gold/30 bg-secondary px-4 py-3 transition-all hover:border-gold">
            <MessageSquare className="h-5 w-5 text-gold" />
            <span className="font-medium">Command层</span>
            <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              指令解析
            </span>
          </div>
          <ArrowDown className="my-2 h-5 w-5 text-muted-foreground" />
        </div>

        {/* Behavior & AI Layer */}
        <div className="flex w-full max-w-md items-center justify-center gap-4">
          <div className="group flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-secondary px-4 py-3 transition-all hover:border-primary hover:glow-emerald">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium">行为层</span>
          </div>
          
          <div className="group flex flex-1 items-center justify-center gap-2 rounded-lg border border-amethyst/30 bg-secondary px-4 py-3 transition-all hover:border-amethyst">
            <Brain className="h-5 w-5 text-amethyst" />
            <span className="font-medium">AI层</span>
          </div>
        </div>

        <ArrowDown className="my-2 h-5 w-5 text-muted-foreground" />

        {/* Output Layer */}
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="group relative flex w-full items-center justify-center gap-3 rounded-lg border border-primary bg-gradient-to-r from-primary/20 to-amethyst/20 px-4 py-3 transition-all hover:glow-emerald">
            <span className="font-medium">输出层</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-muted-foreground">聊天 / 动作 / 命令</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        <span className="text-primary">mineflayer</span> 负责"看"和"动"，
        <span className="text-amethyst">AI</span> 负责"想"，中间靠
        <span className="text-gold">指令</span>粘起来
      </div>
    </div>
  );
}
