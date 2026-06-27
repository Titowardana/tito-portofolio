import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  IconUser, IconCode, IconFolder, IconBriefcase,
  IconGraduation, IconAward, IconClock, IconTrendUp, IconActivity,
} from "@/components/admin/AdminIcons";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [profileCount, projectCount, skillCount, experienceCount, certificateCount, lastProject, lastSkill] =
      await Promise.all([
        prisma.profile.count(),
        prisma.project.count({ where: { active: true } }),
        prisma.skill.count({ where: { active: true } }),
        prisma.experience.count({ where: { active: true, type: { not: "education" } } }),
        prisma.certificate.count({ where: { active: true } }),
        prisma.project.findFirst({ orderBy: { updatedAt: "desc" }, select: { title: true, updatedAt: true } }),
        prisma.skill.findFirst({ orderBy: { updatedAt: "desc" }, select: { name: true, updatedAt: true } }),
      ]);

    const educationCount = await prisma.experience.count({ where: { active: true, type: "education" } });
    const featuredCount = await prisma.project.count({ where: { active: true, featured: true } });

    return {
      profileCount, projectCount, skillCount, experienceCount,
      educationCount, certificateCount, featuredCount,
      lastProject, lastSkill,
    };
  } catch {
    return {
      profileCount: 0, projectCount: 0, skillCount: 0, experienceCount: 0,
      educationCount: 0, certificateCount: 0, featuredCount: 0,
      lastProject: null, lastSkill: null,
    };
  }
}

function formatRelative(date: Date | null): string {
  if (!date) return "—";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatCard({
  label, value, sub, href, icon: Icon, color,
}: {
  label: string;
  value: number;
  sub?: string;
  href: string;
  icon: React.FC<{ size?: number }>;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all hover:border-[var(--color-input-border)] hover:bg-surface-light hover:shadow-lg hover:shadow-black/20"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">{label}</p>
          <p className={`mt-2 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-text-secondary">{sub}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${color.replace("text-", "bg-").replace("-400", "-400/15").replace("-500", "-500/15")}`}>
          <Icon size={20} />
        </div>
      </div>
      {/* Subtle gradient accent */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function QuickAction({ label, href, description }: { label: string; href: string; description: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-lg border border-border bg-surface/30 p-4 transition-all hover:border-[var(--color-input-border)] hover:bg-surface-light/60"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary group-hover:text-text-primary">{label}</p>
        <p className="mt-0.5 truncate text-xs text-text-secondary">{description}</p>
      </div>
      <svg className="shrink-0 text-text-secondary group-hover:text-secondary transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [session, stats] = await Promise.all([auth(), getStats()]);
  const userName = session?.user?.name ?? "Admin";

  const statCards = [
    {
      label: "Active Projects",
      value: stats.projectCount,
      sub: `${stats.featuredCount} featured`,
      href: "/admin/projects",
      icon: IconFolder,
      color: "text-blue-400",
    },
    {
      label: "Skills",
      value: stats.skillCount,
      sub: "across all categories",
      href: "/admin/skills",
      icon: IconCode,
      color: "text-cyan-400",
    },
    {
      label: "Experience",
      value: stats.experienceCount,
      sub: "work & internship",
      href: "/admin/experiences",
      icon: IconBriefcase,
      color: "text-violet-400",
    },
    {
      label: "Education",
      value: stats.educationCount,
      sub: "entries",
      href: "/admin/education",
      icon: IconGraduation,
      color: "text-emerald-400",
    },
    {
      label: "Certificates",
      value: stats.certificateCount,
      sub: stats.certificateCount === 0 ? "none yet" : "verified",
      href: "/admin/certificates",
      icon: IconAward,
      color: "text-amber-400",
    },
    {
      label: "Profile",
      value: stats.profileCount,
      sub: "record",
      href: "/admin/profile",
      icon: IconUser,
      color: "text-rose-400",
    },
  ];

  const quickActions = [
    { label: "Edit Profile & Hero", href: "/admin/profile", description: "Name, bio, social links, profile photo" },
    { label: "Manage About Section", href: "/admin/about", description: "Bio, stats, badges, Lanyard photo" },
    { label: "Manage Skills", href: "/admin/skills", description: "Add or remove technical skills" },
    { label: "Add a Project", href: "/admin/projects", description: "Publish, draft, or feature projects" },
    { label: "Update Experience", href: "/admin/experiences", description: "Work history and internships" },
    { label: "Site Settings", href: "/admin/settings", description: "SEO, site name, contact preferences" },
  ];

  // Recent activity — show last modified records
  const recentActivity: { label: string; detail: string; time: string }[] = [];
  if (stats.lastProject) {
    recentActivity.push({
      label: "Project updated",
      detail: stats.lastProject.title,
      time: formatRelative(stats.lastProject.updatedAt),
    });
  }
  if (stats.lastSkill) {
    recentActivity.push({
      label: "Skill updated",
      detail: stats.lastSkill.name,
      time: formatRelative(stats.lastSkill.updatedAt),
    });
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {userName.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-text-secondary">
          Here&apos;s an overview of your portfolio content. Click any card to manage it.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <IconTrendUp size={16} />
            <h2 className="text-sm font-semibold text-text-primary">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {quickActions.map((a) => (
              <QuickAction key={a.href} {...a} />
            ))}
          </div>
        </div>

        {/* Recent activity + status */}
        <div className="space-y-4">
          {/* Recent activity */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <IconActivity size={16} />
              <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
            </div>
            {recentActivity.length === 0 ? (
              <p className="py-4 text-center text-xs text-text-secondary">
                No recent activity yet. Start by seeding your database.
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary/60" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{item.label}</p>
                      <p className="truncate text-xs text-text-secondary">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-text-secondary">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System status */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <IconClock size={16} />
              <h2 className="text-sm font-semibold text-text-primary">System Status</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Database</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Auth</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Upload Storage</span>
                <span className="flex items-center gap-1.5 text-xs text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Local FS
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Portfolio</span>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  Live ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
