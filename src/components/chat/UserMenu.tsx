"use client";

import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Switch } from "@/components/ui/Switch";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/store/hooks";
import { ChevronUp, LogOut, Moon, Settings, ShieldCheck } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import Avater from "../ui/Avater";

export function UserMenu() {
  const user = useAppSelector((s) => s.user.user);
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: containerRef,
    onOutsideClick: () => setOpen(false),
  });

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
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors",
            "hover:bg-surface-raised",
            open && "bg-surface-raised",
          )}
        >
          <Avater
            profileImage={user?.profile ?? null}
            userName={user?.name ?? ""}
            size="sm"
          />

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
        "flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors",
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
