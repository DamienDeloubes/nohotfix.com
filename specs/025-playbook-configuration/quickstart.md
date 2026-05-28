# Quickstart: Playbook & Sections Configuration

**Branch**: `025-playbook-configuration` | **Date**: 2026-03-11

## Prerequisites

1. PostgreSQL running (via `docker-compose up -d`)
2. `pnpm install` completed
3. `.env` configured (or `.env.local` files in `apps/api` and `apps/app`)

## Migration

Run migration 007 to make `section_id` nullable:

```bash
pnpm --filter db migrate
```

## Key Files to Modify (implementation order)

### 1. Schema & Types (foundation)

| File | Action |
|------|--------|
| `packages/db/src/migrations/007_nullable_playbook_spec_section_id.ts` | CREATE |
| `packages/db/src/schema.ts` | UPDATE `section_id: string \| null` |
| `packages/shared/src/errors/codes.ts` | ADD 3 error codes |
| `packages/shared/src/schemas/playbooks.ts` | ADD 3 new Zod schemas |
| `packages/domains/authoring/src/types.ts` | UPDATE `sectionId: string \| null`, ADD `PlaybookWithCounts` |

### 2. Domain Layer (ports + use cases + errors)

| File | Action |
|------|--------|
| `packages/domains/authoring/src/errors/index.ts` | ADD 3 error classes |
| `packages/domains/authoring/src/ports/playbook-repository.ts` | ADD `findByOrgWithCounts` |
| `packages/domains/authoring/src/ports/playbook-spec-repository.ts` | ADD 5 methods |
| `packages/domains/authoring/src/use-cases/create-playbook.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/update-playbook.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/create-section.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/update-section.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/delete-section.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/reorder-sections.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/add-spec-to-section.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/remove-spec-from-section.ts` | IMPLEMENT |
| `packages/domains/authoring/src/use-cases/reorder-specs.ts` | CREATE |

### 3. Infrastructure Layer (adapters)

| File | Action |
|------|--------|
| `apps/api/src/adapters/repositories/kysely-playbook-repository.ts` | IMPLEMENT |
| `apps/api/src/adapters/repositories/kysely-playbook-section-repository.ts` | IMPLEMENT |
| `apps/api/src/adapters/repositories/kysely-playbook-spec-repository.ts` | IMPLEMENT |
| `apps/api/src/shared/lib/with-transaction.ts` | ADD playbook repos |
| `apps/api/src/composition-root.ts` | VERIFY wiring (already done) |

### 4. API Routes

| File | Action |
|------|--------|
| `apps/api/src/routes/authoring.ts` | IMPLEMENT playbook route stubs (lines ~335-354) |

### 5. Frontend Hooks

| File | Action |
|------|--------|
| `packages/domains/authoring/src/ui/hooks/usePlaybookList.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/usePlaybookDetail.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useCreatePlaybook.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useUpdatePlaybook.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useCreateSection.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useUpdateSection.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useDeleteSection.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useReorderSections.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useAddSpecToPlaybook.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useRemoveSpecFromPlaybook.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useReorderSpecs.ts` | CREATE |
| `packages/domains/authoring/src/ui/hooks/useSpecLibrarySearch.ts` | CREATE |

### 6. Frontend Components

| File | Action |
|------|--------|
| `packages/domains/authoring/src/ui/components/PlaybookListTable.tsx` | CREATE |
| `packages/domains/authoring/src/ui/components/PlaybookListEmptyState.tsx` | CREATE |
| `packages/domains/authoring/src/ui/components/CreatePlaybookForm.tsx` | CREATE |
| `packages/domains/authoring/src/ui/components/PlaybookEditor.tsx` | CREATE |
| `packages/domains/authoring/src/ui/components/PlaybookEditorHeader.tsx` | CREATE |
| `packages/domains/authoring/src/ui/components/SectionCard.tsx` | CREATE |
| `packages/domains/authoring/src/ui/components/SpecRow.tsx` | CREATE |
| `packages/domains/authoring/src/ui/components/SpecLibraryPicker.tsx` | CREATE |

### 7. Frontend Routes (page composition)

| File | Action |
|------|--------|
| `apps/app/src/routes/_authenticated/$orgSlug/playbooks/index.tsx` | IMPLEMENT |
| `apps/app/src/routes/_authenticated/$orgSlug/playbooks/new.tsx` | IMPLEMENT |
| `apps/app/src/routes/_authenticated/$orgSlug/playbooks/$playbookId.tsx` | IMPLEMENT |

## Development Workflow

```bash
# Terminal 1: API
pnpm --filter api dev

# Terminal 2: App
pnpm --filter app dev

# Terminal 3: Tests (as you implement)
pnpm --filter authoring test -- --watch
pnpm --filter api test -- --watch

# Build check
pnpm turbo run build typecheck
```

## Testing Strategy

- **Unit tests** (colocated `*.test.ts` in domain package): All use cases with mocked ports
- **Integration tests** (`apps/api/src/__tests__/`): API routes with real DB
- **Manual testing**: Use the app to create playbooks, add sections/specs, verify DnD
