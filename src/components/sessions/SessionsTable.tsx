"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import {
  useListSessionsQuery,
  useRenameSessionMutation,
  useDeleteSessionMutation,
} from "@/store/api";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Typography } from "@/components/ui/Typography";
import type { ChatSessionInfo } from "@/types/api";

function SessionRow({ session }: { session: ChatSessionInfo }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(session.name);
  const [showDelete, setShowDelete] = useState(false);
  const [rename] = useRenameSessionMutation();
  const [del, { isLoading: deleting }] = useDeleteSessionMutation();

  const handleRename = async () => {
    if (name.trim() && name !== session.name) {
      await rename({ sessionId: session.session_id, name: name.trim() });
    }
    setEditing(false);
  };

  return (
    <>
      <tr className="border-t border-border hover:bg-surface-raised/50 transition-colors">
        <td className="px-4 py-3">
          {editing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
              className="h-7 py-0 text-sm"
            />
          ) : (
            <span className="text-sm text-foreground">{session.name}</span>
          )}
        </td>
        <td className="px-4 py-3">
          <Typography variant="caption">
            {new Date(session.created_at).toLocaleDateString()}
          </Typography>
        </td>
        <td className="px-4 py-3">
          <Typography variant="caption">
            {new Date(session.updated_at).toLocaleDateString()}
          </Typography>
        </td>
        <td className="px-4 py-3">
          <Badge variant="default">{session.message_count}</Badge>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href={`/chat/${session.session_id}`}>
              <Button variant="ghost" size="sm">Open</Button>
            </Link>
            <IconButton
              icon={<Pencil className="w-3.5 h-3.5" />}
              aria-label="Rename session"
              size="sm"
              onClick={() => {
                setEditing(true);
                setName(session.name);
              }}
            />
            <IconButton
              icon={<Trash2 className="w-3.5 h-3.5" />}
              aria-label="Delete session"
              size="sm"
              variant="danger"
              onClick={() => setShowDelete(true)}
            />
          </div>
        </td>
      </tr>
      <AlertDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete session?"
        description="This will permanently delete this conversation."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          await del(session.session_id);
          setShowDelete(false);
        }}
        loading={deleting}
      />
    </>
  );
}

export function SessionsTable() {
  const { data, isLoading } = useListSessionsQuery();

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-surface-raised">
          <tr>
            {["Name", "Created", "Updated", "Messages", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  {Array.from({ length: 5 }).map((_, ci) => (
                    <td key={ci} className="px-4 py-3">
                      <Skeleton className="h-4" />
                    </td>
                  ))}
                </tr>
              ))
            : (data?.data?.sessions ?? []).map((s) => (
                <SessionRow key={s.id} session={s} />
              ))}
        </tbody>
      </table>
    </div>
  );
}
