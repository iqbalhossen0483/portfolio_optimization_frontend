import { cn } from "@/lib/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  disabled,
  "aria-label": ariaLabel,
}: SwitchProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel ?? label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors focus-visible:outline-none",
          checked ? "bg-primary" : "bg-border-strong",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white transform transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}
