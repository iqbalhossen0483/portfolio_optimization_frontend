import { cn } from "@/lib/cn";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
}: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
      )}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center mt-0.5">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors",
                  value === opt.value
                    ? "border-primary bg-primary"
                    : "border-border-strong bg-surface-raised",
                )}
              >
                {value === opt.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-fg" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm text-foreground">{opt.label}</span>
              {opt.description && (
                <p className="text-xs text-muted">{opt.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
