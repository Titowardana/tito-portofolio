import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const userName = session.user.name ?? session.user.email ?? "Admin";

  return <AdminShell userName={userName}>{children}</AdminShell>;
}
