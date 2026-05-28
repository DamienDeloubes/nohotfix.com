<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.2.0

Bump rationale: MINOR — added "Mandatory Per-Feature Deliverables" section enforcing
  domain error classes, OTel span instrumentation, and error-path unit tests as explicit
  trackable tasks. Updated all three templates to surface these requirements at generation
  time. No principles removed or redefined incompatibly.

Added sections:
  - "Mandatory Per-Feature Deliverables": codifies domain errors, OTel spans, and
    error-path tests as non-optional deliverables that MUST appear in tasks.md.

Modified principles: None (existing OTel and error taxonomy rules in Performance &
  Reliability Standards and Principle II remain unchanged; new section makes them
  actionable at the task level).

Templates status:
  ✅ .specify/memory/constitution.md — updated to v1.2.0
  ✅ .specify/templates/plan-template.md — Added rows VI (Domain Errors) and VII
     (Observability/OTel) to Constitution Check table
  ✅ .specify/templates/spec-template.md — Added standing NFR-ERR and NFR-OBS
     non-functional requirements block
  ✅ .specify/templates/tasks-template.md — Added error code + OTel tasks in Phase 2
     (Foundational) and verification tasks in Phase N (Polish)

Follow-up TODOs: None.
-->

# NoHotfix Constitution

## Core Principles

### I. Bounded Context Integrity

The five DDD bounded contexts — **Identity**, **Billing**, **Authoring**, **Execution**,
and **Audit** — MUST remain architecturally separate. Each is an independent package under
`packages/domains/<context>/` (e.g., `packages/domains/execution/`).

- Domain packages NEVER import from each other. This rule is enforced by ESLint import
  restrictions in `tooling/eslint/` and by `package.json` dependencies — domain packages
  declare ONLY `@nohotfix/shared` and `zod` as direct dependencies. No `@nohotfix/db`,
  Fastify, Kysely, pg, Stripe SDK, AWS SDK, or other infrastructure libraries.
- Cross-context communication MUST use exactly one of two mechanisms:
  1. **Domain events** (async): domain packages define event types; the API event bus in
     `apps/api/src/event-bus.ts` wires handlers. Events cross context boundaries; direct
     calls do not.
  2. **API-layer orchestration** (sync): route handlers in `apps/api/src/routes/` coordinate
     calls across multiple domain use cases when a single request spans contexts.
- Each domain package exposes exactly two public entry points:
  - `@nohotfix/domain-<ctx>` — domain logic (entities, services, use cases, ports, errors)
  - `@nohotfix/domain-<ctx>/ui` — React components and TanStack Query hooks
- Consumer import rules MUST be respected:
  - `apps/api` imports from `@nohotfix/domain-*/` (logic only; NEVER `/ui`)
  - `apps/app` imports from both `@nohotfix/domain-*/` and `@nohotfix/domain-*/ui`
  - A domain package's `ui/` subpath MAY import from its own root entry point; the reverse
    is never true
- New features MUST be assigned to exactly one primary context before implementation begins.
  Ambiguous context ownership is a design defect, not an implementation detail.
- Shared types, Zod schemas, and error codes MUST live in `packages/shared`; domain logic
  MUST NOT leak into the shared package.

**Rationale**: Context isolation ensures each domain evolves, is tested, and is audited
independently. Infrastructure-free domain packages enable pure unit tests and frontend reuse
of domain logic. In a compliance-grade platform, a poorly bounded context makes it impossible
to reason about what changed, when, and why.

### II. Code Quality & Simplicity

Code MUST be the minimum necessary to satisfy the defined requirement. Complexity not justified
by a concrete current need is a defect. The architecture pattern is Hexagonal (Ports and
Adapters): domain logic has zero knowledge of HTTP, databases, or infrastructure.

- **Hexagonal Architecture MUST be maintained**:
  - Domain packages (domain + application layers) MUST be transport-agnostic and
    infrastructure-agnostic. They export pure TypeScript functions and classes only.
  - Port interfaces (repository + infrastructure) MUST be defined in the domain package
    (`packages/domains/<ctx>/src/ports/`). Concrete implementations (Kysely adapters,
    SDK wrappers) live in `apps/api/src/adapters/`.
  - The composition root (`apps/api/src/composition-root.ts`) is the ONLY place that wires
    domain services with infrastructure adapters. It is created once at server startup.
  - HTTP status codes are assigned ONLY in `apps/api/src/shared/errors/` error handler.
    Domain packages know nothing about HTTP status codes.
- MUST follow YAGNI: no feature flags, backwards-compatibility shims, or abstractions
  for hypothetical future requirements.
- TypeScript `strict: true` MUST be enabled across all packages and apps.
  `verbatimModuleSyntax: true` enforces explicit `type` imports.
