import { Bot, Github, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 glow-emerald">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">MC Bot Framework</h1>
            <p className="text-xs text-muted-foreground">mineflayer + AI 通用框架</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#control" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            控制面板
          </a>
          <a href="#architecture" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            架构
          </a>
          <a href="#structure" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            结构
          </a>
          <a href="#commands" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            指令
          </a>
          <a href="#directions" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            方向
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-border bg-background transition-all duration-300 md:hidden",
          mobileMenuOpen ? "max-h-64" : "max-h-0 border-b-0"
        )}
      >
        <nav className="flex flex-col gap-2 px-4 py-4">
          <a href="#control" className="rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary">
            控制面板
          </a>
          <a href="#architecture" className="rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary">
            架构
          </a>
          <a href="#structure" className="rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary">
            结构
          </a>
          <a href="#commands" className="rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary">
            指令
          </a>
          <a href="#directions" className="rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary">
            方向
          </a>
        </nav>
      </div>
    </header>
  );
}
