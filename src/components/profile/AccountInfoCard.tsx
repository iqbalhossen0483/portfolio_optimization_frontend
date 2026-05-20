import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import type { UserProfile } from "@/types/api";

interface AccountInfoCardProps {
  user: UserProfile;
}

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
      <Typography variant="h3">Account Info</Typography>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Typography variant="label">ID</Typography>
          <Typography variant="body" className="mt-1">{user.id}</Typography>
        </div>
        <div>
          <Typography variant="label">Role</Typography>
          <div className="mt-1">
            <Badge variant={user.role === "admin" ? "admin" : "user"}>
              {user.role}
            </Badge>
          </div>
        </div>
        <div>
          <Typography variant="label">Email</Typography>
          <Typography variant="body" className="mt-1">{user.email}</Typography>
        </div>
        <div>
          <Typography variant="label">Username</Typography>
          <Typography variant="body" className="mt-1">{user.username}</Typography>
        </div>
        <div>
          <Typography variant="label">Status</Typography>
          <Typography variant="body" className="mt-1">
            {user.is_active ? "Active" : "Inactive"}
          </Typography>
        </div>
        <div>
          <Typography variant="label">Member Since</Typography>
          <Typography variant="body" className="mt-1">
            {new Date(user.created_at).toLocaleDateString()}
          </Typography>
        </div>
      </div>
    </div>
  );
}
