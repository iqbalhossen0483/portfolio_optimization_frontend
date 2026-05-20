"use client";

import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Chip } from "@/components/ui/Chip";

export function StatusBar() {
  const { isStreaming, statusLabel, statusTool } = useAppSelector(
    (s) => s.chat,
  );

  if (!isStreaming) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-surface border-b border-border text-sm text-muted">
      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      <span>{statusLabel ?? "Processing…"}</span>
      {statusTool && <Chip label={statusTool} />}
    </div>
  );
}
