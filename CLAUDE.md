# CLAUDE.md — Tito Portfolio

@AGENTS.md

## Source of Truth

`AGENTS.md` is the primary source of project instructions.

Before analyzing, modifying, or generating code:

1. Read `AGENTS.md` completely.
2. Inspect the current project structure.
3. Read all files relevant to the requested task.
4. Preserve the existing architecture and visual identity.
5. Do not redesign or rewrite unrelated parts of the project.

If an instruction in this file conflicts with `AGENTS.md`, follow `AGENTS.md`.

## Project Context

This project is a personal portfolio website for:

**Tito Pamungkas Wardana**

Current technology stack:

* Next.js 16 App Router
* React 19
* TypeScript
* Tailwind CSS 4
* Motion for React
* GSAP

Visual direction:

* Dark midnight navy
* Royal blue
* Cyan accents
* Modern and premium
* Technology-oriented
* Professional
* Responsive
* Not a gaming website
* Not an admin-dashboard-style public interface

## Current Architecture

The project should remain modular.

```text
app/
components/
  layout/
  sections/
  ui/
data/
public/
```

Do not place the entire website inside `app/page.tsx`.

Keep reusable data, configuration, and components separated appropriately.

## Dynamic Content Direction

The portfolio is planned to have an admin system.

The following information should eventually be editable through the admin panel:

* Profile information
* Email
* WhatsApp
* GitHub
* LinkedIn
* Profile photo
* CV
* Projects
* Skills
* Experience
* Education
* Certificates
* Website settings

Do not repeatedly hardcode this information inside individual components.

Until the database and admin panel are implemented:

* use centralized temporary data files;
* leave unknown values empty or mark them with `TODO`;
* do not invent personal information;
* do not invent social links;
* do not invent project technologies;
* do not invent statistics.

The temporary centralized data should later be replaceable with database queries without redesigning the visual components.

## Current Development Priority

Follow this sequence unless the user explicitly changes it:

1. Maintain and improve project documentation.
2. Centralize temporary portfolio data.
3. Remove repeated dummy contact information.
4. Complete and verify the static layout.
5. Add real images, CV, and verified project content.
6. Verify desktop and mobile responsiveness.
7. Plan the database structure.
8. Implement authentication and the admin panel.
9. Connect the public portfolio to database content.
10. Add and refine advanced animations.
11. Optimize performance and accessibility.
12. Prepare deployment.

Do not implement all phases in a single task.

Work incrementally and keep each change easy to review.

## Animation Rules

Motion for React should be preferred for:

* entrance animations;
* button interactions;
* mobile navigation;
* modal transitions;
* simple section reveals;
* hover effects.

GSAP should be preferred for:

* intro timelines;
* split-screen reveals;
* photo slice reveals;
* ScrollTrigger animations;
* horizontal project scrolling;
* complex coordinated timelines.

Do not let Motion and GSAP control the same CSS transform property on the same element.

Advanced animations should not be implemented before:

* the static layout is stable;
* real content structure is known;
* responsive behavior is verified;
* dynamic data requirements are understood.

Every animation must:

* have a clear visual purpose;
* remain readable;
* avoid blocking navigation;
* avoid causing layout shifts;
* work safely on mobile;
* respect `prefers-reduced-motion`.

## Coding Rules

* Use TypeScript.
* Avoid `any`.
* Preserve strict type safety.
* Use semantic HTML.
* Maintain a correct heading hierarchy.
* Use accessible labels and focus states.
* Use `next/image` for local portfolio images.
* Use Server Components by default.
* Add `"use client"` only when client-side behavior is required.
* Keep components focused and reasonably small.
* Do not suppress ESLint or TypeScript errors without justification.
* Do not install unnecessary dependencies.
* Do not rewrite existing working components without a clear reason.

## Protected Areas

Never manually edit:

```text
node_modules/
.next/
.git/
```

Do not use:

```powershell
npm audit fix --force
```

Do not downgrade Next.js, React, TypeScript, or Tailwind CSS.

Do not replace configuration files without explaining why.

Do not delete user-created files or assets without explicit approval.

## Required Workflow

Before modifying code:

1. Explain the current condition.
2. Identify the actual problem.
3. List the files that need to change.
4. Provide a short implementation plan.
5. Avoid unrelated modifications.

After modifying code:

1. List every file changed.
2. Explain the purpose of each change.
3. Identify remaining placeholders and `TODO` items.
4. Run:

```powershell
npm run lint
npm run build
```

5. Report the real result of both commands.
6. Do not claim success when verification has not been performed.

## Important Reminder

The current portfolio foundation is already functional.

Improve it incrementally.

Do not recreate the entire project from scratch, change its identity, or move outside the requested scope.
