"use client";

export function SignOut() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500 hover:text-white"
    >
      Sign Out
    </button>
  );
}
