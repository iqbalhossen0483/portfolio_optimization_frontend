"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSession } from "@/store/slices/chatSlice";
import {
  useRenameSessionMutation,
  useDeleteSessionMutation,
} from "@/store/api";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import type { ChatSessionInfo } from "@/types/api";

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

interface SessionRowProps {
  session: ChatSessionInfo;
  isActive: boolean;
}

function SessionRow({ session, isActive }: SessionRowProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(session.name);
  const [showDelete, setShowDelete] = useState(false);
  const [rename] = useRenameSessionMutation();
  const [deleteSession, { isLoading: deleting }] = useDeleteSessionMutation();

  const handleRenameSubmit = async () => {
    if (newName.trim() && newName !== session.name) {
      await rename({ sessionId: session.session_id, name: newName.trim() });
    }
    setRenaming(false);
  };

  const handleDelete = async () => {
    await deleteSession(session.session_id);
    setShowDelete(false);
    router.push("/chat");
  };

  const handleOpen = () => {
    dispatch(setActiveSession(session.session_id));
    router.push(`/chat/${session.session_id}`);
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
          isActive
            ? "bg-surface-raised text-foreground"
            : "text-muted hover:bg-surface-raised hover:text-foreground",
        )}
        onClick={!renaming ? handleOpen : undefined}
      >
        <MessageSquare className="w-4 h-4 shrink-0" />
        <div className="flex-1 min-w-0">
          {renaming ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") setRenaming(false);
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              className="h-6 py-0 text-xs"
            />
          ) : (
            <p className="text-sm truncate">{session.name}</p>
          )}
          <p className="text-xs text-subtle">
            {formatRelativeDate(session.updated_at)}
          </p>
        </div>
        <ContextMenu
          trigger={
            <IconButton
              icon={<MoreHorizontal className="w-3.5 h-3.5" />}
              aria-label="Session options"
              size="sm"
              className="opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            />
          }
          items={[
            {
              label: "Rename",
              icon: <Pencil className="w-3.5 h-3.5" />,
              onClick: () => {
                setRenaming(true);
                setNewName(session.name);
              },
            },
            {
              label: "Delete",
              icon: <Trash2 className="w-3.5 h-3.5" />,
              onClick: () => setShowDelete(true),
              variant: "danger",
            },
          ]}
        />
      </div>
      <AlertDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete session?"
        description="This will permanently delete this conversation and all its messages."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}

interface SessionListProps {
  sessions: ChatSessionInfo[];
  activeSessionId: string | null;
}

export function SessionList({ sessions, activeSessionId }: SessionListProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {sessions.map((s) => (
        <SessionRow
          key={s.id}
          session={s}
          isActive={s.session_id === activeSessionId}
        />
      ))}
    </div>
  );
}
