import { auth } from "@/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col overflow-hidden">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
