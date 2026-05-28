# Database Design -- NoHotfix v1

_Extracted from [docs/development/technical-architecture.md](./technical-architecture.md). See also: [Domain Architecture](./domain-architecture.md) for bounded context details, [Backend Architecture](./backend-architecture.md) for repository adapter patterns._

---

## Entity-Relationship Overview

The database consists of **14 core tables plus 1 changelog table**, organized around the 5 DDD bounded contexts:

| Bounded Context | Tables                                                             | Purpose                                                     |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| **Identity**    | `organisations`, `users`, `memberships`                            | User management, org structure, role-based access           |
| **Billing**     | `subscriptions`, `stripe_webhook_events`                           | Subscription lifecycle, Stripe integration, idempotency     |
| **Authoring**   | `spec_library`, `playbooks`, `playbook_sections`, `playbook_specs` | Playbook templates, spec library, section/spec structure    |
| **Execution**   | `runs`, `run_sections`, `run_specs`, `run_spec_artifacts`          | Active runs, spec execution, artifact collection, decisions |
| **Audit**       | `changelog`                                                        | Change tracking for playbooks and library specs             |

Every tenant-scoped table includes an `org_id` column. All queries mandate `org_id` in the WHERE clause -- enforced by the repository layer.

**Key files:**

- Schema types: `packages/db/src/schema.ts`
- Migration files: `packages/db/src/migrations/001_initial_schema.ts`
- Seed data: `packages/db/src/seeds/demo-playbook.ts`
- Kysely client factory: `packages/db/src/client.ts`

---

## ER Diagram

