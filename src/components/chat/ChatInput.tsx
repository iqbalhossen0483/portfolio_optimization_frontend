"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { SendHorizonal, Square } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

interface ChatInputProps {
  isStreaming: boolean;
  onSubmit: (message: string) => void;
  onStop: () => void;
}

export function ChatInput({ isStreaming, onSubmit, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const msg = value.trim();
    if (!msg || isStreaming) return;
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    onSubmit(msg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  };

  return (
    <div className="border-t border-border bg-surface px-4 py-3">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={isStreaming}
          placeholder="Ask about portfolio allocation, ESG scores, or model comparisons…"
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border border-border bg-surface-raised px-4 py-2.5 text-sm text-foreground placeholder:text-subtle",
            "max-h-48 overflow-y-auto transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        />
        {isStreaming ? (
          <IconButton
            icon={<Square className="w-4 h-4 text-destructive" />}
            aria-label="Stop generating"
            onClick={onStop}
            className="mb-0.5 bg-surface-raised border border-border"
          />
        ) : (
          <IconButton
            icon={<SendHorizonal className="w-4 h-4" />}
            aria-label="Send message"
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="mb-0.5 bg-primary text-primary-fg hover:bg-primary-hover disabled:opacity-50"
          />
        )}
      </div>
    </div>
  );
}
