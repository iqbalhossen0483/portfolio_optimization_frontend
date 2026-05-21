"use client";

import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { SendHorizonal, Square } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface ChatInputProps {
  isStreaming: boolean;
  onSubmit: (message: string) => void;
  onStop: () => void;
  placeholder?: string;
}

export function ChatInput({
  isStreaming,
  onSubmit,
  onStop,
  placeholder = "Ask about portfolio allocation, ESG scores, or model comparisons…",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  }, [value]);

  const submit = () => {
    const msg = value.trim();
    if (!msg || isStreaming) return;
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onSubmit(msg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border border-border bg-surface-raised",
            "px-3 py-2 shadow-sm transition-shadow",
            "focus-within:ring-2 focus-within:ring-ring",
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={placeholder}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-subtle outline-none",
              "max-h-48 overflow-y-auto py-1.5 px-1",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          />
          {isStreaming ? (
            <IconButton
              icon={<Square className="w-4 h-4 text-destructive" />}
              aria-label="Stop generating"
              onClick={onStop}
              className="bg-surface border border-border"
            />
          ) : (
            <IconButton
              icon={<SendHorizonal className="w-4 h-4" />}
              aria-label="Send message"
              onClick={submit}
              disabled={!value.trim()}
              className="bg-primary text-primary-fg hover:bg-primary-hover disabled:opacity-50 hover:text-white"
            />
          )}
        </div>
        <p className="text-[10px] text-subtle text-center mt-2">
          Press Enter to send, Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
