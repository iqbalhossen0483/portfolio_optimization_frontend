"use client";

import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import type { RecentJobInfo, TrainingStatus } from "@/types/api";
import { Activity } from "lucide-react";
import Link from "next/link";

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const STATUS_TINT: Record<TrainingStatus, string> = {
  queued: "text-status-queued",
  running: "text-status-running",
  completed: "text-status-completed",
  failed: "text-status-failed",
  stopped: "text-status-stopped",
};

interface RecentJobsCardProps {
  jobs: RecentJobInfo[];
}

export function RecentJobsCard({ jobs }: RecentJobsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Recent training
          </h2>
          <p className="text-xs text-muted">Last 5 training jobs</p>
        </div>
        <Link
          href="/admin/training"
          className="text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-32 gap-2">
          <Activity className="w-5 h-5 text-subtle" />
          <p className="text-sm text-subtle">No training jobs yet</p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {jobs.map((job, i) => (
            <li
              key={job.id}
              className={cn(
                "flex items-center gap-3 py-2.5",
                i !== jobs.length - 1 && "border-b border-border",
              )}
            >
              <Link
                href={`/admin/training/${job.id}`}
                className="flex items-center gap-3 w-full hover:bg-surface-raised -mx-2 px-2 py-1 rounded-md transition-colors"
              >
                <span className="font-mono text-xs text-subtle w-10 shrink-0">
                  #{job.id}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium capitalize w-20 shrink-0",
                    STATUS_TINT[job.status],
                  )}
                >
                  {job.status}
                </span>
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <Badge variant="default">Portfolio {job.portfolio_model}</Badge>
                  <Chip label={job.topology} />
                </div>
                <span className="text-xs text-muted shrink-0">
                  {timeAgo(job.created_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