- All public API contracts MUST be typed with Zod schemas from `packages/shared`.
- Error codes MUST follow the taxonomy `DOMAIN_CATEGORY_SPECIFIC` defined in
  `packages/shared/src/errors/codes.ts`. Ad-hoc string errors are forbidden.
- Every tenant table query MUST include `org_id` in the WHERE clause. Cross-organisation
  queries are a critical security defect.
- **Import conventions**:
  - Named exports exclusively — no default exports (exception: Fastify plugins)
  - Always use explicit `.js` file extensions in TypeScript source imports
  - No circular imports — enforced via ESLint `import/no-cycle`
- **Naming conventions** (non-negotiable):
  - Directories and `.ts` files: `kebab-case`
  - React component files: `PascalCase.tsx`
  - Test files: colocated as `<name>.spec.ts`
  - Types and interfaces: `PascalCase`
  - Constants: `SCREAMING_SNAKE_CASE`
  - Database columns and tables: `snake_case`
- Secrets MUST be validated via Zod at process startup in `apps/api/src/config.ts`.
  Hardcoded secrets or unvalidated environment variables are a blocking defect.
- Three similar lines of code is acceptable; a premature abstraction is not. Helpers
  and utilities MUST only be created when used in three or more distinct locations.

**Rationale**: Infrastructure-free domain logic is independently testable, reusable across
frontend and backend, and auditable without framework knowledge. NoHotfix operates in
compliance-sensitive environments — code that is traceable and predictable is a product
quality requirement, not a preference.

### III. Testing Discipline

Enforcement is the core product promise. Tests that do not verify enforcement provide false
confidence and MUST be treated as absent coverage.

**Three-layer test pyramid:**

- **Unit tests** (Vitest, colocated as `*.spec.ts`):
  - Domain package tests MUST be pure — no HTTP, no database connections, no external
    services. Port interfaces MUST be mocked or stubbed.
  - The `RunStateMachine` and `SpecStateMachine` MUST have unit tests for every valid
    transition AND every invalid transition (asserting rejection).
  - `ArtifactGateService` evaluation logic MUST be unit-tested for all artifact types
    (file, table, measured value, URL) and boundary conditions.
  - `DecisionService` MUST have tests verifying that Go-with-failures rejects without
    justification and accepts with justification.
- **Integration tests** (Vitest, in `apps/api/src/__tests__/`):
  - API route handlers MUST have integration tests covering the happy path and all primary
    error paths, including the `org_id` tenancy boundary.
  - The immutability guard MUST be tested by attempting a mutation against a run in each
    terminal state (`go`, `no_go`, `abandoned`) and asserting HTTP 403.
  - Stripe webhook handling MUST have integration tests for idempotency (duplicate event
    rejection) and signature failure.
- **E2E tests** (Playwright, in `apps/app-e2e/` and `apps/web-e2e/`):
  - Critical user journeys MUST have E2E coverage: spec execution → artifact upload →
    pass/fail → go/no-go decision.
  - Auth flows (login, invite acceptance) MUST have E2E coverage in `apps/web-e2e/`.
- Tests MUST be written before or alongside implementation — not after — for all
  enforcement-critical paths.
- `--passWithNoTests` is acceptable only during initial project scaffolding. Once a
  domain module is non-empty, it MUST have tests.
- Test setups that bypass artifact requirements to simplify test data are forbidden.

**Rationale**: If a unit test can bypass enforcement to make assertions easier, it cannot
verify that enforcement is intact. Tests must be adversarial toward enforcement logic. The
three-layer pyramid ensures domain logic is pure, API contracts are tested end-to-end, and
user-critical paths are validated in a real browser.

### IV. User Experience Consistency

All screens MUST follow consistent interaction patterns across all five bounded-context UIs.
The `apps/app` React SPA is a thin composition shell — route files MUST import domain UI
components and compose them into pages; business logic MUST NOT live in route files.

- **Architecture rules:**
  - Domain-specific React components and TanStack Query hooks MUST live in
    `packages/domains/<ctx>/src/ui/`. They MUST NOT live in `apps/app/src/`.
  - App-global, domain-agnostic UI primitives (Button, Dialog, Table, Badge) live in
    `apps/app/src/components/ui/` (shadcn/ui, source-installed).
  - Layout components (Sidebar, Header, AppShell) live in `apps/app/src/components/layout/`.
  - Route files in `apps/app/src/routes/` compose domain components into pages with
    minimal custom JSX.
- Role-based route guards MUST be applied at the TanStack Router route level via `beforeLoad`,
  not only at the API level. Admin-only routes MUST redirect Members before render.
- Every destructive or irreversible action MUST present a confirmation step. No silent
  destructive operations.
