# Research: Managed Environments

**Branch**: `021-managed-environments` | **Date**: 2026-03-11

## R1: Bounded Context Assignment

**Decision**: Assign to **Identity** context (`packages/domains/identity/`).

**Rationale**: Environments are org-level configuration, sitting alongside org name, slug, and membership settings. They are managed on a settings page (`/:orgSlug/settings/environments`) consistent with other Identity-owned settings pages. While consumed by Authoring (playbooks) and Execution (runs), the ownership and lifecycle of environments is an organisational concern.

**Alternatives considered**:
- **Authoring**: environments are primarily consumed by playbooks, but they're also consumed by runs (Execution). Placing in Authoring would create a cross-domain dependency from Execution → Authoring, which violates Principle I.
- **New context**: overhead not justified for a simple CRUD entity with no complex domain logic.

## R2: Position Management Strategy for Reordering

**Decision**: Use a **full-rewrite position update** — on reorder, send the full ordered list of environment IDs from the frontend; the backend updates all positions in a single transaction.

**Rationale**: The number of environments per org is small (typically 3-10, max ~20). A full-rewrite approach is simple, avoids fractional position drift, and eliminates the need for gap-filling algorithms. The overhead of updating 10-20 rows is negligible.

**Alternatives considered**:
- **Fractional positions** (e.g., insert between 1.0 and 2.0 as 1.5): adds complexity, requires periodic renumbering, not justified for small lists.
- **Linked-list ordering**: complex to implement, no benefit at this scale.

## R3: Case-Insensitive Uniqueness Enforcement

**Decision**: Enforce at both application layer (value object validation with `.toLowerCase()` comparison) and database layer (functional unique index on `LOWER(name)`).

**Rationale**: Double enforcement prevents race conditions where two concurrent requests create environments with differently-cased names. The DB unique index is the authoritative guarantee; the application layer provides fast feedback.

## R4: Default Seeding for Existing Organisations

**Decision**: The database migration that creates the `environments` table also seeds defaults for all existing organisations in a single INSERT...SELECT statement.

**Rationale**: Keeps seeding atomic with table creation. No application-level seeding logic needed for existing orgs. New orgs are seeded by the `createOrganisation` use case (adding environment creation to its existing flow).

## R5: Delete Guard — Determining "Active" Runs

**Decision**: For this feature, the delete guard checks only playbooks (`playbooks.environment_id`). The `runs` table does not yet have an `environment_id` FK column — it uses a freeform `environment` TEXT field populated at snapshot time. Active run checks will be added when the run creation feature introduces `environment_id` on the runs table.

**Rationale**: Per clarification session — terminal runs should not block deletion (historical records). However, since runs don't reference environments by ID yet, the entire runs check is deferred. Only playbook references are checked in this feature.
