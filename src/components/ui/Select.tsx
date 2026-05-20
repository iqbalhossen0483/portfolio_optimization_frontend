import { cn } from "@/lib/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-muted uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground transition-colors",
          error && "border-destructive",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
