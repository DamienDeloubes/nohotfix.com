# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify all five principles from `.specify/memory/constitution.md`:

| # | Principle | Check |
|---|-----------|-------|
| I | **Bounded Context Integrity** — Feature assigned to one primary context; no cross-domain imports; domain pkg has no infrastructure deps (`@nohotfix/db`, Kysely, Stripe, etc.); dual entry-point consumer rules respected | ☐ |
| II | **Code Quality & Simplicity** — Hexagonal Architecture maintained (domain logic transport-agnostic); composition root is the wiring point; HTTP status codes only in API error handler; named exports; `org_id` on all tenant queries; error taxonomy used | ☐ |
| III | **Testing Discipline** — Unit tests cover state machine valid + invalid transitions and enforcement paths; integration tests cover happy path + `org_id` boundary + immutability guard; E2E coverage if user-critical path affected | ☐ |
| IV | **UX Consistency** — Terminal states read-only; role guards at TanStack Router `beforeLoad`; polling intervals per constitution table; domain UI lives in `packages/domains/<ctx>/src/ui/`, not in `apps/app`; query keys centralised in `apps/app/src/api/query-keys.ts` (no inline string keys); domain hooks accept `queryKey`/`invalidateKeys` as parameters | ☐ |
| V | **Run Immutability** — If feature touches run data: middleware guard present at Fastify route level; no edit endpoints on completed runs; Go-with-failures requires `decisionStatement`; snapshot in single transaction | ☐ |
| VI | **Domain Errors** — New error codes registered in `packages/shared/src/errors/codes.ts` following `DOMAIN_CATEGORY_SPECIFIC` taxonomy; domain error classes created in `packages/domains/<ctx>/src/errors/`; no ad-hoc string errors; unit tests assert correct error codes for each error path | ☐ |
| VII | **Observability (OTel)** — Manual OTel spans identified for all new service methods; DB query spans annotated; `SnapshotService`, `ArtifactGateService`, `DecisionService` patterns followed for span naming; slow-query annotation threshold (>100ms) respected | ☐ |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
