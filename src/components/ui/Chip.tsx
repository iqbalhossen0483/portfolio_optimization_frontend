import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChipProps {
  label: string;
  className?: string;
  onRemove?: () => void;
}

export function Chip({ label, className, onRemove }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-raised text-xs text-muted",
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
