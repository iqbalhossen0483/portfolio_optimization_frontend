import { Typography } from "@/components/ui/Typography";
import { UsersTable } from "@/components/users/UsersTable";

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6">
      <Typography variant="h2">Users</Typography>
      <UsersTable />
    </div>
  );
}
