"use client";

import { Typography } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import type { LogEntry } from "@/types/store";
import { useEffect, useRef } from "react";

interface EventLogProps {
  jobId: number;
}

export function EventLog({ jobId }: EventLogProps) {
  const logs = useAppSelector(
    (s) =>
      (s.training as { eventLogs: Record<number, LogEntry[]> }).eventLogs[
        jobId
      ] ?? ([] as LogEntry[]),
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="border-t border-border">
      <div className="px-6 py-3 border-b border-border">
        <Typography variant="label">Event Log</Typography>
      </div>
      <div className="overflow-y-auto max-h-72 px-6 py-3 flex flex-col gap-1.5 font-mono text-xs">
        {logs.map((entry, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-subtle shrink-0">
              {entry.timestamp.split(" ")[1]?.slice(0, 8)}
            </span>
            <span className="text-muted">{entry.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <span className="text-subtle">Waiting for events…</span>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
