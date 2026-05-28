# Database — NoHotfix

TRIGGER: When asking about the database schema, planning a migration, adding/changing tables or columns, writing Kysely queries, or assessing database impact for a new feature.

## Stack

- PostgreSQL (DigitalOcean Managed, Frankfurt FRA1)
- Kysely (query builder, not ORM) — raw SQL for DDL, Kysely API for DML
- Extensions: `uuid-ossp` (UUID generation), `pg_trgm` (trigram text search)

## Key Files

- `packages/db/src/schema.ts` — Kysely `Database` interface (all table types)
- `packages/db/src/client.ts` — `createKyselyClient` factory
- `packages/db/src/index.ts` — public exports (types + client)
- `packages/db/src/migrations/` — numbered migrations (`001_`, `002_`, ...)
- `apps/api/src/adapters/repositories/` — Kysely repository implementations

## Schema (14 tables, 5 DDD contexts)

### Identity Context

**organisations** — tenant root
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | `uuid_generate_v4()` |
| name | TEXT NOT NULL | |
| slug | TEXT NOT NULL UNIQUE | added in migration 002 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

**users** — internal user record (synced from WorkOS)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | `uuid_generate_v4()` |
| workos_user_id | TEXT NOT NULL UNIQUE | WorkOS external ID |
| email | TEXT NOT NULL | |
| display_name | TEXT | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

**memberships** — org-user relationship
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | `uuid_generate_v4()` |
| org_id | UUID FK → organisations | |
| user_id | UUID FK → users | |
| role | TEXT CHECK | `'owner' \| 'admin' \| 'member'` |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| **Indexes** | | `UNIQUE(org_id, user_id)`, `INDEX(user_id)` |

### Billing Context

**subscriptions** — one per org
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK → organisations | UNIQUE |
| stripe_customer_id | TEXT | nullable |
| stripe_subscription_id | TEXT | nullable |
| status | TEXT CHECK | `'trialing' \| 'grace_period' \| 'past_due' \| 'active' \| 'cancelled' \| 'expired'` |
| trial_ends_at | TIMESTAMPTZ | nullable |
| current_period_start | TIMESTAMPTZ | nullable |
| current_period_end | TIMESTAMPTZ | nullable |
| cancel_at | TIMESTAMPTZ | nullable |
| created_at / updated_at | TIMESTAMPTZ | |
| **Indexes** | | `UNIQUE(org_id)` |

**stripe_webhook_events** — idempotency guard
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| stripe_event_id | TEXT NOT NULL UNIQUE | |
| event_type | TEXT NOT NULL | |
| processed_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | |

### Authoring Context

**spec_library** — reusable test spec templates
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK → organisations | |
| title | TEXT NOT NULL | trigram index for search |
| system_under_test | TEXT | nullable |
| severity | TEXT CHECK | `'critical' \| 'high' \| 'medium' \| 'low'` |
| preconditions | JSONB | TipTap rich text |
| description | JSONB | TipTap rich text |
| test_steps | JSONB | structured step array |
| expected_result | JSONB | TipTap rich text |
| artifact_requirements | JSONB | array of requirement objects |
| tester_notes | TEXT | nullable |
| is_archived | BOOLEAN | DEFAULT FALSE |
| created_by | UUID FK → users | |
| created_at / updated_at | TIMESTAMPTZ | |
| **Indexes** | | `INDEX(org_id, is_archived)`, `GIN(title gin_trgm_ops)` |

**playbooks** — collection of specs for a release
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK → organisations | |
| name | TEXT NOT NULL | |
| description | TEXT | nullable |
| environment | TEXT | nullable (e.g. "staging", "production") |
| is_archived | BOOLEAN | DEFAULT FALSE |
| created_by | UUID FK → users | |
| created_at / updated_at | TIMESTAMPTZ | |
| **Indexes** | | `INDEX(org_id, is_archived)` |

**playbook_sections** — ordered groups within a playbook
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| playbook_id | UUID FK → playbooks | ON DELETE CASCADE |
| org_id | UUID FK → organisations | |
| name | TEXT NOT NULL | |
| position | INTEGER NOT NULL | ordering |
| created_at | TIMESTAMPTZ | |
| **Indexes** | | `INDEX(playbook_id, position)` |

