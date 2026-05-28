# NoHotfix — Developer Quickstart

Monorepo for NoHotfix (pnpm + Turborepo). This guide gets the project running locally and lists the scripts you'll use day to day.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| **Node** | 20 (see `.nvmrc`) | `nvm use` to switch |
| **pnpm** | 9 | `corepack enable` activates the pinned version |
| **Docker** | any recent | runs local Postgres + telemetry via `docker-compose.yml` |

## Quick start

```bash
# 1. Use the right Node + enable pnpm
nvm use            # Node 20
corepack enable    # activates pnpm@9

# 2. Install all workspace dependencies
pnpm install

# 3. Start local infrastructure (Postgres on :5432, OTEL collector, Jaeger UI)
docker compose up -d

# 4. Create env files (all are git-ignored)
cp apps/api/.env.example apps/api/.env
cp apps/app/.env.example apps/app/.env.local
cp apps/web/.env.example apps/web/.env.local

# 5. Point the API at the Docker database
#    Edit apps/api/.env and set DATABASE_URL to the docker-compose credentials:
#    DATABASE_URL=postgresql://nohotfix:nohotfix@localhost:5432/nohotfix

# 6. Run database migrations
pnpm --filter api db:migrate

# 7. Start the apps (api + web + app together, in a TUI)
pnpm dev

# Storybook (design-system style guide) runs separately:
pnpm --filter storybook dev
```

> The default `apps/api/.env.example` ships a placeholder `DATABASE_URL` — you must change it to the Docker credentials (`nohotfix:nohotfix`) in step 5, or migrations and the API will fail to connect.

## Apps & ports

| App | Path | Stack | Local URL |
|-----|------|-------|-----------|
| **API** | `apps/api` | Fastify 5 + Kysely (Postgres) | http://localhost:3001 |
| **Dashboard** | `apps/app` | React 19 + Vite + TanStack Router + HeroUI | http://localhost:5173 |
| **Marketing** | `apps/web` | Next.js 15 + React | http://localhost:3000 |
| **Storybook** | `apps/storybook` | Storybook 8 (design system) | http://localhost:6006 |
| Postgres | (docker) | postgres:16 | localhost:5432 |
| Jaeger UI | (docker) | tracing | http://localhost:16686 |

`pnpm dev` starts **api + web + app**. Run any single app with `pnpm --filter <api|app|web|storybook> dev`.

## Environment variables

Each app has a `.env.example` documenting its variables — copy it as shown above and fill in real values.

- **`apps/api/.env`** (required to boot): `DATABASE_URL`, `COOKIE_SECRET`, and the third-party keys — **WorkOS** (auth), **Stripe** (billing), **Resend** (email). The Stripe/Spaces/Sentry blocks are optional for local dev and can stay commented out.
- **`apps/app/.env.local`** / **`apps/web/.env.local`**: just the URLs of the other apps (`VITE_API_URL`, `NEXT_PUBLIC_API_URL`, etc.). Defaults already point at the local ports.

## Common scripts

Run from the repo root (Turborepo orchestrates across the workspace):

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Run **api + web + app** together (TUI). |
| `pnpm --filter <name> dev` | Run one app (`api`, `app`, `web`, `storybook`). |
| `pnpm build` | Build everything. |
| `pnpm lint` / `pnpm lint:fix` | ESLint (optionally autofix). |
| `pnpm typecheck` | `tsc --noEmit` across all packages. |
| `pnpm test` | Unit tests (Vitest) across all packages. |
| `pnpm test:e2e` | End-to-end tests (Playwright). |
| `pnpm db:migrate` | Run DB migrations (also available per-app: `pnpm --filter api db:migrate`). |
| `pnpm db:setup` | Create the database **and** migrate — for a locally-installed Postgres (uses `createdb`). With Docker the DB already exists, so just run `db:migrate`. |
| `pnpm format` | Prettier write. |
| `pnpm kill:ports` | Free port 5432 (stuck Postgres). |

Scope any task to one package with `--filter`, e.g. `pnpm --filter app build`, `pnpm --filter @nohotfix/design-tokens typecheck`.

## Testing

- **Unit (Vitest):** `pnpm test` for everything, or `pnpm --filter <pkg> test` for one package.
- **End-to-end (Playwright):** `pnpm test:e2e`. First time, install the browsers:
  ```bash
  pnpm --filter app-e2e exec playwright install
  ```
  Interactive/debug runners: `pnpm --filter app-e2e test:e2e:ui` (or `:debug`). E2E suites live in `apps/app-e2e` and `apps/web-e2e`.
- **Types & lint:** `pnpm typecheck` and `pnpm lint` before pushing.

## Project structure

```
apps/
  api/         Fastify backend (Postgres via Kysely)
  app/         Dashboard SPA (Vite + React + HeroUI)
  web/         Marketing site (Next.js)
  storybook/   Design-system style guide
  app-e2e/     Playwright tests for the dashboard
  web-e2e/     Playwright tests for the marketing site
packages/
  design-tokens/  Shared brand tokens (single source of truth — consumed by web, app, storybook)
  db/             Database client + migrations
  shared/         Cross-cutting schemas, errors, utils
  api-client/     Typed API client
  email/          Transactional email templates
  domains/        Domain modules: audit, authoring, billing, execution, identity
tooling/
  eslint/ · prettier/ · typescript/   Shared configs
docs/           Product, marketing, and design docs (brand-identity.md is canonical for design)
```

## Troubleshooting

- **API can't connect to the DB** → confirm Postgres is up (`docker compose ps`) and `apps/api/.env` `DATABASE_URL` uses `nohotfix:nohotfix@localhost:5432/nohotfix`.
- **Port 5432 already in use** → `pnpm kill:ports`, or stop a local Postgres service.
- **Playwright "browser not found"** → run the `playwright install` step above.
- **Stale Turbo cache / weird build state** → `pnpm install` then retry; caches live in `.turbo`.