```mermaid
erDiagram
    organisations {
        uuid id PK
        text name
        timestamptz created_at
        timestamptz updated_at
    }

    users {
        uuid id PK
        text workos_user_id UK
        text email
        text display_name
        timestamptz created_at
        timestamptz updated_at
    }

    memberships {
        uuid id PK
        uuid org_id FK
        uuid user_id FK
        text role "admin | member"
        timestamptz created_at
    }

    subscriptions {
        uuid id PK
        uuid org_id FK UK
        text stripe_customer_id
        text stripe_subscription_id
        text status "trialing | grace_period | past_due | active | cancelled | expired"
        timestamptz trial_ends_at
        timestamptz current_period_start
        timestamptz current_period_end
        timestamptz cancel_at
        timestamptz created_at
        timestamptz updated_at
    }

    stripe_webhook_events {
        uuid id PK
        text stripe_event_id UK
        text event_type
        timestamptz processed_at
        timestamptz created_at
    }

    spec_library {
        uuid id PK
        uuid org_id FK
        text title
        text system_under_test
        text severity "critical | high | medium | low"
        jsonb preconditions "TipTap rich text"
        jsonb description "TipTap rich text"
        jsonb test_steps "array of step objects"
        jsonb expected_result "TipTap rich text"
        jsonb artifact_requirements "array of requirement definitions"
        text tester_notes
        boolean is_archived
        uuid created_by FK
        timestamptz created_at
        timestamptz updated_at
    }

    playbooks {
        uuid id PK
        uuid org_id FK
        text name
        text description
        text environment
        boolean is_archived
        uuid created_by FK
        timestamptz created_at
        timestamptz updated_at
    }

    playbook_sections {
        uuid id PK
        uuid playbook_id FK
        uuid org_id FK
        text name
        integer position
        timestamptz created_at
    }

    playbook_specs {
        uuid id PK
        uuid section_id FK
        uuid playbook_id FK
        uuid org_id FK
        uuid spec_library_id FK "nullable, NULL when detached"
        text title
        text system_under_test
        text severity "critical | high | medium | low"
        jsonb preconditions "TipTap rich text"
        jsonb description "TipTap rich text"
        jsonb test_steps "array of step objects"
        jsonb expected_result "TipTap rich text"
        jsonb artifact_requirements "array of requirement definitions"
        text tester_notes
        integer position
        timestamptz created_at
    }

    runs {
        uuid id PK
        uuid org_id FK
        uuid playbook_id FK "reference only"
        text name
        text description
        text environment
        text status "in_progress | awaiting_decision | go | no_go | abandoned"
        timestamptz target_date
        uuid started_by FK
        uuid decision_by FK
        timestamptz decision_at
        text decision_statement
        jsonb failed_specs_at_decision "array of spec summaries"
        text abandonment_reason
        timestamptz started_at
        timestamptz completed_at
        timestamptz created_at
    }

    run_sections {
        uuid id PK
        uuid run_id FK
        uuid org_id FK
        text name
        integer position
        uuid assigned_to FK "nullable"
        boolean is_skipped
        text skip_reason
        uuid skipped_by FK
        timestamptz skipped_at
    }

    run_specs {
        uuid id PK
        uuid run_section_id FK
        uuid run_id FK
        uuid org_id FK
        text title
        text system_under_test
        text severity "critical | high | medium | low"
        jsonb preconditions "snapshot from library"
        jsonb description "snapshot from library"
        jsonb test_steps "snapshot from library"
        jsonb expected_result "snapshot from library"
        jsonb artifact_requirements "snapshot of requirement definitions"
        text tester_notes
        text status "pending | in_progress | passed | failed | skipped"
        uuid claimed_by FK
        uuid executed_by FK
        timestamptz executed_at
        text failure_reason
        text skip_reason
        text notes
        integer position
    }

    run_spec_artifacts {
        uuid id PK
        uuid run_spec_id FK
        uuid run_id FK
        uuid org_id FK
        integer requirement_index
        text type "file | table | measured_value | url"
        text file_key "S3 object key"
        text file_name
        text file_type "MIME type"
        integer file_size "bytes"
        jsonb table_data "structured table rows and columns"
        numeric measured_value
        text measured_unit
        text measured_threshold_operator "lte | gte | eq"
        numeric measured_threshold_value
        text url_value
        uuid uploaded_by FK
        timestamptz created_at
    }

    changelog {
        uuid id PK
        uuid org_id FK
        text entity_type "playbook | spec_library"
        uuid entity_id
        text action "created | updated | archived | duplicated | section_added | spec_added | etc"
        jsonb field_changes "previous/new value pairs"
        uuid actor_id FK
        text actor_name "denormalized for read performance"
        timestamptz created_at
    }

    organisations ||--o{ memberships : "has"
    users ||--o{ memberships : "belongs to"
    organisations ||--o| subscriptions : "has"
    organisations ||--o{ spec_library : "owns"
    organisations ||--o{ playbooks : "owns"
    playbooks ||--o{ playbook_sections : "contains"
    playbook_sections ||--o{ playbook_specs : "contains"
    spec_library |o--o{ playbook_specs : "optionally linked from"
    organisations ||--o{ runs : "owns"
    runs ||--o{ run_sections : "contains"
    run_sections ||--o{ run_specs : "contains"
    run_specs ||--o{ run_spec_artifacts : "has"
    organisations ||--o{ changelog : "owns"
```

---

## Table Definitions

### Identity Context

#### `organisations`

The root tenant entity. Every other tenant-scoped table references an organisation.

| Column       | Type          | Constraints             | Notes |
| ------------ | ------------- | ----------------------- | ----- |
| `id`         | `uuid`        | PK, generated           |       |
| `name`       | `text`        | NOT NULL                |       |
| `created_at` | `timestamptz` | NOT NULL, default now() |       |
| `updated_at` | `timestamptz` | NOT NULL, default now() |       |

#### `users`

Represents a user synced from WorkOS. Created on first JWT encounter via `SyncUserFromJWT`.

| Column           | Type          | Constraints      | Notes              |
| ---------------- | ------------- | ---------------- | ------------------ |
| `id`             | `uuid`        | PK, generated    |                    |
| `workos_user_id` | `text`        | UNIQUE, NOT NULL | WorkOS external ID |
| `email`          | `text`        | NOT NULL         |                    |
| `display_name`   | `text`        | nullable         |                    |
| `created_at`     | `timestamptz` | NOT NULL         |                    |
| `updated_at`     | `timestamptz` | NOT NULL         |                    |

#### `memberships`

Join table linking users to organisations with a role.

