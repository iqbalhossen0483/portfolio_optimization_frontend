"use client";

import { AlertDialog } from "@/components/ui/AlertDialog";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tooltip } from "@/components/ui/Tooltip";
import { Typography } from "@/components/ui/Typography";
import {
  useGetTrainingStatusQuery,
  useStopTrainingMutation,
} from "@/store/api";
import type { TrainingStatus } from "@/types/api";
import { StopCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusToBadgeVariant: Record<TrainingStatus, BadgeVariant> = {
  queued: "default",
  running: "running",
  completed: "success",
  failed: "error",
  stopped: "warning",
};

interface JobRowProps {
  jobId: number;
}

export function JobRow({ jobId }: JobRowProps) {
  const [showStop, setShowStop] = useState(false);
  const { data: res } = useGetTrainingStatusQuery(jobId, {
    pollingInterval: 10_000,
    skip: !jobId,
  });
  const [stopTraining, { isLoading: stopping }] = useStopTrainingMutation();

  const handleStop = async () => {
    await stopTraining(jobId);
    setShowStop(false);
  };

  if (!res) return null;

  const data = res.data;

  return (
    <>
      <tr className="border-t border-border hover:bg-surface-raised/50 transition-colors">
        <td className="px-4 py-3">
          <Typography variant="mono" as="span">
            #{data.job_id}
          </Typography>
        </td>
        <td className="px-4 py-3">
          <Badge variant={statusToBadgeVariant[data.status]}>
            {data.status}
          </Badge>
        </td>
        <td className="px-4 py-3 w-40">
          <ProgressBar value={data.progress_pct} showPercent />
        </td>
        <td className="px-4 py-3 text-sm text-muted">
          {data.best_sharpe !== null ? data.best_sharpe.toFixed(4) : "—"}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/training/${jobId}`}
              className="text-xs text-primary hover:underline"
            >
              View Monitor
            </Link>
            {data.status === "running" && (
              <Tooltip content="Stop training">
                <IconButton
                  icon={<StopCircle className="w-4 h-4" />}
                  aria-label="Stop training"
                  variant="danger"
                  size="sm"
                  onClick={() => setShowStop(true)}
                />
              </Tooltip>
            )}
          </div>
        </td>
      </tr>
      <AlertDialog
        open={showStop}
        onClose={() => setShowStop(false)}
        title="Stop training?"
        description={`This will stop job #${jobId}. Progress cannot be recovered.`}
        confirmLabel="Stop"
        variant="danger"
        onConfirm={handleStop}
        loading={stopping}
      />
    </>
  );
}
