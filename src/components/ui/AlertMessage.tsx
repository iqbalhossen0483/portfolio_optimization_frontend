import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface AlertMessageProps {
  message: string;
  variant?: "error" | "warning" | "info";
  icon?: React.ReactNode;
}

const variantCls = {
  error: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-primary/10 text-primary",
};

export function AlertMessage({
  message,
  variant = "error",
  icon,
}: AlertMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
        variantCls[variant],
      )}
    >
      {icon ?? <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
