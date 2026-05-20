import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  highlight?: boolean;
  badge?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  icon,
  highlight,
  badge,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border p-4 flex flex-col gap-3 bg-surface",
        highlight && "border-primary/30",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
        <span className={cn("text-muted", highlight && "text-primary")}>
          {icon}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {badge}
      </div>
    </div>
  );
}
