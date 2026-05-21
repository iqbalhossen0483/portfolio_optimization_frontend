"use client";

import { Badge } from "@/components/ui/Badge";
import Avater from "@/components/ui/Avater";
import { cn } from "@/lib/cn";
import type { RecentUserInfo } from "@/types/api";
import { UserPlus } from "lucide-react";
import Link from "next/link";

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface RecentUsersCardProps {
  users: RecentUserInfo[];
}

export function RecentUsersCard({ users }: RecentUsersCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Recent signups
          </h2>
          <p className="text-xs text-muted">Last 5 user accounts</p>
        </div>
        <Link
          href="/admin/users"
          className="text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-32 gap-2">
          <UserPlus className="w-5 h-5 text-subtle" />
          <p className="text-sm text-subtle">No recent signups</p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {users.map((user, i) => (
            <li
              key={user.id}
              className={cn(
                "flex items-center gap-3 py-2.5",
                i !== users.length - 1 && "border-b border-border",
              )}
            >
              <Avater
                profileImage={user.profile}
                userName={user.name}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </span>
                  <Badge variant={user.role === "admin" ? "admin" : "user"}>
                    {user.role}
                  </Badge>
                </div>
                <span className="text-xs text-muted truncate block">
                  {user.email}
                </span>
              </div>
              <span className="text-xs text-muted shrink-0">
                {timeAgo(user.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