| Column       | Type          | Constraints                   | Notes               |
| ------------ | ------------- | ----------------------------- | ------------------- |
| `id`         | `uuid`        | PK, generated                 |                     |
| `org_id`     | `uuid`        | FK -> organisations, NOT NULL |                     |
| `user_id`    | `uuid`        | FK -> users, NOT NULL         |                     |
| `role`       | `text`        | NOT NULL                      | `admin` or `member` |
| `created_at` | `timestamptz` | NOT NULL                      |                     |

**Constraint**: `(org_id, user_id)` is UNIQUE -- one membership per user per org.

### Billing Context

#### `subscriptions`

One subscription per org. Tracks Stripe subscription lifecycle.

| Column                   | Type          | Constraints                 | Notes                                                                    |
| ------------------------ | ------------- | --------------------------- | ------------------------------------------------------------------------ |
| `id`                     | `uuid`        | PK, generated               |                                                                          |
| `org_id`                 | `uuid`        | FK -> organisations, UNIQUE | One-to-one with org                                                      |
| `stripe_customer_id`     | `text`        | nullable                    | Set after Stripe checkout                                                |
| `stripe_subscription_id` | `text`        | nullable                    | Set after Stripe checkout                                                |
| `status`                 | `text`        | NOT NULL                    | `trialing`, `grace_period`, `past_due`, `active`, `cancelled`, `expired` |
| `trial_ends_at`          | `timestamptz` | nullable                    |                                                                          |
| `current_period_start`   | `timestamptz` | nullable                    |                                                                          |
| `current_period_end`     | `timestamptz` | nullable                    |                                                                          |
| `cancel_at`              | `timestamptz` | nullable                    |                                                                          |
| `created_at`             | `timestamptz` | NOT NULL                    |                                                                          |
| `updated_at`             | `timestamptz` | NOT NULL                    |                                                                          |

**State machine**: `trialing -> grace_period -> past_due -> active -> cancelled -> expired`

#### `stripe_webhook_events`

Idempotency table for Stripe webhook deduplication.

| Column            | Type          | Constraints      | Notes                              |
| ----------------- | ------------- | ---------------- | ---------------------------------- |
| `id`              | `uuid`        | PK, generated    |                                    |
| `stripe_event_id` | `text`        | UNIQUE, NOT NULL | Stripe's event ID                  |
| `event_type`      | `text`        | NOT NULL         | e.g., `checkout.session.completed` |
| `processed_at`    | `timestamptz` | nullable         | NULL = not yet processed           |
| `created_at`      | `timestamptz` | NOT NULL         |                                    |

### Authoring Context

#### `spec_library`

The shared spec template library. Specs can be linked into multiple playbooks.

| Column                  | Type          | Constraints             | Notes                                        |
| ----------------------- | ------------- | ----------------------- | -------------------------------------------- |
| `id`                    | `uuid`        | PK, generated           |                                              |
| `org_id`                | `uuid`        | FK -> organisations     |                                              |
| `title`                 | `text`        | NOT NULL                |                                              |
| `system_under_test`     | `text`        | nullable                |                                              |
| `severity`              | `text`        | nullable                | `critical`, `high`, `medium`, `low`          |
| `preconditions`         | `jsonb`       | nullable                | TipTap rich text JSON                        |
| `description`           | `jsonb`       | nullable                | TipTap rich text JSON                        |
| `test_steps`            | `jsonb`       | nullable                | Array of `{ instruction, expected_outcome }` |
| `expected_result`       | `jsonb`       | nullable                | TipTap rich text JSON                        |
| `artifact_requirements` | `jsonb`       | nullable                | Array of polymorphic requirement definitions |
| `tester_notes`          | `text`        | nullable                |                                              |
| `is_archived`           | `boolean`     | NOT NULL, default false | Soft delete flag                             |
| `created_by`            | `uuid`        | FK -> users             |                                              |
| `created_at`            | `timestamptz` | NOT NULL                |                                              |
| `updated_at`            | `timestamptz` | NOT NULL                |                                              |

#### `playbooks`

Release playbook templates. Archived playbooks remain for historical run references.

