"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import { cn } from "@/lib/cn";
import { useRef, useState } from "react";

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ContextMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
}

export function ContextMenu({ trigger, items }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: containerRef,
    onOutsideClick: () => setOpen(false),
  });

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-40 rounded-lg bg-surface-raised border border-border shadow-lg py-1">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-1.5 text-sm transition-colors",
                item.variant === "danger"
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-foreground hover:bg-surface",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
