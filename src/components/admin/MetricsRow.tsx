"use client";

import {
  Database,
  Activity,
  Users,
  BarChart2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useGetDashboardQuery } from "@/store/api";
import { StatCard } from "./StatCard";
import { Badge } from "@/components/ui/Badge";

const skeletonCards = Array.from({ length: 5 });

export function MetricsRow() {
  const { data, isLoading } = useGetDashboardQuery(undefined, {
    pollingInterval: 15_000,
  });

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {skeletonCards.map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-surface border border-border p-4 animate-pulse"
          >
            <div className="h-4 bg-surface-raised rounded w-24 mb-3" />
            <div className="h-8 bg-surface-raised rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        label="Total Assets"
        value={data?.assets_count ?? 0}
        icon={<Database className="w-4 h-4" />}
      />
      <StatCard
        label="Training Jobs"
        value={data?.jobs_count ?? 0}
        icon={<Activity className="w-4 h-4" />}
      />
      <StatCard
        label="Users"
        value={data?.users_count ?? 0}
        icon={<Users className="w-4 h-4" />}
      />
      <StatCard
        label="Market Data Rows"
        value={(data?.market_data_count ?? 0).toLocaleString()}
        icon={<BarChart2 className="w-4 h-4" />}
      />
      <StatCard
        label="Training"
        value={data?.training_running ? "Running" : "Idle"}
        highlight={data?.training_running}
        icon={
          data?.training_running ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )
        }
        badge={
          data?.training_running ? (
            <Badge variant="running">active</Badge>
          ) : (
            <Badge variant="success">idle</Badge>
          )
        }
      />
    </div>
  );
}
