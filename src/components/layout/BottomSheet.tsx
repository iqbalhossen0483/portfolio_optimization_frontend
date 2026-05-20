"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
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
          "fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto bg-surface rounded-t-xl shadow-xl transform transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
