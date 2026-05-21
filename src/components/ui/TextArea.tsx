"use client";

import { cn } from "@/lib/cn";
import { useEffect, useRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
}

export function TextArea({
  label,
  error,
  autoResize,
  className,
  id,
  ...props
}: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (!autoResize || !ref.current) return;
    const el = ref.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [props.value, autoResize]);

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
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm placeholder:text-subtle transition-colors resize-none max-h-48 overflow-y-auto",
          "focus:outline-none focus:ring-[1.5px]",
          error
            ? "border-destructive focus:ring-destructive"
            : "border-border focus:ring-primary",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
