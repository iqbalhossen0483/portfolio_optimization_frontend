"use client";

import { useAppDispatch } from "@/store/hooks";
import { setPortfolioSheetOpen } from "@/store/slices/uiSlice";
import { PieChart } from "lucide-react";

export const PORTFOLIO_PANEL_ID = "portfolio-panel";

interface PortfolioPillProps {
  jobId?: number | null;
  portfolioModel?: string | null;
}

export function PortfolioPill({ jobId, portfolioModel }: PortfolioPillProps) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      const el = document.getElementById(PORTFOLIO_PANEL_ID);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        el.animate(
          [
            { boxShadow: "0 0 0 0 rgba(56, 138, 221, 0)" },
            { boxShadow: "0 0 0 4px rgba(56, 138, 221, 0.35)" },
            { boxShadow: "0 0 0 0 rgba(56, 138, 221, 0)" },
          ],
          { duration: 900, easing: "ease-out" },
        );
      }
    } else {
      dispatch(setPortfolioSheetOpen(true));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/15 px-3 py-1.5 text-xs text-primary transition-colors cursor-pointer"
    >
      <PieChart className="w-3.5 h-3.5" />
      <span className="font-medium">View portfolio results</span>
      {portfolioModel && (
        <span className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-primary/15">
          Portfolio {portfolioModel}
        </span>
      )}
      {jobId != null && (
        <span className="text-[10px] font-mono text-primary/70">#{jobId}</span>
      )}
    </button>
  );
}
