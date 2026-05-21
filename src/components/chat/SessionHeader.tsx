"use client";

import { AlertDialog } from "@/components/ui/AlertDialog";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import {
  useDeleteSessionMutation,
  useGetSessionQuery,
  useRenameSessionMutation,
} from "@/store/api";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SessionHeaderProps {
  sessionId: string;
}

export function SessionHeader({ sessionId }: SessionHeaderProps) {
  const router = useRouter();
  const { data } = useGetSessionQuery(sessionId);
  const [rename] = useRenameSessionMutation();
  const [deleteSession, { isLoading: deleting }] = useDeleteSessionMutation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const name = data?.data?.name ?? "Untitled chat";

  const beginRename = () => {
    setDraft(name);
    setEditing(true);
  };

  const commitRename = async () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) {
      await rename({ sessionId, name: trimmed });
    }
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteSession(sessionId);
    setShowDelete(false);
    router.push("/chat");
  };

  return (
    <div className="sticky top-0 z-20 h-12 flex items-center justify-between gap-3 px-4 border-b border-border bg-surface/80 backdrop-blur">
      <div className="flex-1 min-w-0">
        {editing ? (
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") setEditing(false);
            }}
            autoFocus
            className="h-7 py-0 text-sm"
          />
        ) : (
          <button
            type="button"
            onClick={beginRename}
            className="text-sm font-medium text-foreground truncate max-w-full text-left hover:text-primary transition-colors"
            title="Click to rename"
          >
            {name}
          </button>
        )}
      </div>

      <ContextMenu
        trigger={
          <IconButton
            icon={<MoreHorizontal className="w-4 h-4" />}
            aria-label="Session actions"
            size="sm"
          />
        }
        items={[
          {
            label: "Rename",
            icon: <Pencil className="w-3.5 h-3.5" />,
            onClick: beginRename,
          },
          {
            label: "Delete",
            icon: <Trash2 className="w-3.5 h-3.5" />,
            onClick: () => setShowDelete(true),
            variant: "danger",
          },
        ]}
      />

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
    </div>
  );
}
