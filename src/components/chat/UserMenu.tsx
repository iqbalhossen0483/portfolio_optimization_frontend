"use client";

import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { ChevronUp, LogOut, Moon, Settings, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

function getInitials(name?: string | null, email?: string | null) {
  const source = (name || email || "User").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <div ref={containerRef} className="relative">
        {open && (
          <div
            role="menu"
            className="absolute left-0 right-0 bottom-full mb-2 z-30 rounded-lg border border-border bg-surface-raised shadow-lg py-1"
          >
            <MenuItem
              icon={<Settings className="w-4 h-4" />}
              label="Profile Settings"
              onClick={() => {
                setProfileOpen(true);
                setOpen(false);
              }}
            />
            <div className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-foreground">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4" />
                <span>Dark Theme</span>
              </div>
              <Switch
                checked={isDark}
                onChange={() => setTheme(isDark ? "light" : "dark")}
                size="sm"
                aria-label="Toggle dark theme"
              />
            </div>
            <div className="my-1 border-t border-border" />
            <MenuItem
              icon={<LogOut className="w-4 h-4" />}
              label="Logout"
              variant="danger"
              onClick={() => signOut({ callbackUrl: "/login" })}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer",
            "hover:bg-surface-raised",
            open && "bg-surface-raised",
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg text-sm font-semibold">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground truncate">
                {user?.name ?? "User"}
              </span>
              {isAdmin && (
                <ShieldCheck
                  className="w-3.5 h-3.5 text-primary shrink-0"
                  aria-label="Admin"
                />
              )}
            </div>
            <span className="text-xs text-muted truncate block">
              {user?.email ?? ""}
            </span>
          </div>
          <ChevronUp
            className={cn(
              "w-4 h-4 text-muted shrink-0 transition-transform",
              !open && "rotate-180",
            )}
          />
        </button>
      </div>

      <EditProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function MenuItem({
  icon,
  label,
  onClick,
  variant = "default",
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors cursor-pointer",
        variant === "danger"
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-surface",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
