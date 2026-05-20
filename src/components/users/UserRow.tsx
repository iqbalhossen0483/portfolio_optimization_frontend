"use client";

import { useState } from "react";
import { ShieldCheck, ShieldOff, User, CheckCircle2, XCircle } from "lucide-react";
import { useUpdateUserRoleMutation } from "@/store/api";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { Tooltip } from "@/components/ui/Tooltip";
import { Typography } from "@/components/ui/Typography";
import type { UserProfile } from "@/types/api";

interface UserRowProps {
  user: UserProfile;
  currentUserId: string;
}

export function UserRow({ user, currentUserId }: UserRowProps) {
  const [showPromote, setShowPromote] = useState(false);
  const [showDemote, setShowDemote] = useState(false);
  const [updateRole, { isLoading }] = useUpdateUserRoleMutation();
  const isSelf = String(user.id) === currentUserId;

  return (
    <>
      <tr className="border-t border-border hover:bg-surface-raised/50 transition-colors">
        <td className="px-4 py-3 text-sm text-muted">{user.id}</td>
        <td className="px-4 py-3 text-sm text-foreground">{user.email}</td>
        <td className="px-4 py-3 text-sm text-foreground">{user.username}</td>
        <td className="px-4 py-3">
          {user.role === "admin" ? (
            <Badge variant="admin">
              <ShieldCheck className="w-3 h-3 mr-1 text-primary" />
              admin
            </Badge>
          ) : (
            <Badge variant="user">
              <User className="w-3 h-3 mr-1 text-muted" />
              user
            </Badge>
          )}
        </td>
        <td className="px-4 py-3">
          {user.is_active ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : (
            <XCircle className="w-4 h-4 text-destructive" />
          )}
        </td>
        <td className="px-4 py-3">
          <Typography variant="caption">
            {new Date(user.created_at).toLocaleDateString()}
          </Typography>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {isSelf ? (
              <Tooltip content="Cannot change your own role">
                <span className="text-xs text-subtle">—</span>
              </Tooltip>
            ) : (
              <>
                {user.role !== "admin" && (
                  <Tooltip content="Promote to admin">
                    <IconButton
                      icon={<ShieldCheck className="w-4 h-4" />}
                      aria-label="Promote to admin"
                      size="sm"
                      onClick={() => setShowPromote(true)}
                    />
                  </Tooltip>
                )}
                {user.role === "admin" && (
                  <Tooltip content="Demote to user">
                    <IconButton
                      icon={<ShieldOff className="w-4 h-4" />}
                      aria-label="Demote to user"
                      size="sm"
                      variant="danger"
                      onClick={() => setShowDemote(true)}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </div>
        </td>
      </tr>
      <AlertDialog
        open={showPromote}
        onClose={() => setShowPromote(false)}
        title="Promote to admin?"
        description={`${user.email} will gain full admin access.`}
        confirmLabel="Promote"
        onConfirm={async () => {
          await updateRole({ id: user.id, role: "admin" });
          setShowPromote(false);
        }}
        loading={isLoading}
      />
      <AlertDialog
        open={showDemote}
        onClose={() => setShowDemote(false)}
        title="Demote to user?"
        description={`${user.email} will lose admin access.`}
        confirmLabel="Demote"
        variant="danger"
        onConfirm={async () => {
          await updateRole({ id: user.id, role: "user" });
          setShowDemote(false);
        }}
        loading={isLoading}
      />
    </>
  );
}
