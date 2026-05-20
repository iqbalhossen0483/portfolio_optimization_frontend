import { Typography } from "@/components/ui/Typography";

interface MetricCellProps {
  label: string;
  value: string | number | null;
}

export function MetricCell({ label, value }: MetricCellProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-1">
      <Typography variant="label">{label}</Typography>
      <Typography variant="h4">
        {value !== null && value !== undefined ? String(value) : "—"}
      </Typography>
    </div>
  );
}
