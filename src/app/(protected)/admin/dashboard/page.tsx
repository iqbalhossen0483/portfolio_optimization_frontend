"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JobStatusChart } from "@/components/admin/JobStatusChart";
import { KpiCard } from "@/components/admin/KpiCard";
import { RecentJobsCard } from "@/components/admin/RecentJobsCard";
import { RecentUsersCard } from "@/components/admin/RecentUsersCard";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGetDashboardQuery } from "@/store/api";
import { Activity, BarChart2, Database, Users } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardQuery(undefined, {
    pollingInterval: 15_000,
  });
  const metrics = data?.data;

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="System health and activity at a glance"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 flex flex-col gap-6">
          {isLoading || !metrics ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Skeleton count={4} className="h-32" />
              </div>
              <Skeleton count={2} className="h-64" />
            </>
          ) : (
            <>
              {/* KPI grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard
                  label="Users"
                  value={metrics.users_count}
                  icon={Users}
                  series={metrics.users_per_week}
                />
                <KpiCard
                  label="Training Jobs"
                  value={metrics.jobs_count}
                  icon={Activity}
                  series={metrics.jobs_per_week}
                  badge={
                    metrics.training_running ? (
                      <span className="text-status-running font-medium">
                        Running
                      </span>
                    ) : undefined
                  }
                />
                <KpiCard
                  label="Assets"
                  value={metrics.assets_count}
                  icon={Database}
                />
                <KpiCard
                  label="Market Data Rows"
                  value={metrics.market_data_count}
                  icon={BarChart2}
                />
              </div>

              {/* Section charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <UserGrowthChart data={metrics.users_per_week} />
                <JobStatusChart data={metrics.job_status_breakdown} />
              </div>

              {/* Recent activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <RecentJobsCard jobs={metrics.recent_jobs} />
                <RecentUsersCard users={metrics.recent_users} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