| Column        | Type          | Constraints             | Notes                         |
| ------------- | ------------- | ----------------------- | ----------------------------- |
| `id`          | `uuid`        | PK, generated           |                               |
| `org_id`      | `uuid`        | FK -> organisations     |                               |
| `name`        | `text`        | NOT NULL                |                               |
| `description` | `text`        | nullable                |                               |
| `environment` | `text`        | nullable                | e.g., `staging`, `production` |
| `is_archived` | `boolean`     | NOT NULL, default false | Soft delete flag              |
| `created_by`  | `uuid`        | FK -> users             |                               |
| `created_at`  | `timestamptz` | NOT NULL                |                               |
| `updated_at`  | `timestamptz` | NOT NULL                |                               |

#### `playbook_sections`

Ordered sections within a playbook template.

| Column        | Type          | Constraints         | Notes                 |
| ------------- | ------------- | ------------------- | --------------------- |
| `id`          | `uuid`        | PK, generated       |                       |
| `playbook_id` | `uuid`        | FK -> playbooks     |                       |
| `org_id`      | `uuid`        | FK -> organisations |                       |
| `name`        | `text`        | NOT NULL            |                       |
| `position`    | `integer`     | NOT NULL            | Zero-indexed ordering |
| `created_at`  | `timestamptz` | NOT NULL            |                       |

#### `playbook_specs`

Specs placed within a playbook section. Can be linked to the library or detached ("Keep local").

| Column                  | Type          | Constraints                  | Notes                                |
| ----------------------- | ------------- | ---------------------------- | ------------------------------------ |
| `id`                    | `uuid`        | PK, generated                |                                      |
| `section_id`            | `uuid`        | FK -> playbook_sections      |                                      |
| `playbook_id`           | `uuid`        | FK -> playbooks              | Denormalized for query convenience   |
| `org_id`                | `uuid`        | FK -> organisations          |                                      |
| `spec_library_id`       | `uuid`        | FK -> spec_library, nullable | NULL = detached via "Keep local"     |
| `title`                 | `text`        | NOT NULL                     |                                      |
| `system_under_test`     | `text`        | nullable                     |                                      |
| `severity`              | `text`        | nullable                     | `critical`, `high`, `medium`, `low`  |
| `preconditions`         | `jsonb`       | nullable                     | TipTap rich text JSON                |
| `description`           | `jsonb`       | nullable                     | TipTap rich text JSON                |
| `test_steps`            | `jsonb`       | nullable                     | Array of step objects                |
| `expected_result`       | `jsonb`       | nullable                     | TipTap rich text JSON                |
| `artifact_requirements` | `jsonb`       | nullable                     | Array of requirement definitions     |
| `tester_notes`          | `text`        | nullable                     |                                      |
| `position`              | `integer`     | NOT NULL                     | Zero-indexed ordering within section |
| `created_at`            | `timestamptz` | NOT NULL                     |                                      |

**Detach behavior**: When `spec_library_id` is set, content columns are populated from the library entry. When NULL (detached via "Keep local"), content columns hold the independent copy. No `overrides` JSONB column -- see ADR-008 in [technical-architecture.md](./technical-architecture.md).

### Execution Context

#### `runs`

A run is a snapshot of a playbook at a point in time. Immutable after reaching a terminal state.

| Column                     | Type          | Constraints           | Notes                                                          |
| -------------------------- | ------------- | --------------------- | -------------------------------------------------------------- |
| `id`                       | `uuid`        | PK, generated         |                                                                |
| `org_id`                   | `uuid`        | FK -> organisations   |                                                                |
| `playbook_id`              | `uuid`        | FK -> playbooks       | Reference only -- run is decoupled                             |
| `name`                     | `text`        | NOT NULL              |                                                                |
| `description`              | `text`        | nullable              |                                                                |
| `environment`              | `text`        | nullable              |                                                                |
| `status`                   | `text`        | NOT NULL              | `in_progress`, `awaiting_decision`, `go`, `no_go`, `abandoned` |
| `target_date`              | `timestamptz` | nullable              |                                                                |
| `started_by`               | `uuid`        | FK -> users           |                                                                |
| `decision_by`              | `uuid`        | FK -> users, nullable |                                                                |
| `decision_at`              | `timestamptz` | nullable              |                                                                |
| `decision_statement`       | `text`        | nullable              | Justification text                                             |
| `failed_specs_at_decision` | `jsonb`       | nullable              | Snapshot of failed specs at Go decision                        |
| `abandonment_reason`       | `text`        | nullable              |                                                                |
| `started_at`               | `timestamptz` | NOT NULL              |                                                                |
| `completed_at`             | `timestamptz` | nullable              |                                                                |
| `created_at`               | `timestamptz` | NOT NULL              |                                                                |

