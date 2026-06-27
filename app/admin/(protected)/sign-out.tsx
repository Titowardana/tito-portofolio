"use client";

import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500 hover:text-white"
    >
      Sign Out
    </button>
  );
}