- All terminal states (run completed, spec failed, section skipped, decision recorded)
  MUST be visually distinct from editable states. Edit affordances MUST NOT be rendered
  on immutable data.
- Error states MUST surface the specific `DOMAIN_CATEGORY_SPECIFIC` error code and a
  plain-language recovery action. Silent failures are forbidden.
- Loading states MUST be present on every async operation. Stale data MUST NOT be
  displayed without a visible refresh indicator.
- Forms MUST validate inline with field-level errors. Redirect-on-failure without
  field-level context is forbidden.
- **Query key centralisation (NON-NEGOTIABLE)**: All TanStack Query `queryKey` values and
  mutation `invalidateKeys` MUST be defined as factory functions in
  `apps/app/src/api/query-keys.ts`, organised by bounded context and aggregate. Inline
  string-literal query keys in hooks or components are forbidden. Domain UI hooks
  (`packages/domains/<ctx>/src/ui/hooks/`) MUST accept `queryKey` (and `invalidateKeys`
  for mutations) as parameters — they MUST NOT hardcode keys, because domain packages
  cannot import from `apps/app`. Route files in `apps/app/src/routes/` pass the
  centralised key factories to domain hooks at call-site.
- **Polling intervals MUST follow this table** (no deviation without a constitutional amendment):

| View                           | Polling Interval | Rationale                                     |
| ------------------------------ | ---------------- | --------------------------------------------- |
| Run overview (specs, progress) | 5 seconds        | Concurrent tester updates need near-real-time |
| Dashboard active runs          | 10 seconds       | Less time-critical than spec-level updates    |
| Run history list               | No polling       | On-demand fetch only                          |
| Playbook editor                | No polling       | Single-author assumption in v1                |

**Rationale**: NoHotfix's users are QA leads and release managers under release pressure.
An inconsistent UI creates uncertainty about whether the enforcement mechanism is reliable.
UX consistency is a trust signal as much as a usability concern.

### V. Run Immutability & Audit Integrity (NON-NEGOTIABLE)

Once a go/no-go decision is recorded, the run and all its artifacts are permanently locked.
This guarantee is the core product differentiator and MUST never be compromised for any
reason, including admin convenience or debugging urgency.

- **3-layer immutability enforcement — all three layers MUST be present:**
  1. **Middleware** (`apps/api/src/shared/middleware/immutability-guard.ts`): A Fastify
     `preHandler` hook applied to all write routes under `/api/runs/*`. Rejects writes to
     runs in terminal status before the handler executes. This is the PRIMARY enforcement.
  2. **Service layer**: Domain services (`DecisionService`, `ArtifactGateService`, etc.)
     independently verify run state before mutations. This is a SECONDARY failsafe.
  3. **Database trigger** (planned): A PostgreSQL trigger on `run_specs` and
     `run_spec_artifacts` that prevents UPDATE/INSERT when the parent run is terminal.
- No edit endpoint MAY exist for any field of a completed run, its sections, specs, or
  artifacts. The absence of a mutation endpoint is the primary guarantee.
- A Go decision on a run containing failed specs MUST require a written `decisionStatement`.
  The API MUST return `EXEC_DECISION_JUSTIFICATION_REQUIRED` if it is absent or empty.
- Run history views MUST render from snapshotted run data, not from live playbook data.
  A run reflects the playbook state at the instant `StartRun` was called.
- The `SnapshotService` MUST deep-copy the entire playbook within a single database
  transaction. A partial snapshot is an invalid state; if the transaction fails, the run
  MUST NOT be created (`ROLLBACK` and surface `SYS_DATABASE`).
- The `changelog` table is append-only. No UPDATE or DELETE operations MAY target it.
- The `failedSpecsAtDecision` JSONB column MUST be populated at decision time with a
  snapshot of all failed specs — this is the tamper-evident evidence record.

**Rationale**: Without tamper-evident, immutable audit records, NoHotfix is a checklist
tool with a nice UI. Compliance auditors and enterprise customers depend on this guarantee
absolutely. Any relaxation — even temporary — undermines the entire value proposition.

## Performance & Reliability Standards

The platform MUST remain responsive under normal B2B SaaS load. Performance regressions in
critical paths are treated as defects against the product's reliability guarantee.

- API read endpoints MUST respond within **500ms p95** under normal load (SLI target from
  `nohotfix.api.latency` metric).
- API write endpoints MUST respond within **1000ms p95** under normal load.
- The run snapshot operation MUST complete within **2000ms p99**. It MUST execute within
  a single database transaction; timeouts MUST surface `SYS_DATABASE` not a partial result.
- Presigned URL generation MUST complete within **200ms p99**.
- Database query latency MUST remain below **100ms p95**. Queries exceeding this threshold
  MUST emit an OTel span annotation for review.
