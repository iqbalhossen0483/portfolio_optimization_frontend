"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  children: React.ReactNode;
}

export function Sheet({ open, onClose, side = "left", children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed inset-y-0 w-72 bg-surface z-50 transform transition-transform duration-300 shadow-xl",
          side === "left" ? "left-0" : "right-0",
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full",
        )}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
