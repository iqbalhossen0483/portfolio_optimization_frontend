"use client";

import { cn } from "@/lib/cn";
import { Coins, GitCompareArrows, Network, ScatterChart } from "lucide-react";

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const SUGGESTIONS: {
  icon: React.ElementType;
  title: string;
  prompt: string;
}[] = [
  {
    icon: Coins,
    title: "Allocate $1M across ESG-rated equities",
    prompt:
      "I have $1,000,000 to allocate. Use Portfolio C and show me the allocation across ESG-rated equities.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare Portfolio A, B, and C side-by-side",
    prompt:
      "Compare Portfolios A, B, and C side-by-side. What are the differences in objectives and which one suits a moderate risk profile?",
  },
  {
    icon: Network,
    title: "Explain cooperative vs competitive topologies",
    prompt:
      "Explain the differences between cooperative, competitive, and mixed topologies in MADRL.",
  },
  {
    icon: ScatterChart,
    title: "Show assets with highest ESG disagreement",
    prompt:
      "Show me the assets with the highest ESG disagreement (ΔESG) and explain what that means for allocation.",
  },
];

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
      {SUGGESTIONS.map(({ icon: Icon, title, prompt }) => (
        <button
          key={title}
          type="button"
          onClick={() => onSelect(prompt)}
          className={cn(
            "group flex items-start gap-3 text-left rounded-xl border border-border bg-surface",
            "px-4 py-3 transition-all duration-200",
            "hover:border-primary/40 hover:bg-surface-raised hover:-translate-y-px hover:shadow-md",
          )}
        >
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/15">
            <Icon className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm text-foreground leading-snug">{title}</span>
        </button>
      ))}
    </div>
  );
}
