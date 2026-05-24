"use client";

import { EventLog } from "@/components/admin/EventLog";
import { MetricsGrid } from "@/components/admin/MetricsGrid";
import { MonitorHeader } from "@/components/admin/MonitorHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGetTrainingStatusQuery } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { pushLog, pushMetric } from "@/store/slices/trainingSlice";
import type { TrainingMetric } from "@/types/store";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function formatLogLine(msg: Record<string, unknown>): string {
  if (msg.type === "step") {
    return `[step ${msg.step}] sharpe=${Number(msg.best_sharpe ?? 0).toFixed(4)} entropy=${Number(msg.entropy ?? 0).toFixed(4)}`;
  }
  if (msg.type === "warmup") {
    return `[warmup] progress=${msg.progress ?? 0}%`;
  }
  if (msg.type === "stage") {
    return `[stage ${msg.status ?? "?"}] ${msg.stage ?? ""}${msg.message ? ` — ${msg.message}` : ""}`;
  }
  return JSON.stringify(msg);
}

export default function TrainingMonitorPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [warmupPct, setWarmupPct] = useState<number | null>(null);

  const { data, isLoading } = useGetTrainingStatusQuery(id, {
    pollingInterval: 10_000,
    skip: !id,
  });
  const statusData = data?.data;

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    const url = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/training/${id}?token=${session.user.accessToken}`;
    console.log("[ws] opening", url);
    const ws = new WebSocket(url);

    ws.onopen = () => console.log("[ws] OPEN — readyState=", ws.readyState);
    ws.onerror = (e) => console.log("[ws] ERROR", e);
    ws.onclose = (e) =>
      console.log("[ws] CLOSED", {
        code: e.code,
        reason: e.reason,
        wasClean: e.wasClean,
      });

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as Record<string, unknown>;
        console.log(msg);

        if (msg.type === "step") {
          const metric: TrainingMetric = {
            step: Number(msg.step ?? 0),
            entropy: Number(msg.entropy ?? 0),
            entropy_rolling_std: Number(msg.entropy_rolling_std ?? 0),
            reward_bloomberg: Number(msg.reward_bloomberg ?? 0),
            reward_lesg: Number(msg.reward_lesg ?? 0),
            reward_financial: Number(msg.reward_financial ?? 0),
            loss_actor: Number(msg.loss_actor ?? 0),
            loss_critic: Number(msg.loss_critic ?? 0),
            alpha_t: Number(msg.alpha_t ?? 0),
            best_sharpe:
              msg.best_sharpe == null ? null : Number(msg.best_sharpe),
            best_mu_esg:
              msg.best_mu_esg == null ? null : Number(msg.best_mu_esg),
          };
          dispatch(pushMetric({ id, metric }));
          dispatch(
            pushLog({
              id,
              entry: {
                timestamp: new Date().toLocaleString("sv-SE", {
                  timeZone: "Asia/Dhaka",
                }),
                message: formatLogLine(msg),
              },
            }),
          );
          setWarmupPct(null);
        }

        if (msg.type === "warmup") {
          setWarmupPct(Number(msg.progress ?? 0));
          dispatch(
            pushLog({
              id,
              entry: {
                timestamp: new Date().toLocaleString("sv-SE", {
                  timeZone: "Asia/Dhaka",
                }),
                message: formatLogLine(msg),
              },
            }),
          );
        }

        if (msg.type === "stage") {
          dispatch(
            pushLog({
              id,
              entry: {
                timestamp: new Date().toLocaleString("sv-SE", {
                  timeZone: "Asia/Dhaka",
                  hour12: true,
                }),
                message: formatLogLine(msg),
              },
            }),
          );
        }
      } catch {
        /* malformed WS message — skip */
      }
    };

    return () => ws.close();
  }, [id, session?.user?.accessToken, dispatch]);

  if (isLoading || !statusData) {
    return (
      <div className="p-6">
        <Skeleton count={3} className="h-16 mb-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <MonitorHeader
        jobId={id}
        status={statusData}
        bestSharpe={statusData.best_sharpe}
        bestMuEsg={statusData.best_mu_esg}
      />

      {warmupPct !== null && (
        <div className="px-6 py-3 border-b border-border">
          <ProgressBar value={warmupPct} label="Warmup" showPercent />
        </div>
      )}

      <MetricsGrid jobId={id} />
      <EventLog jobId={id} />
    </div>
  );
}