**Run state machine**: `in_progress -> awaiting_decision -> go | no_go` or `in_progress -> abandoned`. Terminal states (`go`, `no_go`, `abandoned`) are irreversible.

#### `run_sections`

Snapshot of playbook sections within a run.

| Column        | Type          | Constraints             | Notes                        |
| ------------- | ------------- | ----------------------- | ---------------------------- |
| `id`          | `uuid`        | PK, generated           |                              |
| `run_id`      | `uuid`        | FK -> runs              |                              |
| `org_id`      | `uuid`        | FK -> organisations     |                              |
| `name`        | `text`        | NOT NULL                |                              |
| `position`    | `integer`     | NOT NULL                |                              |
| `assigned_to` | `uuid`        | FK -> users, nullable   | Section-level pre-assignment |
| `is_skipped`  | `boolean`     | NOT NULL, default false |                              |
| `skip_reason` | `text`        | nullable                |                              |
| `skipped_by`  | `uuid`        | FK -> users, nullable   |                              |
| `skipped_at`  | `timestamptz` | nullable                |                              |

#### `run_specs`

Snapshot of playbook specs within a run. Status tracks execution progress.

| Column                  | Type          | Constraints           | Notes                                                   |
| ----------------------- | ------------- | --------------------- | ------------------------------------------------------- |
| `id`                    | `uuid`        | PK, generated         |                                                         |
| `run_section_id`        | `uuid`        | FK -> run_sections    |                                                         |
| `run_id`                | `uuid`        | FK -> runs            | Denormalized for direct run queries                     |
| `org_id`                | `uuid`        | FK -> organisations   |                                                         |
| `title`                 | `text`        | NOT NULL              | Snapshot from playbook                                  |
| `system_under_test`     | `text`        | nullable              |                                                         |
| `severity`              | `text`        | nullable              | `critical`, `high`, `medium`, `low`                     |
| `preconditions`         | `jsonb`       | nullable              | Snapshot from library                                   |
| `description`           | `jsonb`       | nullable              | Snapshot from library                                   |
| `test_steps`            | `jsonb`       | nullable              | Snapshot from library                                   |
| `expected_result`       | `jsonb`       | nullable              | Snapshot from library                                   |
| `artifact_requirements` | `jsonb`       | nullable              | Snapshot of requirement definitions                     |
| `tester_notes`          | `text`        | nullable              |                                                         |
| `status`                | `text`        | NOT NULL              | `pending`, `in_progress`, `passed`, `failed`, `skipped` |
| `claimed_by`            | `uuid`        | FK -> users, nullable | Attribution metadata                                    |
| `executed_by`           | `uuid`        | FK -> users, nullable |                                                         |
| `executed_at`           | `timestamptz` | nullable              |                                                         |
| `failure_reason`        | `text`        | nullable              | Required when status = `failed`                         |
| `skip_reason`           | `text`        | nullable              | Required when status = `skipped`                        |
| `notes`                 | `text`        | nullable              | Tester notes during execution                           |
| `position`              | `integer`     | NOT NULL              |                                                         |

**Spec state machine**: `pending -> in_progress -> passed | failed | skipped`. Terminal states are irreversible.

#### `run_spec_artifacts`

Artifact evidence attached to a run spec. Polymorphic by `type`.

