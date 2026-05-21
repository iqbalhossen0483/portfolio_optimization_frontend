"use client";

import { UserMenu } from "@/components/chat/UserMenu";
import { cn } from "@/lib/cn";
import {
  Activity,
  Database,
  LayoutDashboard,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/training", label: "Training", icon: Activity },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/assets", label: "Assets", icon: Database },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full w-72 shrink-0 border-r border-border bg-surface">
      {/* Brand */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-md rotate-45 bg-primary/15 border border-primary/40" />
            <div className="absolute inset-1 rounded-sm rotate-45 bg-primary/85" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground tracking-tight">
              MADRL Admin
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-subtle font-semibold">
              Console
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-surface-raised text-foreground"
                  : "text-muted hover:bg-surface-raised hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Back to chat */}
      <div className="px-2 pb-2">
        <Link
          href="/chat"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-subtle hover:text-foreground hover:bg-surface-raised transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Back to chat
        </Link>
      </div>

      {/* User menu */}
      <div className="border-t border-border p-2">
        <UserMenu />
      </div>
    </aside>
  );
}
