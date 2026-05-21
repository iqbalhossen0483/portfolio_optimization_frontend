import { AssetTable } from "@/components/admin/AssetTable";
import { MetricsRow } from "@/components/admin/MetricsRow";
import { Typography } from "@/components/ui/Typography";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <Typography variant="h2">Dashboard</Typography>
      <MetricsRow />
      <div>
        <Typography variant="h3" className="mb-4">
          Assets
        </Typography>
        <AssetTable />
      </div>
    </div>
  );
}
