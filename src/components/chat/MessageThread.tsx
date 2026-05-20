"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { MessageBubble, StreamingBubble } from "./MessageBubble";
import type { ChatMessageInfo } from "@/types/api";

interface MessageThreadProps {
  messages: ChatMessageInfo[];
  advisorChunks: string;
  isStreaming: boolean;
}

export function MessageThread({
  messages,
  advisorChunks,
  isStreaming,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const atBottom =
      container.scrollTop >= container.scrollHeight - container.clientHeight - 100;
    if (atBottom) scrollToBottom();
  }, [messages, advisorChunks]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const atBottom =
      container.scrollTop >= container.scrollHeight - container.clientHeight - 100;
    setShowScrollDown(!atBottom);
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-6 flex flex-col gap-4"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isStreaming && advisorChunks && (
          <StreamingBubble content={advisorChunks} />
        )}
        <div ref={bottomRef} />
      </div>

      {showScrollDown && (
        <div className="absolute bottom-4 right-4">
          <IconButton
            icon={<ArrowDown className="w-4 h-4" />}
            aria-label="Scroll to bottom"
            onClick={scrollToBottom}
            className="bg-surface-raised border border-border shadow-md"
          />
        </div>
      )}
    </div>
  );
}
