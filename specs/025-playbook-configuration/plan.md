# Implementation Plan: Playbook & Sections Configuration

**Branch**: `025-playbook-configuration` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/025-playbook-configuration/spec.md`

## Summary

Implement the full playbook authoring experience: creating playbooks, organising them with sections, and populating them with specs from the spec library. This is a CRUD-heavy feature within the **Authoring** bounded context. The database tables, Kysely types, Zod schemas, query keys, port interfaces, and route stubs already exist — implementation fills in the stubs across all layers (repositories → use cases → API routes → UI hooks → React components). One migration is required to make `section_id` nullable on `playbook_specs` (supporting ungrouped specs).

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20
**Primary Dependencies**: Fastify 5, Kysely, TanStack Router + Query, React, Zod, @dnd-kit
**Storage**: PostgreSQL (existing tables: `playbooks`, `playbook_sections`, `playbook_specs`; migration required: nullable `section_id`)
**Testing**: Vitest (unit + integration), Playwright (E2E — optional for this feature)
**Target Platform**: Web (SPA + API)
**Project Type**: Web service (monorepo: `apps/api` + `apps/app` + domain packages)
**Performance Goals**: API reads <500ms p95, search picker <300ms perceived latency, editor responsive with 10 sections / 100 specs
**Constraints**: `org_id` on all queries; no polling on playbook editor (constitution IV)
**Scale/Scope**: ~15 API endpoints, ~10 use cases, 3 repository implementations, ~8 UI components, ~6 hooks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Primary context: **Authoring** (`packages/domains/authoring/`). No cross-domain imports. Domain package depends only on `@nohotfix/shared` + `zod`. UI hooks in `packages/domains/authoring/src/ui/`. Route files in `apps/app` compose domain UI. API routes in `apps/api/src/routes/authoring.ts`. | ✅ |
| II | **Code Quality & Simplicity** — Hexagonal architecture: use cases are pure functions with `Deps`+`Command` interfaces; repositories implement domain ports; composition root wires adapters. Named exports. `org_id` on every query. Error taxonomy for all error paths. No HTTP status codes in domain code. | ✅ |
| III | **Testing Discipline** — Unit tests for all use cases (create/update/delete/reorder playbook, section, spec) covering happy + error paths. Integration tests for API routes covering CRUD + role guard + `org_id` boundary. No state machines or immutability to test in this feature. | ✅ |
| IV | **UX Consistency** — Role guard at TanStack Router `beforeLoad` for editor + create routes (admin/owner only). No polling (constitution: "Playbook editor — No polling — Single-author assumption in v1"). Domain UI in `packages/domains/authoring/src/ui/`. Query keys centralised in `apps/app/src/api/query-keys.ts` (already exist). Domain hooks accept `queryKey`/`invalidateKeys` params. | ✅ |
| V | **Run Immutability** — Feature does NOT touch run data. Playbooks are authoring artifacts, not execution artifacts. N/A. | ✅ N/A |
| VI | **Domain Errors** — New error codes: `AUTHOR_SECTION_NOT_FOUND`, `AUTHOR_PLAYBOOK_NAME_INVALID`, `AUTHOR_PLAYBOOK_SPEC_DUPLICATE`. Registered in `packages/shared/src/errors/codes.ts`. Error classes in `packages/domains/authoring/src/errors/`. Unit tests assert correct codes. | ✅ |
| VII | **Observability (OTel)** — Route handlers auto-instrumented by `@fastify/otel`. Custom span attributes via `getSpan(request)` on playbook routes (playbook.id, section.id, org.slug). No manual `startActiveSpan` needed — use `getSpan()` pattern from backend skill. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/025-playbook-configuration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-endpoints.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/db/src/
  migrations/
    007_nullable_playbook_spec_section_id.ts   # NEW: ALTER section_id DROP NOT NULL
  schema.ts                                    # UPDATE: section_id: string | null

packages/shared/src/
  errors/codes.ts                              # UPDATE: add 3 new AUTHOR_* codes
  schemas/playbooks.ts                         # UPDATE: add ReorderSectionsRequestSchema, ReorderSpecsRequestSchema, AddSpecFromLibraryRequestSchema

packages/domains/authoring/src/
  types.ts                                     # UPDATE: PlaybookSpec.sectionId → string | null; add PlaybookWithCounts type
  ports/
    playbook-repository.ts                     # UPDATE: add findByOrgWithCounts()
    playbook-section-repository.ts             # (no changes needed)
    playbook-spec-repository.ts                # UPDATE: add findByPlaybook(), findUngrouped(), updatePositions(), existsInPlaybook()
  use-cases/
    create-playbook.ts                         # IMPLEMENT (stub → real)
    update-playbook.ts                         # IMPLEMENT (stub → real)
    create-section.ts                          # IMPLEMENT (stub → real)
    update-section.ts                          # IMPLEMENT (stub → real)
    delete-section.ts                          # IMPLEMENT (stub → real)
    reorder-sections.ts                        # IMPLEMENT (stub → real)
    add-spec-to-section.ts                     # IMPLEMENT (stub → real) — also handles ungrouped
    remove-spec-from-section.ts                # IMPLEMENT (stub → real)
    reorder-specs.ts                           # NEW: reorder specs within zone
  errors/index.ts                              # UPDATE: add new error classes
  ui/
    hooks/
      useCreatePlaybook.ts                     # NEW
      useUpdatePlaybook.ts                     # NEW
      usePlaybookList.ts                       # NEW
      usePlaybookDetail.ts                     # NEW
      useCreateSection.ts                      # NEW
      useUpdateSection.ts                      # NEW
      useDeleteSection.ts                      # NEW
      useReorderSections.ts                    # NEW
      useAddSpecToPlaybook.ts                  # NEW
      useRemoveSpecFromPlaybook.ts             # NEW
      useReorderSpecs.ts                       # NEW
      useSpecLibrarySearch.ts                  # NEW (search picker data)
    components/
      PlaybookListTable.tsx                    # NEW
      PlaybookListEmptyState.tsx               # NEW
      CreatePlaybookForm.tsx                   # NEW
      PlaybookEditor.tsx                       # NEW (main editor layout)
      PlaybookEditorHeader.tsx                 # NEW (inline-editable metadata)
      SectionCard.tsx                          # NEW (section with specs)
      SpecRow.tsx                              # NEW (spec row in editor)
      SpecLibraryPicker.tsx                    # NEW (search picker modal)

apps/api/src/
  adapters/repositories/
    kysely-playbook-repository.ts              # IMPLEMENT (stub → real)
    kysely-playbook-section-repository.ts      # IMPLEMENT (stub → real)
    kysely-playbook-spec-repository.ts         # IMPLEMENT (stub → real)
  shared/lib/
    with-transaction.ts                        # UPDATE: add playbook repos to TransactionalRoot
  routes/
    authoring.ts                               # IMPLEMENT: replace 501 stubs with real handlers

apps/app/src/
  routes/_authenticated/$orgSlug/playbooks/
    index.tsx                                  # IMPLEMENT (stub → list page)
    new.tsx                                    # IMPLEMENT (stub → create form)
    $playbookId.tsx                            # IMPLEMENT (stub → editor page)
```

**Structure Decision**: Follows existing monorepo hexagonal architecture. All new code fits existing directory structure — domain logic in `packages/domains/authoring/`, adapters in `apps/api/src/adapters/`, routes in `apps/api/src/routes/authoring.ts`, UI hooks/components in `packages/domains/authoring/src/ui/`, route pages in `apps/app/src/routes/`.

## Complexity Tracking

> No constitution violations. All patterns align with existing architecture.
