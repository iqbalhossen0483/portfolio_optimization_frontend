"use client";

import { IconButton } from "@/components/ui/IconButton";
import { useAppDispatch } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { Menu } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  const dispatch = useAppDispatch();
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-6 h-14 border-b border-border bg-surface/80 backdrop-blur">
      <IconButton
        icon={<Menu className="w-4 h-4" />}
        aria-label="Open sidebar"
        onClick={() => dispatch(setSidebarOpen(true))}
        className="lg:hidden"
      />
      <div className="flex-1 min-w-0">
        <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted truncate">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
