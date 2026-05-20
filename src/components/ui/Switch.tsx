import { cn } from "@/lib/cn";

type SwitchSize = "sm" | "md" | "lg";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: SwitchSize;
  "aria-label"?: string;
}

const sizeMap: Record<
  SwitchSize,
  { track: string; thumb: string; translate: string }
> = {
  sm: { track: "w-7 h-4", thumb: "size-4", translate: "translate-x-4" },
  md: { track: "w-9 h-5", thumb: "size-5", translate: "translate-x-5" },
  lg: { track: "w-11 h-6", thumb: "size-6", translate: "translate-x-6" },
};

export function Switch({
  checked,
  onChange,
  label,
  disabled,
  size = "md",
  "aria-label": ariaLabel,
}: SwitchProps) {
  const s = sizeMap[size];
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel ?? label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          s.track,
          checked ? "bg-primary" : "bg-border-strong",
          disabled && "opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute left-0 flex justify-center items-center transform rounded-full bg-white transition-all duration-300",
            checked ? s.translate : "translate-x-0",
            s.thumb,
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-foreground select-none">{label}</span>
      )}
    </label>
  );
}
