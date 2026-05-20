"use client";

import { useState } from "react";
import { GitMerge, Swords, Blend, Info } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Tooltip } from "@/components/ui/Tooltip";
import { TopologyTable } from "./TopologyTable";

const topologyTabs = [
  { id: "cooperative", label: "Cooperative", icon: <GitMerge className="w-3 h-3" /> },
  { id: "competitive", label: "Competitive", icon: <Swords className="w-3 h-3" /> },
  { id: "mixed", label: "Mixed", icon: <Blend className="w-3 h-3" /> },
];

export function PortfolioPanel() {
  const { portfolioResult } = useAppSelector((s) => s.chat);
  const [activeTab, setActiveTab] = useState("cooperative");

  if (!portfolioResult) return null;

  const panelKey = Object.keys(portfolioResult.panels).find((k) =>
    k.toLowerCase().includes(activeTab),
  );
  const assets = panelKey ? portfolioResult.panels[panelKey] : [];

  const availableTabs = topologyTabs.filter((t) =>
    Object.keys(portfolioResult.panels).some((k) =>
      k.toLowerCase().includes(t.id),
    ),
  );

  return (
    <div className="flex flex-col h-full border-l border-border bg-surface w-full lg:w-[420px] shrink-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Badge variant="admin">Model {portfolioResult.portfolio_model}</Badge>
        <Chip label={`Job #${portfolioResult.job_id}`} />
        <Tooltip content="Portfolio topology results from the MADRL system">
          <Info className="w-4 h-4 text-muted cursor-help" />
        </Tooltip>
      </div>
      <Tabs
        tabs={availableTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="px-4 pt-2"
      />
      <div className="flex-1 overflow-y-auto p-4">
        {assets.length > 0 ? (
          <TopologyTable assets={assets} />
        ) : (
          <p className="text-sm text-muted text-center pt-8">
            No data for this topology
          </p>
        )}
      </div>
    </div>
  );
}
