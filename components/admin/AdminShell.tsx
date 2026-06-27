"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebar, AdminMobileMenuButton } from "@/components/admin/AdminSidebar";
import { SunIcon, MoonIcon } from "@/components/ui/Icons";
import { useTheme } from "@/lib/theme-provider";

const ROUTE_LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/profile": "Profile & Hero",
  "/admin/about": "About",
  "/admin/skills": "Skills",
  "/admin/projects": "Projects",
  "/admin/projects/new": "New Project",
  "/admin/experiences": "Experience",
  "/admin/education": "Education",
  "/admin/certificates": "Certificates",
  "/admin/contact": "Contact",
  "/admin/settings": "Site Settings",
};

function Breadcrumb() {
  const pathname = usePathname();
  const parts: { label: string; href: string }[] = [
    { label: "Admin", href: "/admin" },
  ];

  if (pathname !== "/admin") {
    // Handle nested routes like /admin/projects/[id]/edit
    const segments = pathname.split("/").filter(Boolean);
    let current = "";
    for (let i = 0; i < segments.length; i++) {
      current += "/" + segments[i];
      const label = ROUTE_LABELS[current];
      if (label && current !== "/admin") {
        parts.push({ label, href: current });
      }
    }
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {parts.map((part, i) => (
        <span key={part.href} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-text-muted">/</span>}
          {i === parts.length - 1 ? (
            <span className="font-medium text-text-primary">{part.label}</span>
          ) : (
            <Link href={part.href} className="text-text-secondary transition-colors hover:text-text-primary">
              {part.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  // Lazy initializer — reads localStorage at first render, no effect needed
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("admin-sidebar-collapsed") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("admin-sidebar-collapsed", String(next));
  }

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-[var(--background-dark)]/80 px-4 backdrop-blur-sm">
          {/* Mobile menu button */}
          <AdminMobileMenuButton onClick={() => setMobileOpen(true)} />

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <Breadcrumb />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-lg p-1.5 text-text-secondary transition-colors hover:text-text-primary hover:bg-surface-light"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>

            {/* Preview portfolio button */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-1.5 text-xs font-medium text-secondary transition-all hover:bg-secondary/10"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Preview
            </Link>

            {/* User badge */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-[var(--color-input)] px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-xs font-medium text-text-secondary max-w-[80px] truncate">
                {userName}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