**playbook_specs** — specs embedded in a playbook section
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| section_id | UUID FK → playbook_sections | ON DELETE CASCADE |
| playbook_id | UUID FK → playbooks | |
| org_id | UUID FK → organisations | |
| spec_library_id | UUID FK → spec_library | nullable (link to template) |
| title, system_under_test, severity, preconditions, description, test_steps, expected_result, artifact_requirements, tester_notes | | same structure as spec_library |
| position | INTEGER NOT NULL | ordering within section |
| created_at | TIMESTAMPTZ | |
| **Indexes** | | `INDEX(section_id, position)`, `INDEX(spec_library_id)` |

### Execution Context

**runs** — a started execution of a playbook
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK → organisations | |
| playbook_id | UUID FK → playbooks | |
| name | TEXT NOT NULL | |
| description | TEXT | nullable |
| environment | TEXT | nullable |
| status | TEXT CHECK | `'in_progress' \| 'awaiting_decision' \| 'go' \| 'no_go' \| 'abandoned'` |
| target_date | TIMESTAMPTZ | nullable |
| started_by | UUID FK → users | |
| decision_by | UUID FK → users | nullable |
| decision_at | TIMESTAMPTZ | nullable |
| decision_statement | TEXT | nullable (justification) |
| failed_specs_at_decision | JSONB | snapshot of failed specs at decision time |
| abandonment_reason | TEXT | nullable |
| started_at | TIMESTAMPTZ | DEFAULT NOW() |
| completed_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | |
| **Indexes** | | `INDEX(org_id, status)`, `INDEX(org_id, created_at DESC)` |

**run_sections** — snapshot of playbook sections for a run
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| run_id | UUID FK → runs | |
| org_id | UUID FK → organisations | |
| name | TEXT NOT NULL | |
| position | INTEGER NOT NULL | |
| assigned_to | UUID FK → users | nullable |
| is_skipped | BOOLEAN | DEFAULT FALSE |
| skip_reason | TEXT | nullable |
| skipped_by | UUID FK → users | nullable |
| skipped_at | TIMESTAMPTZ | nullable |
| **Indexes** | | `INDEX(run_id, position)` |

**run_specs** — snapshot of specs for execution
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| run_section_id | UUID FK → run_sections | |
| run_id | UUID FK → runs | |
| org_id | UUID FK → organisations | |
| title, system_under_test, severity, preconditions, description, test_steps, expected_result, artifact_requirements, tester_notes | | deep-copied from playbook_specs |
| status | TEXT CHECK | `'pending' \| 'in_progress' \| 'passed' \| 'failed' \| 'skipped'` |
| claimed_by | UUID FK → users | nullable |
| executed_by | UUID FK → users | nullable |
| executed_at | TIMESTAMPTZ | nullable |
| failure_reason | TEXT | nullable |
| skip_reason | TEXT | nullable |
| notes | TEXT | nullable |
| position | INTEGER NOT NULL | |
| **Indexes** | | `INDEX(run_section_id, position)`, `INDEX(run_id, status)` |

**run_spec_artifacts** — evidence attached to a run spec
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| run_spec_id | UUID FK → run_specs | |
| run_id | UUID FK → runs | |
| org_id | UUID FK → organisations | |
| requirement_index | INTEGER NOT NULL | maps to artifact_requirements array index |
| type | TEXT CHECK | `'file' \| 'table' \| 'measured_value' \| 'url'` |
| file_key | TEXT | DO Spaces object key (for type=file) |
| file_name | TEXT | original filename |
| file_type | TEXT | MIME type |
| file_size | INTEGER | bytes |
| table_data | JSONB | structured table (for type=table) |
| measured_value | NUMERIC | (for type=measured_value) |
| measured_unit | TEXT | e.g. "ms", "%" |
| measured_threshold_operator | TEXT CHECK | `'lte' \| 'gte' \| 'eq'` |
| measured_threshold_value | NUMERIC | |
| url_value | TEXT | (for type=url) |
| uploaded_by | UUID FK → users | |
| created_at | TIMESTAMPTZ | |
| **Indexes** | | `INDEX(run_spec_id)` |

### Audit Context

**changelog** — audit trail for authoring changes
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK → organisations | |
| entity_type | TEXT CHECK | `'playbook' \| 'spec_library'` |
| entity_id | UUID NOT NULL | polymorphic FK |
| action | TEXT NOT NULL | e.g. "created", "updated", "archived" |
| field_changes | JSONB | `{ field: { old, new } }` diff |
| actor_id | UUID FK → users | |
| actor_name | TEXT NOT NULL | denormalized for display |
| created_at | TIMESTAMPTZ | |
| **Indexes** | | `INDEX(org_id, entity_type, entity_id, created_at DESC)` |

## Key Relationships & Patterns

