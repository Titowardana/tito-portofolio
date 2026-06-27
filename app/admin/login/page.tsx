import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "./form";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-[var(--color-input-border)] bg-[var(--color-input)] p-8 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-text-primary">
              Admin Sign In
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Tito Portfolio Management
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-text-muted transition-colors hover:text-primary"
            >
              &larr; Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
