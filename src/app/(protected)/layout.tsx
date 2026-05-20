import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
