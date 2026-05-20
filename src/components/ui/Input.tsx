import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helper,
  leadingIcon,
  trailingIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-muted uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute left-3 text-muted pointer-events-none">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full rounded-lg border bg-surface-raised px-3 py-2 text-sm text-foreground placeholder:text-subtle transition-colors",
            "border-border",
            error && "border-destructive",
            leadingIcon && "pl-9",
            trailingIcon && "pr-9",
            className,
          )}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute right-3 text-muted">{trailingIcon}</span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && helper && <p className="text-xs text-muted">{helper}</p>}
    </div>
  );
}
