"use client";

import { useActionState } from "react";

async function loginAction(_prev: unknown, formData: FormData) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
      window.location.href = params.get("callbackUrl") || "/admin";
      return { success: true };
    }

    const data = await res.json().catch(() => ({}));
    return { error: (data as { error?: string }).error || "Login failed" };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-text-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-4 py-2.5 text-sm text-text-primary placeholder-text-muted/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-text-muted"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] px-4 py-2.5 text-sm text-text-primary placeholder-text-muted/50 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Enter your password"
        />
      </div>

      {state && "error" in state && state.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
