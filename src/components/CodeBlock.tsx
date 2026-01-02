import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  title?: string;
  code: string;
  language?: string;
}

export function CodeBlock({ title, code, language = "javascript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-obsidian">
      {title && (
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
          <span className="font-mono text-sm text-muted-foreground">{title}</span>
          <button
            onClick={handleCopy}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4">
        <code className={cn("font-mono text-sm leading-relaxed", `language-${language}`)}>
          {code}
        </code>
      </pre>
    </div>
  );
}
