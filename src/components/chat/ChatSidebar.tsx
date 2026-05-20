"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveSession } from "@/store/slices/chatSlice";
import { useListSessionsQuery } from "@/store/api";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { SessionList } from "./SessionList";

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
    <div className="flex flex-col h-full w-72 shrink-0 border-r border-border bg-surface">
      <div className="p-3 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewChat}
          className="w-full justify-start gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <Skeleton count={5} className="h-12 mb-1" />
        ) : (
          <SessionList
            sessions={data?.sessions ?? []}
            activeSessionId={activeSessionId}
          />
        )}
      </div>
    </div>
  );
}
