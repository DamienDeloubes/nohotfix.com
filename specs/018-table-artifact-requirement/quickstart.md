# Quickstart: Table Artifact Requirement

**Feature**: 018-table-artifact-requirement
**Date**: 2026-03-10

## Prerequisites

- Node.js 20+, pnpm
- `pnpm install` from repo root
- No database migration required

## Implementation Order

### 1. Shared Schemas (packages/shared)

1. **`packages/shared/src/schemas/specs.ts`** — Add `MeasuredValueUnitSchema`, `TableColumnDefSchema`, `CellValueSchema`, `TableArtifactRequirementSchema`, and their response counterparts. Add to both discriminated unions.
2. **`packages/shared/src/types/index.ts`** — Export `TableArtifactRequirement`, `TableColumnDef`, `MeasuredValueUnit`, `CellValue` types.

### 2. Domain Value Objects (packages/domains/authoring)

3. **`packages/domains/authoring/src/entities/value-objects/table-column-def.ts`** — NEW. Column definition value object with `create()`, `reconstitute()`, `toJson()`, `equals()`. Validates name (1-100 chars), type, readOnly (text/number only), unit (measured_value required), tolerancePercentage (measured_value only, positive).
4. **`packages/domains/authoring/src/entities/value-objects/table-artifact-requirement.ts`** — NEW. Table artifact value object with `create()`, `reconstitute()`, `toJson()`, `equals()`, `toString()`. Validates columns (1-5), rows (1-50), cell-column consistency. Uses `ArtifactLabel` and `ArtifactDescription` for label/description.
5. **`packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts`** — MODIFY. Add `'table'` case to the type discriminator in `create()`.
6. **Export** from domain package index.

### 3. Unit Tests

7. **`packages/domains/authoring/src/entities/__tests__/table-column-def.test.ts`** — NEW. Test create for all four column types, readOnly validation (only text/number), unit validation (required for measured_value), tolerancePercentage (positive only), name boundaries (1-100 chars), toJson, equals.
8. **`packages/domains/authoring/src/entities/__tests__/table-artifact-requirement.test.ts`** — NEW. Test create with various column/row combinations, cell-column consistency validation, boundary tests (1/5 columns, 1/50 rows), row cell count mismatch rejection, read-only cell validation, measured_value expectedValue required, toJson, equals, toString.
9. **`packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts`** — MODIFY. Add table-type tests: single table, mixed types (all five), table in 10-item array.

### 4. Frontend Form

10. **`packages/domains/authoring/src/ui/components/TableArtifactForm.tsx`** — NEW. The most complex artifact form component:
    - Label input (200 char counter) + description textarea (1000 char counter) + required toggle
    - Column management: add column, configure type/name/readOnly/unit/tolerance, reorder, remove. Max 5 columns.
    - Row management: add row, edit cell values per column type, reorder, remove. Max 50 rows.
    - Inline table editor showing columns as headers and rows as editable cells.
    - Placeholder text: label "e.g. API endpoint load times", description "e.g. Measure response times for all critical endpoints".
11. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx`** — MODIFY. Add "Table" to `ARTIFACT_TYPE_LABELS`, add `TableArtifactFormData` to `ArtifactFormData` union, add conditional render branch for `type === 'table'`, add "+ Table" button.
12. **`packages/domains/authoring/src/ui/components/CreateSpecForm.tsx`** — MODIFY. Update type assertion to include `'table'`. Update payload mapping to include `columns` and `rows` for table type.

### 5. Frontend Display

13. **`packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx`** — MODIFY. Add "Table" badge (purple/violet). Add table preview rendering: read-only HTML table showing column headers (with type indicators and units for measured_value) and all row data. Visually distinguish read-only cells from fillable placeholders.

## Verification

```bash
# Type check
pnpm turbo run typecheck

# Unit tests
pnpm --filter @nohotfix/domain-authoring test

# Full build
pnpm turbo run build
```

## Key Files Reference

| File | Action | Pattern Source |
|------|--------|---------------|
| `packages/shared/src/schemas/specs.ts` | Modify | `TextArtifactRequirementSchema` |
| `packages/shared/src/types/index.ts` | Modify | `TextArtifactRequirement` export |
| `packages/domains/authoring/src/entities/value-objects/table-column-def.ts` | Create | New — no direct equivalent |
| `packages/domains/authoring/src/entities/value-objects/table-artifact-requirement.ts` | Create | `text-artifact-requirement.ts` (extended) |
| `packages/domains/authoring/src/entities/value-objects/artifact-requirements.ts` | Modify | `'text'` case |
| `packages/domains/authoring/src/entities/__tests__/table-column-def.test.ts` | Create | New — column-specific tests |
| `packages/domains/authoring/src/entities/__tests__/table-artifact-requirement.test.ts` | Create | `text-artifact-requirement.test.ts` (extended) |
| `packages/domains/authoring/src/entities/__tests__/artifact-requirements.test.ts` | Modify | Text type tests |
| `packages/domains/authoring/src/ui/components/TableArtifactForm.tsx` | Create | `TextArtifactForm.tsx` (significantly extended) |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsList.tsx` | Modify | URL button pattern |
| `packages/domains/authoring/src/ui/components/ArtifactRequirementsDisplay.tsx` | Modify | URL badge pattern |
| `packages/domains/authoring/src/ui/components/CreateSpecForm.tsx` | Modify | Type assertion + payload |
