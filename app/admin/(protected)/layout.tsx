import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session?.role || session.role !== "admin") {
    redirect("/admin/login");
  }

  const userName = session.name ?? session.email ?? "Admin";

  return <AdminShell userName={userName}>{children}</AdminShell>;
}
