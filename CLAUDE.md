# nohotfix.com Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-06

## Active Technologies
- TypeScript 5.7, Node.js ≥20 + Next.js 15 (App Router), React 18, Tailwind CSS 3, `@nohotfix/design-tokens` (CSS-variable tokens), `next/font` (DM Sans / Inter / Geist Mono), Lenis (smooth scroll, already wired). No new runtime dependency required (TextType is copy-in, like `Magnet.tsx`). (032-feature-pages)
- N/A — static marketing pages, no persistence. (032-feature-pages)

- TypeScript 5.7, Node.js 20 + Fastify 5, Kysely, TanStack Router + Query, Reac (005-org-members-list)
- PostgreSQL (existing `memberships` + `users` tables — no schema changes) (005-org-members-list)
- TypeScript 5.7, Node.js 20 + Fastify 5, Kysely, TanStack Router + Query, React, Zod (006-org-settings)
- PostgreSQL (existing `organisations` table — no schema changes) (006-org-settings)
- TypeScript 5.7, Node.js 20 + Fastify 5, Kysely, TanStack Router + Query, React, Zod, WorkOS SDK (007-user-settings)
- PostgreSQL (existing `users` table — schema migration required) (007-user-settings)
- TypeScript 5.7, Node.js 20 + Fastify 5, Kysely, TanStack Router + Query, React, Zod, WorkOS SDK, Resend SDK (008-invite-members)
- PostgreSQL (new `invites` table via migration) (008-invite-members)
- PostgreSQL (existing `memberships` table — no schema changes) (009-change-member-role)
- TypeScript 5.7, Node.js 20 + Fastify 5, Kysely, TanStack Router + Query, React, Zod, TipTap (rich text) (011-create-spec)
- PostgreSQL — existing `spec_library` and `changelog` tables (no migration) (011-create-spec)
- PostgreSQL (migration required: 2 new columns on `spec_library`) (012-spec-field-validations)
- TypeScript 5.7, Node.js 20 + Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit (existing) (014-text-artifact-requirement)
- PostgreSQL — existing `spec_library.artifact_requirements` JSONB column (no migration) (014-text-artifact-requirement)
- PostgreSQL -- existing `spec_library.artifact_requirements` JSONB column (no migration) (015-file-artifact-requirement)
- PostgreSQL (existing `spec_library` table — no migration) (020-spec-library-overview)
- PostgreSQL (new `environments` table, migration to `playbooks` table) (021-managed-environments)
- PostgreSQL (existing `changelog` table — no schema changes) (022-spec-history)
- TypeScript 5.7, Node.js 20 + Fastify 5, Kysely, TanStack Router + Query, React, Zod, TipTap, @dnd-ki (023-edit-spec)
- PostgreSQL (existing `spec_library` and `changelog` tables — no migration) (023-edit-spec)
- PostgreSQL (existing tables: `playbooks`, `playbook_sections`, `playbook_specs`; migration required: nullable `section_id`) (025-playbook-configuration)
- PostgreSQL (existing `spec_library`, `playbook_specs`, `playbooks`, `changelog` tables — no migration) (027-archive-spec)
- PostgreSQL (existing `changelog` table — no migration required) (028-playbook-history)
- PostgreSQL (existing `playbooks` table -- `is_archived` column already exists; no migration required) (029-archive-playbook)
- TypeScript 5.7, React 18, Vite 6 + TailwindCSS 4.2, @tailwindcss/vite, @heroui/react, framer-motion, @lordicon/react, @fontsource-variable/inter, @fontsource-variable/geist-mono (030-dashboard-layout)
- N/A — no database changes (030-dashboard-layout)
- TypeScript 5.7, React 18, Vite 6 + TailwindCSS 4.2, @heroui/styles (v3.0.0-beta.8), framer-motion (existing) (031-dark-mode-toggle)
- localStorage (browser-only, no database) (031-dark-mode-toggle)

- TypeScript 5.7, Node.js 20, Next.js 15 + Fastify 5, WorkOS SDK, Next.js (App Router) (004-login-redirect)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.7, Node.js 20, Next.js 15: Follow standard conventions

## Recent Changes
- 032-feature-pages: Added TypeScript 5.7, Node.js ≥20 + Next.js 15 (App Router), React 18, Tailwind CSS 3, `@nohotfix/design-tokens` (CSS-variable tokens), `next/font` (DM Sans / Inter / Geist Mono), Lenis (smooth scroll, already wired). No new runtime dependency required (TextType is copy-in, like `Magnet.tsx`).

- 031-dark-mode-toggle: Added TypeScript 5.7, React 18, Vite 6 + TailwindCSS 4.2, @heroui/styles (v3.0.0-beta.8), framer-motion (existing)
- 030-dashboard-layout: Added TypeScript 5.7, React 18, Vite 6 + TailwindCSS 4.2, @tailwindcss/vite, @heroui/react, framer-motion, @lordicon/react, @fontsource-variable/inter, @fontsource-variable/geist-mono

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
