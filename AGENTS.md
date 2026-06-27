<!-- BEGIN:nextjs-agent-rules -->
Next.js **16.2.9** has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Tito Portfolio — Agent Guide

**Tito Pamungkas Wardana** — Informatics Engineering student, Full-Stack Developer, Cybersecurity Enthusiast. Never invent personal info or change the owner name.

## Stack

- Next.js 16.2.9 (App Router), React 19.2.4, TypeScript 5 strict (`@/*` path alias)
- Tailwind CSS 4 (`@theme` in `globals.css`, PostCSS via `@tailwindcss/postcss`)
- Motion 12 (lightweight), GSAP 3 (complex timelines)
- Three.js: `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `three`, `meshline`
- Prisma + MySQL, NextAuth v5 beta (Credentials/JWT), bcryptjs
- ESLint via `eslint-config-next` (core-web-vitals + TypeScript). `scripts/` excluded.
- No test command, no CI.

## Visual Identity

- Background `#0c1324`, surface `#151b2d`, primary `#2563eb` (royal blue), accent `#4cd7f6` (cyan)
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code) — via `next/font/google`
- Utility classes: `.glass`, `.glass-strong`, `.surface`, `.bg-grid` in `app/globals.css`
- Modern, premium, tech-oriented — not a gaming website or admin dashboard

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev at http://localhost:3000 |
| `npm run build` | Production build (run after lint) |
| `npm run lint` | ESLint |
| `npm run start` | Production server |
| `npm run admin` | Create/update admin via `tsx scripts/create-admin.ts` (needs env vars) |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Push schema without migrations (dev only) |
| `npx prisma migrate dev --name <desc>` | Create + apply migration |
| `npx prisma db seed` | Run `prisma/seed.ts` (reads `data/`) |
| `node scripts/generate-card-images.js` | Generate Lanyard card textures (requires `canvas` package) |

**Validation order**: `npm run lint` then `npm run build`. Report both honestly.
Never hand-edit migration files.

## Environment

`.env` is gitignored. Copy `.env.example`. Variables:

| Variable | Required for | Notes |
|---|---|---|
| `DATABASE_URL` | Everything | `mysql://root:@localhost:3306/tito_portfolio` |
| `AUTH_SECRET` | Auth | NextAuth JWT secret |
| `ADMIN_NAME` | `npm run admin` | One-time via env |
| `ADMIN_EMAIL` | `npm run admin` | One-time via env |
| `ADMIN_PASSWORD` | `npm run admin` | Min 12 chars |

## Data Architecture (Two-tier)

Components call `lib/data/` accessors (`getPublicProfile()`, etc.). These try Prisma first; if DB is unreachable they fall back to static `data/` files. The portfolio works without a database.

**Do not import `data/` directly from components** — only from `lib/data/` accessors. Only `prisma/seed.ts` consumes raw `data/` imports.

Field names differ between `data/` and Prisma schema (mapped in `lib/data/mappers.ts`):
- `data/profile.ts`: `github`, `linkedin`, `instagram`, `tiktok`
- Prisma schema: `githubUrl`, `linkedinUrl`, `instagramUrl`, `tiktokUrl`

**Gotcha**: `lib/data/profile.ts` uses `$queryRaw` instead of `prisma.profile.findFirst()` to always include `lanyardImage` regardless of generated Prisma client version. Do not refactor to `findFirst()` without verifying the field is in the generated type.

## Auth System

- NextAuth v5 beta, Credentials provider, JWT strategy, `trustHost: true`.
- `auth.ts` configures NextAuth. `proxy.ts` is middleware protecting `/admin/*`.
- Login: `/admin/login` (client form at `app/admin/login/form.tsx`).
- Protected layout: `app/admin/(protected)/layout.tsx` renders `AdminShell` component and uses `requireAdmin()`.
- `lib/auth/require-admin.ts` verifies session + DB active status in server components.
- `types/next-auth.d.ts` augments `User`, `Session`, `JWT` with `role` and `id`.

## Key Code Details

- **`app/page.tsx`** — thin composition layer with `dynamic = "force-dynamic"`. Calls all `getPublic*()` accessors and passes data as props to section components. Only the Home page uses them directly.
- **`next.config.ts`** — `serverActions.bodySizeLimit: "25mb"`.
- **Uploads** — `lib/storage/local-storage.ts`: saves to `public/uploads/profile/` (images) or `public/uploads/documents/` (PDFs). MIME-restricted (JPEG/PNG/WebP/PDF), UUID filenames. Never hand-edit `public/uploads/`.
- **Admin panel** — `app/admin/(protected)/` has CRUD for profile, projects, experiences, skills, certificates, about. Uses `AdminShell` layout (`components/admin/AdminShell.tsx`). Each section has server actions in `actions.ts` files.
- **Light/dark mode** — Cookie + localStorage via `lib/theme-provider.tsx` (client component). Server reads `theme` cookie in `app/layout.tsx` and applies `.light` class on `<html>`. The `.light` class triggers CSS variable overrides in `globals.css`.
- **Effects** — `components/effects/`: `SplashCursor*.tsx`, `Lanyard.tsx`, `AboutLanyard.tsx`. Lanyard uses card textures optionally generated by `scripts/generate-card-images.js`.

## Content Integrity

**Present**: GitHub (`github.com/titopamungkas`), LinkedIn (`linkedin.com/in/titopamungkas`), Instagram, TikTok strings exist but are empty.

**Intentionally empty (awaiting verified input)**:
- `email`, `whatsapp`, `location`, `about`, `cvUrl` in `data/profile.ts`
- `certificates` (empty array in `data/certificates.ts`)
- `startDate`, `endDate`, `location` in experiences

Never invent: work experience details, project stats/tech stacks, certificates, demo links, contact info.

## Animation Rules

Both Motion and GSAP are present. Never let both control the same CSS transform property on the same element. Respect `prefers-reduced-motion`.

Motion for: entrance animations, buttons, nav, modals, hover effects, simple section reveals.
GSAP for: intro timelines, complex coordinated timelines, ScrollTrigger, horizontal scrolling, split-screen/photo reveals.

## Workflow

Before code: read AGENTS.md → inspect relevant files → explain problem → list changed files → short plan.
After code: list every changed file → explain each → `npm run lint` → `npm run build` → report honestly (including remaining TODOs).

Preserve modular structure, visual identity, two-tier data, and working build. Improve incrementally.
