import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/chat");
  return <AdminShell>{children}</AdminShell>;
}
