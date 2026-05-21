"use client";

import { Typography } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import { JobRow } from "./JobRow";

export function JobsTable() {
  const jobIds = useAppSelector((s) => s.training.jobIds);

  if (jobIds.length === 0) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <Typography variant="body">No training jobs yet.</Typography>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-surface-raised">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">
              Job ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">
              Progress
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">
              Best Sharpe
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[...jobIds].reverse().map((id) => (
            <JobRow key={id} jobId={id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