- The SPA MUST achieve a Largest Contentful Paint (LCP) under **2.5 seconds** on a
  simulated 4G connection.
- Presigned PUT uploads MUST use browser-direct-to-storage (DigitalOcean Spaces). Upload
  traffic MUST NOT route through the API server.
- Sentry MUST capture all `DomainError` instances with `statusCode >= 500`. `DomainError.code`
  MUST be the Sentry fingerprint. Silent error swallowing is a defect.
- OTel MUST emit traces for all HTTP requests, all database queries, and manual span
  instrumentation on `SnapshotService.deepCopy`, `ArtifactGateService.evaluate`, and
  `DecisionService.record`.
- Database queries MUST include `org_id` to prevent full-table scans across tenant data.
  Cross-tenant query patterns are simultaneously a security defect and a performance defect.

## Development Workflow & Quality Gates

All non-trivial features MUST follow the speckit workflow before implementation begins.
Skipping design artifacts to ship faster is not acceptable.

- Every feature MUST have an approved `spec.md` before a branch is created.
- Every feature MUST have an approved `plan.md` with a passing Constitution Check before
  implementation tasks begin.
- The Constitution Check in `plan.md` MUST verify all five principles:
  1. Bounded context assignment identified; no cross-domain imports; dual entry-point
     consumer rules respected.
  2. Complexity justified; Hexagonal Architecture maintained; naming conventions respected.
  3. Test tasks included for enforcement-critical paths across all three test layers.
  4. Terminal states read-only; polling intervals from the IV table observed; role guards
     at route level.
  5. Immutability guard applied at middleware level if feature touches run data; all 3
     layers addressed.
- No PR may be merged with failing TypeScript type checks, linting violations, or test
  suite failures.
- Database migrations MUST be additive in v1. Destructive schema changes require an
  explicit approval and a documented rollback plan.
- The CI pipeline (`.github/workflows/ci.yml`) MUST pass on every PR before merge.
  Bypassing CI with `--no-verify` or equivalent is a policy violation.
- All `org_id` tenancy boundaries MUST be reviewed explicitly in code review for any PR
  that adds or modifies a database query.
- ADR decisions documented in `docs/development/coding-architecture.md` MUST be respected unless a
  new ADR is formally ratified and the constitution is amended accordingly.

## Governance

This constitution supersedes all other development practices. When any convention, team
habit, or tooling default conflicts with this document, this document wins.

**Amendment procedure**:

1. Document the rationale: which principle is changing and why.
2. Bump the version according to semantic versioning:
   - **MAJOR**: Removing or fundamentally redefining an existing principle in a
     backwards-incompatible way (e.g., relaxing the immutability guarantee, removing a
     bounded context).
   - **MINOR**: Adding a new principle, adding material non-negotiable rules to an existing
     principle, or correcting structurally significant errors in paths or targets.
   - **PATCH**: Clarifications, wording improvements, or non-semantic refinements that do
     not change the intent or enforceability of any principle.
3. Update all dependent templates (`plan-template.md`, `spec-template.md`,
   `tasks-template.md`) to reflect structural changes.
4. Review by at least one additional team member before merging to `main`.

**Compliance review**: All PRs and code reviews MUST explicitly verify:

- Bounded context integrity: no cross-domain imports; domain packages contain no
  infrastructure dependencies.
- Hexagonal Architecture: domain logic is infrastructure-agnostic; composition root is
  the sole wiring point.
- Immutability guard present at middleware level on all endpoints touching run data.
- Test coverage for all enforcement-critical paths introduced or modified.
- `org_id` tenancy boundary present in all new database queries.

## Mandatory Per-Feature Deliverables

Every feature MUST include these as explicit, trackable tasks — they are never implied or optional:

1. **Domain error classes** in `packages/domains/<ctx>/src/errors/` with error codes registered in `packages/shared/src/errors/codes.ts` following the `DOMAIN_CATEGORY_SPECIFIC` taxonomy. Ad-hoc string errors are forbidden.
2. **OTel span instrumentation** on all new service methods and database queries. Follow the span naming patterns established by `SnapshotService.deepCopy`, `ArtifactGateService.evaluate`, and `DecisionService.record`. DB queries exceeding 100ms MUST emit a span annotation.
3. **Unit tests** asserting correct error codes are thrown for each error path (not just happy-path coverage).

These deliverables MUST appear as discrete tasks in `tasks.md` and be verified in the Constitution Check during `/speckit.plan`.

Runtime development guidance for agents is in `docs/helpfull-claude.md`.

**Version**: 1.2.0 | **Ratified**: 2026-03-04 | **Last Amended**: 2026-03-06
