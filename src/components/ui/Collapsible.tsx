"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface CollapsibleProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Collapsible({
  title,
  icon,
  defaultOpen = false,
  children,
  className,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-raised transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-[2000px]" : "max-h-0",
        )}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
