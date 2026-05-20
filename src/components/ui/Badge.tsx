import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "running"
  | "admin"
  | "user";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantCls: Record<BadgeVariant, string> = {
  default: "bg-surface-raised text-muted",
  success: "bg-success/10 text-success",
  error: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  running: "bg-status-running/10 text-status-running animate-pulse",
  admin: "bg-primary/10 text-primary",
  user: "bg-surface-raised text-subtle",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variantCls[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
