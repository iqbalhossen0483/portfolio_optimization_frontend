"use client";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useListSessionsQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveSession } from "@/store/slices/chatSlice";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SessionList } from "./SessionList";
import { UserMenu } from "./UserMenu";

export function ChatSidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useListSessionsQuery();
  const activeSessionId = useAppSelector((s) => s.chat.activeSessionId);

  const handleNewChat = () => {
    dispatch(setActiveSession(null));
    router.push("/chat");
  };

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
              MADRL
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-subtle font-semibold">
              Portfolio
            </span>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-3 pb-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleNewChat}
          className="w-full justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* History */}
      <div className="px-3 pb-2">
        <p className="text-[10px] uppercase tracking-wider text-subtle font-semibold px-1">
          History
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {isLoading ? (
          <Skeleton count={5} className="h-12 mb-1" />
        ) : (data?.sessions?.length ?? 0) === 0 ? (
          <p className="px-3 py-6 text-xs text-subtle text-center">
            No conversations yet
          </p>
        ) : (
          <SessionList
            sessions={data?.sessions ?? []}
            activeSessionId={activeSessionId}
          />
        )}
      </div>

      {/* User menu (bottom) */}
      <div className="border-t border-border p-2">
        <UserMenu />
      </div>
    </aside>
  );
}
