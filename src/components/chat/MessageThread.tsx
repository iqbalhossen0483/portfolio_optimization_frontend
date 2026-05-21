"use client";

import { IconButton } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppSelector } from "@/store/hooks";
import type { ChatMessageInfo } from "@/types/api";
import { ArrowDown } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { AgentTrace } from "./AgentTrace";
import { AssistantMessage } from "./AssistantMessage";
import { PortfolioPill } from "./PortfolioPill";
import { UserMessage } from "./UserMessage";

interface MessageThreadProps {
  messages: ChatMessageInfo[];
  advisorChunks: string;
  isStreaming: boolean;
  isLoadingHistory?: boolean;
}

export function MessageThread({
  messages,
  advisorChunks,
  isStreaming,
  isLoadingHistory,
}: MessageThreadProps) {
  const agentSteps = useAppSelector((s) => s.chat.agentSteps);
  const portfolioResult = useAppSelector((s) => s.chat.portfolioResult);
  const pendingUserMessage = useAppSelector((s) => s.chat.pendingUserMessage);

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
      container.scrollTop >=
      container.scrollHeight - container.clientHeight - 100;
    if (atBottom) scrollToBottom();
  }, [messages, advisorChunks, agentSteps.length, pendingUserMessage]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const atBottom =
      container.scrollTop >=
      container.scrollHeight - container.clientHeight - 100;
    setShowScrollDown(!atBottom);
  };

  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  // Suppress the optimistic pending user message once the refetched history
  // already contains it (last user message matches by content).
  const lastPersistedUserContent = [...messages]
    .reverse()
    .find((m) => m.role === "user")?.content;
  const showPendingUser =
    !!pendingUserMessage && pendingUserMessage !== lastPersistedUserContent;

  const showHistorySkeleton =
    !!isLoadingHistory && messages.length === 0 && !isStreaming;

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto"
      >
        <div className="mx-auto w-full max-w-3xl px-4 py-6 flex flex-col gap-6">
          {showHistorySkeleton ? (
            <Skeleton count={4} className="h-12 mb-3" />
          ) : (
            <>
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return <UserMessage key={msg.id} content={msg.content} />;
                }
                const isLast = msg.id === lastAssistantId;
                const attachTrace =
                  isLast && !isStreaming && agentSteps.length > 0;
                return (
                  <Fragment key={msg.id}>
                    {attachTrace && (
                      <AgentTrace steps={agentSteps} isStreaming={false} />
                    )}
                    <AssistantMessage
                      content={msg.content}
                      footer={
                        isLast && portfolioResult ? (
                          <PortfolioPill
                            jobId={portfolioResult.job_id}
                            portfolioModel={portfolioResult.portfolio_model}
                          />
                        ) : null
                      }
                    />
                  </Fragment>
                );
              })}

              {showPendingUser && <UserMessage content={pendingUserMessage} />}

              {isStreaming && (
                <>
                  <AgentTrace steps={agentSteps} isStreaming />
                  <AssistantMessage content={advisorChunks} streaming />
                </>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>
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
