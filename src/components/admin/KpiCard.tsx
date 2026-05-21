"use client";

import { cn } from "@/lib/cn";
import type { TimeSeriesBucket } from "@/types/api";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  /** Optional 8-week series; used for sparkline + week-over-week delta. */
  series?: TimeSeriesBucket[];
  /** Override the auto-computed delta (e.g. "+12%" or "Live"). */
  badge?: React.ReactNode;
}

function formatValue(value: number | string): string {
  if (typeof value === "string") return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function computeDelta(series: TimeSeriesBucket[]): {
  arrow: "up" | "down" | "flat";
  text: string;
} {
  if (series.length < 2) return { arrow: "flat", text: "—" };
  const last = series[series.length - 1].count;
  const prev = series[series.length - 2].count;
  if (last === prev) return { arrow: "flat", text: "no change" };
  const diff = last - prev;
  if (prev === 0) return { arrow: "up", text: `+${diff} this week` };
  const pct = Math.round((diff / prev) * 100);
  return {
    arrow: diff > 0 ? "up" : "down",
    text: `${diff > 0 ? "+" : ""}${pct}% wow`,
  };
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  series,
  badge,
}: KpiCardProps) {
  const delta = series ? computeDelta(series) : null;
  const arrowIcon =
    delta?.arrow === "up"
      ? ArrowUpRight
      : delta?.arrow === "down"
        ? ArrowDownRight
        : Minus;
  const ArrowIcon = arrowIcon;

  return (
    <div className="relative rounded-xl border border-border bg-surface p-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground tracking-tight">
          {formatValue(value)}
        </span>
        {badge ? (
          <span className="text-xs text-muted">{badge}</span>
        ) : delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs",
              delta.arrow === "up" && "text-success",
              delta.arrow === "down" && "text-destructive",
              delta.arrow === "flat" && "text-subtle",
            )}
          >
            <ArrowIcon className="w-3 h-3" />
            {delta.text}
          </span>
        ) : null}
      </div>

      {series && series.length > 0 && (
        <div className="h-12 mt-2 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient
                  id={`kpi-${label.replace(/\s+/g, "-").toLowerCase()}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-primary)"
                strokeWidth={1.5}
                fill={`url(#kpi-${label.replace(/\s+/g, "-").toLowerCase()})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
