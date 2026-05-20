"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  MessageSquare,
  History,
  Settings,
  Activity,
  Users,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

const userLinks = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/sessions", label: "Sessions", icon: History },
  { href: "/profile", label: "Profile", icon: Settings },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/training", label: "Training", icon: Activity },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function Navbar() {
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "admin";

  const links = [...userLinks, ...(isAdmin ? adminLinks : [])];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 h-14 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/chat" className="font-bold text-foreground text-sm">
            MADRL
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname.startsWith(href)
                    ? "text-foreground bg-surface-raised"
                    : "text-muted hover:text-foreground hover:bg-surface-raised",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {session?.user && (
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="text-sm text-muted">{session.user.name}</span>
              {isAdmin ? (
                <Badge variant="admin">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  admin
                </Badge>
              ) : (
                <Badge variant="user">
                  <User className="w-3 h-3 mr-1" />
                  user
                </Badge>
              )}
            </div>
          )}
          <IconButton
            icon={
              resolvedTheme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )
            }
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(resolvedTheme === "light" ? "dark" : "light")
            }
          />
          <IconButton
            icon={<LogOut className="w-4 h-4" />}
            aria-label="Sign out"
            onClick={() => signOut({ callbackUrl: "/login" })}
          />
          <div className="md:hidden">
            <IconButton
              icon={
                mobileOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )
              }
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            />
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-2 flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                pathname.startsWith(href)
                  ? "text-foreground bg-surface-raised"
                  : "text-muted hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
