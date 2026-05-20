"use client";

import { useAppSelector } from "@/store/hooks";
import { MetricCell } from "./MetricCell";
import type { TrainingMetric } from "@/types/store";

interface MetricsGridProps {
  jobId: number;
}

export function MetricsGrid({ jobId }: MetricsGridProps) {
  const metrics = useAppSelector(
    (s) => (s.training as { liveMetrics: Record<number, TrainingMetric> }).liveMetrics[jobId],
  );

  const cells = [
    { label: "Step", value: metrics?.step ?? null },
    { label: "Entropy", value: metrics?.entropy?.toFixed(4) ?? null },
    { label: "Entropy Std", value: metrics?.entropy_rolling_std?.toFixed(4) ?? null },
    { label: "Bloomberg Reward", value: metrics?.reward_bloomberg?.toFixed(4) ?? null },
    { label: "LESG Reward", value: metrics?.reward_lesg?.toFixed(4) ?? null },
    { label: "Financial Reward", value: metrics?.reward_financial?.toFixed(4) ?? null },
    { label: "Actor Loss", value: metrics?.loss_actor?.toFixed(6) ?? null },
    { label: "Critic Loss", value: metrics?.loss_critic?.toFixed(6) ?? null },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
      {cells.map((c) => (
        <MetricCell key={c.label} label={c.label} value={c.value} />
      ))}
    </div>
  );
}
