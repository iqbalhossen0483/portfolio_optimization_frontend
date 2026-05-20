"use client";

import { useState } from "react";
import { useStopTrainingMutation } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { removeJob } from "@/store/slices/trainingSlice";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { Typography } from "@/components/ui/Typography";
import type { TrainingStatusResponse, TrainingStatus } from "@/types/api";

const statusToBadgeVariant: Record<TrainingStatus, BadgeVariant> = {
  queued: "default",
  running: "running",
  completed: "success",
  failed: "error",
  stopped: "warning",
};

interface MonitorHeaderProps {
  jobId: number;
  status: TrainingStatusResponse;
  bestSharpe: number | null;
  bestMuEsg: number | null;
}

export function MonitorHeader({
  jobId,
  status,
  bestSharpe,
  bestMuEsg,
}: MonitorHeaderProps) {
  const dispatch = useAppDispatch();
  const [showStop, setShowStop] = useState(false);
  const [stopTraining, { isLoading }] = useStopTrainingMutation();

  const handleStop = async () => {
    await stopTraining(jobId);
    dispatch(removeJob(jobId));
    setShowStop(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Typography variant="h3">Job #{jobId}</Typography>
            <Badge variant={statusToBadgeVariant[status.status]}>
              {status.status}
            </Badge>
          </div>
          {status.status === "running" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowStop(true)}
            >
              Stop Training
            </Button>
          )}
        </div>
        <ProgressBar
          value={status.progress_pct}
          label={`Step ${status.step} / ${status.max_steps}`}
          showPercent
        />
        <div className="flex gap-6 text-sm text-muted">
          <span>
            Best Sharpe:{" "}
            <strong className="text-foreground">
              {bestSharpe?.toFixed(4) ?? "—"}
            </strong>
          </span>
          <span>
            Best μESG:{" "}
            <strong className="text-esg">{bestMuEsg?.toFixed(4) ?? "—"}</strong>
          </span>
          {status.elapsed_seconds !== null && (
            <span>
              Elapsed:{" "}
              <strong className="text-foreground">
                {Math.floor(status.elapsed_seconds / 60)}m{" "}
                {Math.floor(status.elapsed_seconds % 60)}s
              </strong>
            </span>
          )}
        </div>
      </div>
      <AlertDialog
        open={showStop}
        onClose={() => setShowStop(false)}
        title="Stop training?"
        description="This will stop the running job. Progress cannot be recovered."
        confirmLabel="Stop"
        variant="danger"
        onConfirm={handleStop}
        loading={isLoading}
      />
    </>
  );
}
