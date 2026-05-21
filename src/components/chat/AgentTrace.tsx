"use client";

import { cn } from "@/lib/cn";
import type { AgentStep } from "@/store/slices/chatSlice";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Leaf,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface AgentTraceProps {
  steps: AgentStep[];
  isStreaming: boolean;
}

const AGENT_META: Record<
  string,
  { label: string; icon: React.ElementType; tint: string }
> = {
  portfolio_advisor: {
    label: "Portfolio Advisor",
    icon: Sparkles,
    tint: "text-primary",
  },
  market_intelligence: {
    label: "Market Intelligence",
    icon: TrendingUp,
    tint: "text-warning",
  },
  esg_research: {
    label: "ESG Research",
    icon: Leaf,
    tint: "text-success",
  },
};

function getMeta(agent: string) {
  return (
    AGENT_META[agent] ?? {
      label: agent,
      icon: Activity,
      tint: "text-muted",
    }
  );
}

export function AgentTrace({ steps, isStreaming }: AgentTraceProps) {
  const [userOpen, setUserOpen] = useState(false);
  const open = isStreaming || userOpen;

  if (steps.length === 0 && !isStreaming) return null;

  const summary = isStreaming ? "Working…" : `Show steps (${steps.length})`;

  return (
    <div className="flex gap-3">
      <div className="w-7 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <button
          type="button"
          onClick={() => setUserOpen((v) => !v)}
          disabled={isStreaming}
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
            "text-muted hover:text-foreground hover:bg-surface-raised transition-colors",
          )}
        >
          {isStreaming ? (
            <Loader2 className="w-3 h-3 animate-spin text-primary" />
          ) : open ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          <span>{summary}</span>
        </button>

        {open && steps.length > 0 && (
          <ol className="mt-2 flex flex-col gap-1.5 pl-1 border-l border-border ml-1.5">
            {steps.map((step, i) => {
              const meta = getMeta(step.agent);
              const Icon = meta.icon;
              return (
                <li
                  key={`${step.at}-${i}`}
                  className="flex items-center gap-2 pl-3 text-xs"
                >
                  <Icon className={cn("w-3 h-3 shrink-0", meta.tint)} />
                  <span className="text-foreground">{meta.label}</span>
                  {step.tool && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-raised border border-border text-muted">
                      {step.tool}
                    </span>
                  )}
                  <span className="text-subtle truncate">{step.label}</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
