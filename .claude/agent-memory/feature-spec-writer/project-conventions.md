# Project Conventions

## Feature numbering
- Sequential, zero-padded to 3 digits: 001, 002, ... 024
- Current highest: 023-edit-spec (as of 2026-03-11)
- Next available: 024

## File locations
- Feature spec docs: `docs/development/features/must-have/<feature-name>.md` or `should-have/`
- Spec task files live in: `specs/<NNN>-<feature-name>/spec.md`
- Spec directories also contain: tasks.md, plan.md, data-model.md, research.md, quickstart.md, checklists/, contracts/

## Spec doc format (feature docs)
Four sections, in order:
1. `# Feature description` — problem, scope, out of scope
2. `# How the feature should work for the user` — step-by-step journey per entry point
3. `# Happy paths` — numbered list of successful scenarios
4. `# Unhappy paths and edge cases` — numbered list with how the system handles each

## Spec task file format (specs/<NNN>/spec.md)
Includes: Feature Branch, Created, Status, Input, Clarifications, User Scenarios & Testing,
Requirements (NFR + FR), Key Entities, Success Criteria, Assumptions.
User stories have Priority (P1/P2/P3), Independent Test description, and Acceptance Scenarios in Given/When/Then format.

## Route conventions
- Spec library: `/:orgSlug/spec-library`
- Spec detail: `/:orgSlug/spec-library/:specId`
- Edit spec: `/:orgSlug/spec-library/:specId/edit`
- New spec: `/:orgSlug/spec-library/new`

## Terminology
- Use "playbook", "playbook section", "playbook spec" — NOT "chapter"
- Use "admin or owner" when describing edit/write permissions — NOT just "admin"
- Use "member" for read-only role
- Spec Library entries live in the `spec_library` table
- When a spec is added to a playbook it becomes a `playbook_spec` entry (linked via `spec_library_id`)
