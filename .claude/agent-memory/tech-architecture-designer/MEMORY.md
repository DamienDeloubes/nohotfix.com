# Tech Architecture Designer -- Memory

## Project: NoHotfix.com

Release readiness platform. Artifact-gated spec execution + go/no-go decision gates + run immutability.

## Architecture Document

Written at: `docs/development/technical-architecture.md`

## Key Architecture Decisions (confirmed, all resolved)

- **ADR-001**: Modular monolith -- 5 DDD contexts in single Fastify 5 process
- **ADR-002**: Two frontend apps -- Next.js (landing/auth) + React SPA (TanStack Router + Query)
- **ADR-003**: Kysely query builder, no ORM, raw SQL only in migrations
- **ADR-004**: WorkOS for all auth, not built in-house
- **ADR-005**: Presigned PUT -- browser -> DO Spaces direct, API records metadata only
- **ADR-006**: Snapshot-based run isolation -- deep-copy in single transaction
- **ADR-007**: SWR polling 5s (v1), SSE planned v2
- **ADR-008**: Structured error codes (`DOMAIN_CATEGORY_SPECIFIC`) as Sentry fingerprints
- **ADR-009**: "Keep local" as sole divergence -- NO overrides JSONB
- **ADR-010**: Separate Vercel projects
- **ADR-011**: Domain packages decoupled from transport (Hexagonal/Ports-and-Adapters)
- **3-layer immutability**: middleware + service + planned DB trigger
- **Domains cannot import from each other** -- use events or orchestration in API layer

## Domain Package Architecture (ADR-011)

Each domain at `packages/domains/<ctx>/` has: entities/, services/, use-cases/, ports/, errors/, events/, types.ts, ui/

- **Dual exports**: `"."` = domain logic, `"./ui"` = React components + hooks
- ui/ has: components/, hooks/, index.ts
- React + TanStack Query declared as peerDependencies (optional: true)
- apps/api imports domain logic only (never /ui); apps/app imports both
- TransactionHandle = opaque `unknown` type (Kysely casts internally in adapter)
- Use cases accept `Deps` parameter (dependency injection)
- Composition root in `apps/api/src/composition-root.ts`
- DomainError base class in `@nohotfix/shared` (no HTTP status codes in domain)
- Error-to-HTTP mapping ONLY in `apps/api/src/lib/error-handler.ts`
- Migration: 7 phases (added Phase 6: co-locate UI), each leaves build green
- PNPM workspace needs `packages/domains/*` glob (nested workspace)
- Open question: where to put ApiClientContext (shared/react or ui-shared package)

## API Layer After Extraction

`apps/api/` = thin adapter: adapters/repositories/, adapters/services/, routes/, plugins/, middleware/

## Bounded Contexts

1. Identity 2. Billing 3. Authoring 4. Execution 5. Audit

## Database: 15 tables (14 + changelog)

All tenant tables have org_id. No RLS in v1.

## Frontend Reuse (co-located UI)

`apps/app` imports domain logic + ui from domain packages

- Logic: state machines, validation rules (no duplication)
- UI: feature components (RunOverview, PlaybookEditor, etc.) + TanStack Query hooks
- `apps/app` is thin shell: routing, layouts, page composition only
- Domain UI hooks use ApiClientContext (injected, not imported from apps/app)

## Error Taxonomy: DOMAIN_CATEGORY_SPECIFIC

AUTH*\*, BILL*\_, AUTHOR\_\_, EXEC*\*, SYS*\*

## JSONB Usage (NO overrides column)

Rich text (TipTap), test_steps, artifact_requirements, table_data, field_changes, failed_specs_at_decision
