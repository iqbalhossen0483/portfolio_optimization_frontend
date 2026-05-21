"use client";

import type { TimeSeriesBucket } from "@/types/api";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UserGrowthChartProps {
  data: TimeSeriesBucket[];
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const total = data.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">User growth</h2>
          <p className="text-xs text-muted">Last 8 weeks of new signups</p>
        </div>
        <span className="text-xs font-medium text-muted">
          {total} new {total === 1 ? "user" : "users"}
        </span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="user-growth-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="week_start"
              tickFormatter={formatWeekLabel}
              stroke="var(--color-subtle)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              stroke="var(--color-subtle)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ stroke: "var(--color-border-strong)", strokeWidth: 1 }}
              contentStyle={{
                background: "var(--color-surface-raised)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--color-foreground)",
              }}
              labelFormatter={(label) =>
                `Week of ${formatWeekLabel(label as string)}`
              }
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#user-growth-fill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
