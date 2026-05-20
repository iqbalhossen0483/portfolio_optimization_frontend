import { Typography } from "@/components/ui/Typography";
import { SessionsTable } from "@/components/sessions/SessionsTable";

export default function SessionsPage() {
  return (
    <div className="p-6 space-y-6">
      <Typography variant="h2">Chat Sessions</Typography>
      <SessionsTable />
    </div>
  );
}