| Column                        | Type          | Constraints         | Notes                                     |
| ----------------------------- | ------------- | ------------------- | ----------------------------------------- |
| `id`                          | `uuid`        | PK, generated       |                                           |
| `run_spec_id`                 | `uuid`        | FK -> run_specs     |                                           |
| `run_id`                      | `uuid`        | FK -> runs          | Denormalized                              |
| `org_id`                      | `uuid`        | FK -> organisations |                                           |
| `requirement_index`           | `integer`     | NOT NULL            | Maps to artifact_requirements array index |
| `type`                        | `text`        | NOT NULL            | `file`, `table`, `measured_value`, `url`  |
| `file_key`                    | `text`        | nullable            | S3 object key (type=file)                 |
| `file_name`                   | `text`        | nullable            | Original filename (type=file)             |
| `file_type`                   | `text`        | nullable            | MIME type (type=file)                     |
| `file_size`                   | `integer`     | nullable            | Bytes (type=file)                         |
| `table_data`                  | `jsonb`       | nullable            | Structured table rows (type=table)        |
| `measured_value`              | `numeric`     | nullable            | (type=measured_value)                     |
| `measured_unit`               | `text`        | nullable            | (type=measured_value)                     |
| `measured_threshold_operator` | `text`        | nullable            | `lte`, `gte`, `eq` (type=measured_value)  |
| `measured_threshold_value`    | `numeric`     | nullable            | (type=measured_value)                     |
| `url_value`                   | `text`        | nullable            | (type=url)                                |
| `uploaded_by`                 | `uuid`        | FK -> users         |                                           |
| `created_at`                  | `timestamptz` | NOT NULL            |                                           |

### Audit Context

#### `changelog`

Append-only change log for playbook templates and library specs.

| Column          | Type          | Constraints         | Notes                                                                 |
| --------------- | ------------- | ------------------- | --------------------------------------------------------------------- |
| `id`            | `uuid`        | PK, generated       |                                                                       |
| `org_id`        | `uuid`        | FK -> organisations |                                                                       |
| `entity_type`   | `text`        | NOT NULL            | `playbook` or `spec_library`                                          |
| `entity_id`     | `uuid`        | NOT NULL            | References the entity being tracked                                   |
| `action`        | `text`        | NOT NULL            | `created`, `updated`, `archived`, `duplicated`, `section_added`, etc. |
| `field_changes` | `jsonb`       | nullable            | `{ field: { old, new } }` pairs                                       |
| `actor_id`      | `uuid`        | FK -> users         |                                                                       |
| `actor_name`    | `text`        | NOT NULL            | Denormalized for read performance                                     |
| `created_at`    | `timestamptz` | NOT NULL            |                                                                       |

---

## Multi-Tenancy Strategy

Every tenant-scoped table includes an `org_id UUID NOT NULL` column with a foreign key to `organisations.id`. This column is:

1. **Set on insert**: Always populated from `request.orgContext.orgId` (resolved by `orgScopeMiddleware`) in the route handler, passed to the use case, and forwarded to the repository adapter.
2. **Filtered on read**: Every query includes `WHERE org_id = $orgId` -- enforced by repository port interfaces that require `orgId` as a parameter.
3. **Indexed**: Every table has a composite index starting with `org_id`.

There is no row-level security (RLS) in v1. Tenant isolation is enforced at the application layer via the repository pattern -- both at the domain port level (interface requires `orgId`) and at the adapter level (Kysely query always includes the filter).

_Rationale_: Application-level enforcement is sufficient for v1 and avoids the operational complexity of PostgreSQL RLS policies. RLS can be added as a defense-in-depth layer in v2 without schema changes.

---

## Migration Strategy

Migrations are managed by Kysely's built-in migration system. Migration files live in `packages/db/src/migrations/` with numbered prefixes:

```
packages/db/src/migrations/
|-- 001_initial_schema.ts
|-- 002_add_changelog_table.ts
|-- 003_add_run_target_date.ts
```

**Conventions:**

- Migrations are TypeScript files exporting `up()` and `down()` functions
- Raw SQL is permitted in migration files (the only place raw SQL is allowed in the entire codebase)
- Every migration is idempotent where possible (use `IF NOT EXISTS`, `IF EXISTS`)
- Destructive migrations (dropping columns/tables) require a two-phase approach: deprecate in one release, remove in the next
- Migrations run as part of the deployment pipeline (`turbo run db:migrate`), before the new application version starts
- The `db:migrate` task in `turbo.json` is configured with `"cache": false` because it mutates external state

