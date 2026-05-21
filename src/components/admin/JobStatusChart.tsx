"use client";

import { cn } from "@/lib/cn";
import type { JobStatusBreakdown } from "@/types/api";

interface JobStatusChartProps {
  data: JobStatusBreakdown;
}

const STATUSES: {
  key: keyof JobStatusBreakdown;
  label: string;
  cssVar: string;
}[] = [
  { key: "queued", label: "Queued", cssVar: "var(--color-status-queued)" },
  { key: "running", label: "Running", cssVar: "var(--color-status-running)" },
  {
    key: "completed",
    label: "Completed",
    cssVar: "var(--color-status-completed)",
  },
  { key: "failed", label: "Failed", cssVar: "var(--color-status-failed)" },
  { key: "stopped", label: "Stopped", cssVar: "var(--color-status-stopped)" },
];

export function JobStatusChart({ data }: JobStatusChartProps) {
  const total = STATUSES.reduce((sum, s) => sum + data[s.key], 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Training jobs
          </h2>
          <p className="text-xs text-muted">By status, across all time</p>
        </div>
        <span className="text-xs font-medium text-muted">
          {total} total
        </span>
      </div>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-32">
          <p className="text-sm text-subtle">No training jobs yet</p>
        </div>
      ) : (
        <>
          {/* Stacked bar */}
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-raised">
            {STATUSES.map((s) => {
              const v = data[s.key];
              if (v === 0) return null;
              return (
                <div
                  key={s.key}
                  style={{
                    width: `${(v / total) * 100}%`,
                    backgroundColor: s.cssVar,
                  }}
                />
              );
            })}
          </div>

          {/* Legend rows */}
          <ul className="mt-4 flex flex-col gap-2">
            {STATUSES.map((s) => {
              const v = data[s.key];
              const pct = total > 0 ? Math.round((v / total) * 100) : 0;
              return (
                <li
                  key={s.key}
                  className={cn(
                    "flex items-center justify-between text-xs",
                    v === 0 && "opacity-50",
                  )}
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: s.cssVar }}
                    />
                    {s.label}
                  </span>
                  <span className="font-mono text-muted">
                    {v}
                    <span className="text-subtle ml-1.5">({pct}%)</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
