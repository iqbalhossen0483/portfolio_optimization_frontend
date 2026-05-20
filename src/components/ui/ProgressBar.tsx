import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showPercent,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-muted">
          {label && <span>{label}</span>}
          {showPercent && <span>{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full h-1.5 rounded-full bg-surface-raised overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