---

## Indexing Strategy

| Table                   | Index                      | Columns                                             | Rationale                                                       |
| ----------------------- | -------------------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| `memberships`           | `idx_memberships_org`      | `(org_id, user_id)` UNIQUE                          | Fast membership lookup, enforce one membership per user per org |
| `memberships`           | `idx_memberships_user`     | `(user_id)`                                         | Lookup all orgs for a user (org switcher)                       |
| `subscriptions`         | `idx_subscriptions_org`    | `(org_id)` UNIQUE                                   | One subscription per org, fast lookup for subscription guard    |
| `stripe_webhook_events` | `idx_stripe_events_id`     | `(stripe_event_id)` UNIQUE                          | Idempotency check on webhook receipt                            |
| `spec_library`          | `idx_specs_org`            | `(org_id, is_archived)`                             | Library browse filtered by active specs                         |
| `spec_library`          | `idx_specs_org_title`      | `(org_id, title)` using GIN trigram                 | Full-text search on spec titles                                 |
| `playbooks`             | `idx_playbooks_org`        | `(org_id, is_archived)`                             | Playbook list filtered by active                                |
| `playbook_sections`     | `idx_pb_sections_playbook` | `(playbook_id, position)`                           | Ordered section fetch                                           |
| `playbook_specs`        | `idx_pb_specs_section`     | `(section_id, position)`                            | Ordered spec fetch within section                               |
| `playbook_specs`        | `idx_pb_specs_library`     | `(spec_library_id)`                                 | Sync propagation: find all chapters using a library spec        |
| `runs`                  | `idx_runs_org_status`      | `(org_id, status)`                                  | Active runs list, history list filtered by status               |
| `runs`                  | `idx_runs_org_created`     | `(org_id, created_at DESC)`                         | History list sorted by date                                     |
| `run_sections`          | `idx_run_sections_run`     | `(run_id, position)`                                | Ordered section fetch for a run                                 |
| `run_specs`             | `idx_run_specs_section`    | `(run_section_id, position)`                        | Ordered spec fetch within a run section                         |
| `run_specs`             | `idx_run_specs_run_status` | `(run_id, status)`                                  | Count specs by status (progress bar, awaiting_decision check)   |
| `run_spec_artifacts`    | `idx_artifacts_spec`       | `(run_spec_id)`                                     | Fetch all artifacts for a spec                                  |
| `changelog`             | `idx_changelog_entity`     | `(org_id, entity_type, entity_id, created_at DESC)` | Changelog fetch for a specific entity                           |

---

## JSONB Usage Decisions

