"use client";

import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AssistantMessageProps {
  content: string;
  streaming?: boolean;
  footer?: React.ReactNode;
}

export function AssistantMessage({
  content,
  streaming,
  footer,
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/25 text-primary mt-0.5">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm text-foreground",
            streaming &&
              "after:content-['▊'] after:animate-pulse after:text-primary after:ml-0.5",
          )}
        >
          {content ? (
            <MarkdownRenderer content={content} />
          ) : streaming ? (
            <span className="text-muted">Thinking…</span>
          ) : null}
        </div>
        {footer && <div className="mt-3">{footer}</div>}
        {!streaming && content && (
          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconButton
              icon={
                copied ? (
                  <Check className="w-3 h-3 text-success" />
                ) : (
                  <Copy className="w-3 h-3" />
                )
              }
              aria-label="Copy message"
              size="sm"
              onClick={handleCopy}
            />
          </div>
        )}
      </div>
    </div>
  );
}
