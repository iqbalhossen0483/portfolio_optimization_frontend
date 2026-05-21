"use client";

import { useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  appendAdvisorChunk,
  appendAgentStep,
  finishStream,
  streamError,
  stopStreaming,
} from "@/store/slices/chatSlice";
import { api } from "@/store/api";
import type { StreamEvent } from "@/types/stream";

export function useStreamingChat() {
  const dispatch = useAppDispatch();
  const abortRef = useRef<AbortController | null>(null);

  const stream = async (
    message: string,
    sessionId: string,
    accessToken: string,
  ) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ message, session_id: sessionId }),
          signal: abortRef.current.signal,
        },
      );

      if (!res.ok || !res.body) {
        dispatch(streamError(`HTTP ${res.status}`));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const block of lines) {
          const dataLine = block
            .split("\n")
            .find((l) => l.startsWith("data: "));
          if (!dataLine) continue;
          try {
            const event: StreamEvent = JSON.parse(dataLine.slice(6));
            if (event.type === "status") {
              dispatch(
                appendAgentStep({
                  agent: event.agent,
                  tool: event.tool ?? null,
                  label: event.label,
                  at: Date.now(),
                }),
              );
            } else if (event.type === "text_chunk") {
              if (event.agent === "portfolio_advisor") {
                dispatch(appendAdvisorChunk(event.content));
              }
              // Sub-agent text chunks are surfaced via the agent trace (status
              // events from those agents), not as standalone prose — so we drop
              // their text_chunk payloads here.
            } else if (event.type === "done") {
              dispatch(
                finishStream({
                  response: event.response,
                  portfolioResult: event.portfolio_result,
                }),
              );
              dispatch(api.util.invalidateTags(["Chat"]));
            } else if (event.type === "error") {
              dispatch(streamError(event.message));
            }
          } catch {
            /* malformed chunk — skip */
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      dispatch(streamError("Connection error"));
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    dispatch(stopStreaming());
  };

  return { stream, stop };
}