| Column                     | Table(s)                                      | Content                                                      | Justification                                                                                                                                                                            |
| -------------------------- | --------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preconditions`            | `spec_library`, `playbook_specs`, `run_specs` | TipTap rich text JSON                                        | Rich text requires a structured document format. TipTap's JSON is the canonical representation. Querying rich text content is not a use case -- it is always fetched and rendered whole. |
| `description`              | `spec_library`, `playbook_specs`, `run_specs` | TipTap rich text JSON                                        | Same as preconditions.                                                                                                                                                                   |
| `expected_result`          | `spec_library`, `playbook_specs`, `run_specs` | TipTap rich text JSON                                        | Same as preconditions.                                                                                                                                                                   |
| `test_steps`               | `spec_library`, `playbook_specs`, `run_specs` | Array of `{ instruction, expected_outcome }` objects         | Steps are an ordered list of structured objects. Modeling as a separate table would add join complexity for a field that is always fetched and rendered as a unit.                       |
| `artifact_requirements`    | `spec_library`, `playbook_specs`, `run_specs` | Array of requirement definition objects                      | Each requirement has a polymorphic schema (file config, table schema, value config, URL config). JSONB avoids a complex polymorphic table hierarchy.                                     |
| `table_data`               | `run_spec_artifacts`                          | Array of row objects matching the admin-defined table schema | User-entered structured data. Schema varies per spec. Relational modeling would require dynamic table creation. JSONB is the natural fit.                                                |
| `field_changes`            | `changelog`                                   | `{ field: { old, new } }` pairs                              | Schema varies per action type. Relational modeling would require one row per field change. JSONB keeps changelog entries self-contained.                                                 |
| `failed_specs_at_decision` | `runs`                                        | Array of `{ specId, title, severity, failureReason }`        | Snapshot of failed specs at the moment of a Go decision. Denormalized for the compliance receipt -- ensures the audit record is self-contained.                                          |

---

## Soft-Delete vs. Hard-Delete Decisions

| Entity                                            | Strategy                    | Rationale                                                                                                     |
| ------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `organisations`                                   | No delete in v1             | Deletion requires data retention policy (out of scope)                                                        |
| `users`                                           | No delete in v1             | Same as organisations                                                                                         |
| `memberships`                                     | Hard delete                 | Removing a member deletes their membership row. Attribution in existing runs uses denormalized user name.     |
| `subscriptions`                                   | No delete                   | Subscription records are updated (status transitions), never deleted                                          |
| `stripe_webhook_events`                           | No delete                   | Retained for idempotency and debugging                                                                        |
| `spec_library`                                    | Soft delete (`is_archived`) | Archived specs must remain for existing playbook links and historical runs. Never hard-deleted.               |
| `playbooks`                                       | Soft delete (`is_archived`) | Archived playbooks must remain for run history references. Never hard-deleted.                                |
| `playbook_sections`                               | Hard delete                 | Sections can be deleted from a template. This does not affect snapshotted runs.                               |
| `playbook_specs`                                  | Hard delete                 | Removing a spec from a section deletes the link. The library entry persists.                                  |
| `runs`                                            | No delete, no soft-delete   | Runs in terminal state are immutable forever. Runs in progress can be abandoned (state change, not deletion). |
| `run_sections`, `run_specs`, `run_spec_artifacts` | No delete                   | Part of the immutable run record. Never deleted or modified after terminal state.                             |
| `changelog`                                       | No delete                   | Append-only by design. Never deleted.                                                                         |

---

## Future Considerations

**Data retention and GDPR.** v1 does not implement a data retention policy for old runs. Runs in terminal state are immutable and retained indefinitely. When account deletion and GDPR compliance are addressed (post-v1), a retention policy for run records older than a configurable threshold (e.g., 7 years) will need to be designed. This is a known deferral, not an oversight.

**Row-Level Security.** RLS can be added as a defense-in-depth layer in v2 without schema changes, complementing the existing application-layer tenant isolation.

**Database trigger for immutability.** A planned PostgreSQL trigger on `run_specs` and `run_spec_artifacts` will prevent UPDATE/INSERT when the parent run is in a terminal state. This is the third layer of the 3-layer immutability enforcement (middleware + service + DB trigger). See [Backend Architecture](./backend-architecture.md) for details on the middleware and service layers.

---

## Kysely Schema Types

The TypeScript schema types are defined in `packages/db/src/schema.ts`. Each table has a corresponding interface (e.g., `RunsTable`), and convenience type aliases are provided for common operations:

```typescript
// packages/db/src/schema.ts (excerpt)
export interface Database {
  organisations: OrganisationsTable;
  users: UsersTable;
  memberships: MembershipsTable;
  subscriptions: SubscriptionsTable;
  stripe_webhook_events: StripeWebhookEventsTable;
  spec_library: SpecLibraryTable;
  playbooks: PlaybooksTable;
  playbook_sections: PlaybookSectionsTable;
  playbook_specs: PlaybookSpecsTable;
  runs: RunsTable;
  run_sections: RunSectionsTable;
  run_specs: RunSpecsTable;
  run_spec_artifacts: RunSpecArtifactsTable;
  changelog: ChangelogTable;
}

// Convenience type aliases per table
export type Run = Selectable<RunsTable>;
export type NewRun = Insertable<RunsTable>;
export type RunUpdate = Updateable<RunsTable>;
```

These types are consumed by the Kysely repository adapters in `apps/api/src/adapters/repositories/`. Domain packages define their own entity types in `packages/domains/<ctx>/src/types.ts` -- these are mapped to/from DB types in the adapter layer. See [Domain Architecture](./domain-architecture.md) for the domain entity definitions.
