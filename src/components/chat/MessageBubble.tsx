"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/cn";
import type { ChatMessageInfo } from "@/types/api";

interface MessageBubbleProps {
  message: ChatMessageInfo;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-surface-raised rounded-xl px-4 py-2 max-w-[70%] text-sm text-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start group">
      <div className="max-w-[85%] relative">
        <MarkdownRenderer content={message.content} />
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </div>
    </div>
  );
}

interface StreamingBubbleProps {
  content: string;
}

export function StreamingBubble({ content }: StreamingBubbleProps) {
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[85%] text-sm text-foreground prose-chat",
          "after:content-['▊'] after:animate-pulse after:text-primary",
        )}
      >
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
