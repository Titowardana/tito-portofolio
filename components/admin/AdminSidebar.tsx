"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard, IconUser, IconInfo, IconCode, IconFolder,
  IconBriefcase, IconGraduation, IconAward,
  IconExternal, IconLogOut, IconMenu, IconX,
  IconChevronLeft, IconChevronRight,
} from "@/components/admin/AdminIcons";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: IconDashboard, exact: true },
  { href: "/admin/profile", label: "Profile & Hero", icon: IconUser },
  { href: "/admin/about", label: "About", icon: IconInfo },
  { href: "/admin/skills", label: "Skills", icon: IconCode },
  { href: "/admin/projects", label: "Projects", icon: IconFolder },
  { href: "/admin/experiences", label: "Experience", icon: IconBriefcase },
  { href: "/admin/education", label: "Education", icon: IconGraduation },
  { href: "/admin/certificates", label: "Certificates", icon: IconAward },
] as const;

function NavItem({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={[
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        collapsed ? "justify-center" : "",
        isActive
          ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(37,99,235,0.25)]"
          : "text-text-secondary hover:bg-[var(--color-input)] hover:text-text-primary",
      ].join(" ")}
    >
      <span className={[
        "shrink-0 transition-colors",
        isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary",
      ].join(" ")}>
        <Icon size={18} />
      </span>
      {!collapsed && (
        <span className="truncate leading-none">{item.label}</span>
      )}
      {!collapsed && isActive && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      )}
    </Link>
  );
}

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if ("exact" in item && item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className={[
        "flex items-center border-b border-border py-5",
        collapsed ? "justify-center px-3" : "gap-3 px-5",
      ].join(" ")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-sm">
          T
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">TitoPortfolio</p>
            <p className="truncate text-xs text-text-secondary">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item)}
            collapsed={collapsed}
            onClick={onMobileClose}
          />
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border px-2 py-3 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onMobileClose}
          title={collapsed ? "View Portfolio" : undefined}
          className={[
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-[var(--color-input)] hover:text-secondary",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <span className="shrink-0 group-hover:text-secondary">
            <IconExternal size={18} />
          </span>
          {!collapsed && <span className="truncate">View Portfolio</span>}
        </Link>

        <button
          onClick={() => {
            onMobileClose();
            fetch("/api/auth/logout", { method: "POST" }).then(() => {
              window.location.href = "/admin/login";
            });
          }}
          title={collapsed ? "Sign Out" : undefined}
          className={[
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-red-500/10 hover:text-red-400",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <span className="shrink-0 group-hover:text-red-400">
            <IconLogOut size={18} />
          </span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <div className="hidden border-t border-border px-2 py-2 lg:block">
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={[
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-secondary transition-all hover:bg-[var(--color-input)] hover:text-text-primary",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          {collapsed ? <IconChevronRight size={16} /> : (
            <>
              <IconChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={[
          "hidden lg:flex flex-col h-full border-r border-border bg-[var(--background-dark)] transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[220px]",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-[var(--background-dark)] border-r border-border transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="absolute right-3 top-4 rounded-lg p-1.5 text-text-secondary hover:bg-[var(--color-input)] hover:text-text-primary"
        >
          <IconX size={18} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}

export function AdminMobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-[var(--color-input)] hover:text-text-primary lg:hidden"
      aria-label="Open menu"
    >
      <IconMenu size={20} />
    </button>
  );
}
