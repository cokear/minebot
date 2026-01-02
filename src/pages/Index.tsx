import { Bot, Brain, Building, Footprints, GraduationCap, HelpCircle, MapPin, MessageSquare, Move, Users, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { FileTree } from "@/components/FileTree";
import { CommandCard } from "@/components/CommandCard";
import { BotTypeCard } from "@/components/BotTypeCard";
import { CodeBlock } from "@/components/CodeBlock";
import { ControlPanel } from "@/components/ControlPanel";
import { useWebSocket } from "@/hooks/useBot";

const summaryCode = `mineflayer 是身体
Node.js 是神经
AI 是大脑
指令是语言`;

const Index = () => {
  const { status, connected } = useWebSocket();

  const botStatus = status?.connected ? "online" : "offline";
  const commandStatus = connected ? "online" : "offline";
  const aiStatus = "warning";
  const behaviorStatus = status?.connected ? "online" : "offline";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15),_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              mineflayer + AI 通用框架
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              MC 机器人
              <span className="block text-glow text-primary">通用框架</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              像玩家一样进服 → 听话 → 会动 → 可接 AI → 可扩展成教学 / NPC / 管理机器人
            </p>
          </div>
        </div>
      </section>

      {/* Status Cards */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatusCard
              title="Bot 状态"
              value={status?.connected ? "在线" : "离线"}
              icon={Bot}
              status={botStatus}
              description={status?.serverAddress || "未连接服务器"}
            />
            <StatusCard
              title="指令系统"
              value={connected ? "就绪" : "离线"}
              icon={MessageSquare}
              status={commandStatus}
              description="6 个指令可用"
            />
            <StatusCard
              title="AI 模块"
              value="可扩展"
              icon={Brain}
              status={aiStatus}
              description="待接入模型"
            />
            <StatusCard
              title="行为层"
              value={status?.connected ? "活跃" : "待机"}
              icon={Footprints}
              status={behaviorStatus}
              description="移动/挖矿/观察"
            />
          </div>
        </div>
      </section>

      {/* Control Panel Section */}
      <section id="control" className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ControlPanel />
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">整体架构</h2>
            <p className="mt-2 text-muted-foreground">先看这个，理解系统如何工作</p>
          </div>
          <ArchitectureDiagram />
        </div>
      </section>

      {/* File Structure Section */}
      <section id="structure" className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">推荐文件结构</h2>
            <p className="mt-2 text-muted-foreground">非常重要的组织方式</p>
          </div>
          <FileTree />
        </div>
      </section>

      {/* Commands Section */}
      <section id="commands" className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">指令系统</h2>
            <p className="mt-2 text-muted-foreground">你最常改的地方，以后加指令 = 加文件</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CommandCard
              command="!help"
              description="显示帮助信息和可用指令列表"
              icon={HelpCircle}
              category="utility"
            />
            <CommandCard
              command="!come"
              description="让机器人跟随你移动"
              icon={Move}
              category="movement"
            />
            <CommandCard
              command="!ask [问题]"
              description="向 AI 提问，获取智能回答"
              icon={Brain}
              category="ai"
            />
          </div>
        </div>
      </section>

      {/* Bot Types / Directions Section */}
      <section id="directions" className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">可扩展方向</h2>
            <p className="mt-2 text-muted-foreground">你现在可以"只想不写"的几个方向</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BotTypeCard
              title="教学型 NPC"
              icon={GraduationCap}
              color="emerald"
              features={[
                "固定地点",
                "!ask 只回答课程相关",
                "有「今天主题」",
              ]}
            />
            <BotTypeCard
              title="世界角色"
              icon={Users}
              color="amethyst"
              features={[
                "有名字 / 性格",
                "会记住学生",
                "不同机器人不同学科",
              ]}
            />
            <BotTypeCard
              title="展览讲解员"
              icon={Building}
              color="diamond"
              features={[
                "站在建筑旁",
                "走近触发讲解",
                "AI + 区域感知",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">一句话总结</h2>
          </div>
          <div className="mx-auto max-w-xl">
            <CodeBlock title="框架本质" code={summaryCode} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>MC Bot Framework — 让 Minecraft 机器人更智能</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
