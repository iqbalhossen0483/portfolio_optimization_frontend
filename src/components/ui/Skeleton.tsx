import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn("animate-pulse rounded bg-surface-raised h-4", className)}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={cn("animate-pulse rounded bg-surface-raised h-4", className)}
    />
  );
}