### Tenant Isolation

Every table except `users` has an `org_id` column. ALL queries MUST include `org_id` in the WHERE clause (except cross-org user lookups by `workos_user_id`).

### Snapshot Pattern (Playbook → Run)

When a run starts, `SnapshotService` deep-copies the entire playbook hierarchy into run tables within a single transaction:

- `playbooks` → `runs` (name, description, environment copied)
- `playbook_sections` → `run_sections` (name, position copied)
- `playbook_specs` → `run_specs` (all spec fields deep-copied, status set to 'pending')

This ensures run data is immutable and decoupled from future playbook edits.

### Run Immutability

Runs in terminal states (`go`, `no_go`, `abandoned`) reject all writes. Enforced at 3 layers:

1. `immutability-guard.ts` middleware (API layer)
2. Service-level checks
3. Planned: DB trigger

### State Machines

**Run states**: `in_progress` → `awaiting_decision` → `go | no_go | abandoned`

- Auto-transitions to `awaiting_decision` when all specs reach a terminal status
- `abandoned` can be reached from `in_progress` or `awaiting_decision`

**Subscription states**: `trialing` → `grace_period` → `past_due` → `active` → `cancelled` → `expired`

**Spec statuses**: `pending` → `in_progress` → `passed | failed | skipped`

### JSONB Column Structures

**TipTap rich text** (preconditions, description, expected_result): Standard TipTap JSON document format with `type`, `content` array.

**test_steps**: Array of step objects — `[{ step: number, action: string, expected: string }]`

**artifact_requirements**: Array of requirement objects — `[{ index: number, type: 'text' | 'file' | 'table' | 'measured_value' | 'url', label: string, description: string | null, required: boolean }]`

**field_changes** (changelog): `{ fieldName: { old: any, new: any } }`

**failed_specs_at_decision** (runs): Array of spec summaries at decision time.

**table_data** (artifacts): `{ columns: string[], rows: string[][] }`

## Conventions

- **snake_case** for all table and column names
- **UUID** primary keys via `uuid_generate_v4()` (never application-generated)
- **TIMESTAMPTZ** for all dates (never plain TIMESTAMP)
- **TEXT** with CHECK constraints for enums (not PG enums — easier to migrate)
- **JSONB** for rich text, structured arrays, and flexible data
- **ON DELETE CASCADE** only on parent-child within same context (sections → specs)
- **No soft-delete on runs** — terminal state is permanent
- **Soft-delete via `is_archived`** on playbooks and spec_library

## Kysely Type Conventions (schema.ts)

- `Generated<string>` for auto-UUID primary keys
- `ColumnType<Date, string | undefined, never>` for `created_at` (read as Date, insert as optional string, never update)
- `ColumnType<Date, string | undefined, string>` for `updated_at` (read as Date, insert as optional string, update as string)
- `unknown` for JSONB columns (typed at the domain layer, not DB layer)
- Three convenience aliases per table: `Selectable<T>`, `Insertable<T>`, `Updateable<T>` (only where updates are needed)
- All types re-exported from `packages/db/src/index.ts`

## Migration Conventions

- File naming: `{NNN}_{snake_case_description}.ts` (e.g. `003_add_invitations.ts`)
- Use raw SQL via `sql` template tag (not Kysely schema builder) for all DDL
- Every migration has `up()` and `down()` functions
- Use `IF EXISTS` / `IF NOT EXISTS` for idempotency
- CHECK constraints named as `{table}_{column}_check` for predictable drops
- When adding columns to existing tables: add nullable → backfill → set NOT NULL → add indexes
- After creating migration: update `schema.ts` types, re-export from `index.ts`, run `pnpm --filter @nohotfix/db build`

## Impact Assessment Checklist

When planning a database change, consider:

1. **Schema**: Which tables/columns are added or modified?
2. **schema.ts**: Which table interfaces need updating? New convenience type aliases?
3. **index.ts**: Any new types to re-export?
4. **Repositories**: Which Kysely repositories in `apps/api/src/adapters/repositories/` need updating?
5. **Domain entities**: Do entities in `packages/domains/` need new fields or value objects?
6. **Use cases**: Which use cases read/write the affected tables?
7. **Zod schemas**: Do request/response schemas in `packages/shared/src/schemas/` need updating?
8. **Snapshot service**: If touching authoring tables, does the snapshot copy logic need updating?
9. **Immutability guard**: If touching execution tables, does the immutability check need updating?
10. **Tenant isolation**: Does the new table need `org_id`? Is it included in all queries?
