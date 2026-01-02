import { Settings } from "lucide-react";
import { ApiConfigPanel } from "./ApiConfigPanel";
import { ModeToggles } from "./ModeToggles";
import { TimerControls } from "./TimerControls";
import { CredentialsPanel } from "./CredentialsPanel";
import { ConsoleLog } from "./ConsoleLog";
import { BotConnectionPanel } from "./BotConnectionPanel";
import { AIConfigPanel } from "./AIConfigPanel";

export function ControlPanel() {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-6">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
        <Settings className="h-5 w-5 text-primary" />
        机器人控制面板
      </h3>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          <BotConnectionPanel />
          <AIConfigPanel />
          <ModeToggles />
          <TimerControls />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <ApiConfigPanel />
          <CredentialsPanel />
          <ConsoleLog />
        </div>
      </div>
    </div>
  );
}
