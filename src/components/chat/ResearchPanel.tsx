"use client";

import { useState } from "react";
import { TrendingUp, Leaf, ChevronDown } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/cn";

const agentMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  market_intelligence: {
    icon: <TrendingUp className="w-4 h-4" />,
    label: "Market research in progress…",
  },
  esg_research: {
    icon: <Leaf className="w-4 h-4" />,
    label: "ESG research in progress…",
  },
};

export function ResearchPanel() {
  const { researchChunks, researchPanelAgent, isStreaming } = useAppSelector(
    (s) => s.chat,
  );
  const [collapsed, setCollapsed] = useState(false);

  if (!researchChunks) return null;

  const meta = researchPanelAgent
    ? agentMeta[researchPanelAgent]
    : agentMeta["market_intelligence"];

  return (
    <div className="border-b border-border bg-surface">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          {meta?.icon}
          {isStreaming ? meta?.label : "Research"}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            collapsed && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          collapsed ? "max-h-0" : "max-h-96",
        )}
      >
        <div className="px-4 pb-3 overflow-y-auto max-h-80">
          <MarkdownRenderer content={researchChunks} />
        </div>
      </div>
    </div>
  );
}
