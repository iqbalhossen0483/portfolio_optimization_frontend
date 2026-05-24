"use client";

import { AlertDialog } from "@/components/ui/AlertDialog";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Typography } from "@/components/ui/Typography";
import { useStopTrainingMutation } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeJob } from "@/store/slices/trainingSlice";
import type {
  TrainingStage,
  TrainingStatus,
  TrainingStatusResponse,
} from "@/types/api";
import { useState } from "react";

const statusToBadgeVariant: Record<TrainingStatus, BadgeVariant> = {
  queued: "default",
  running: "running",
  completed: "success",
  failed: "error",
  stopped: "warning",
};

const STAGE_LABELS: Record<TrainingStage, string> = {
  stage1_ingestion: "Ingesting data",
  stage2_esg_normalization: "Normalising ESG",
  stage3_normalizer_fit: "Fitting scaler",
  stage4_training: "Training MASAC",
  completed: "Complete",
  failed: "Failed",
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
  const liveMetric = useAppSelector((s) => s.training.liveMetrics[jobId]);
  const [showStop, setShowStop] = useState(false);
  const [stopTraining, { isLoading }] = useStopTrainingMutation();

  // Prefer the live WS metric over the polled status — current_step,
  // best_sharpe and best_mu_esg in the DB only update between topologies,
  // so without this the header would stay at "Step 0 — — — —" for the
  // entire first topology run.
  const displayStep = liveMetric?.step ?? status.step;
  const displayPct = Math.min(100, (displayStep / status.max_steps) * 100);
  const displayBestSharpe = liveMetric?.best_sharpe ?? bestSharpe;
  const displayBestMuEsg = liveMetric?.best_mu_esg ?? bestMuEsg;

  const handleStop = async () => {
    await stopTraining(jobId);
    dispatch(removeJob(jobId));
    setShowStop(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Typography variant="h3">Job #{jobId}</Typography>
            <Badge variant={statusToBadgeVariant[status.status]}>
              {status.status}
            </Badge>
            {status.current_stage && (
              <Badge variant="default">
                {STAGE_LABELS[status.current_stage] ?? status.current_stage}
              </Badge>
            )}
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
          value={displayPct}
          label={`Step ${displayStep.toLocaleString()} / ${status.max_steps.toLocaleString()}`}
          showPercent
        />
        <div className="flex gap-6 text-sm text-muted">
          <span>
            Best Sharpe:{" "}
            <strong className="text-foreground">
              {displayBestSharpe?.toFixed(4) ?? "—"}
            </strong>
          </span>
          <span>
            Best μESG:{" "}
            <strong className="text-esg">
              {displayBestMuEsg?.toFixed(4) ?? "—"}
            </strong>
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
