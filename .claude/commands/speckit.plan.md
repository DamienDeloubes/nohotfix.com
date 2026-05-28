---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs: 
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/bash/setup-plan.sh --json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

   Also read `.claude/skills/code-architecture.md` and `.claude/skills/backend.md` to ensure architecture decisions in plan.md align with established project patterns:
   - Entity modeling must follow the entity/value-object/port pattern from `code-architecture.md` (private constructor, `create()`/`reconstitute()` factories, immutable mutations, ports in `src/ports/`)
   - Data model field types in `data-model.md` must be compatible with Kysely schema conventions from `backend.md` (`Generated<string>` for auto-UUID PKs, `ColumnType<Date, string | undefined, never>` for `created_at`, snake_case columns)
   - File structure proposals must respect the hexagonal architecture layout (domain logic in `packages/domains/{context}/`, adapters in `apps/api/src/adapters/`, composition root as sole wiring point)
   - API contract design must follow the route handler pattern from `backend.md` (Zod validation, OTel tracing, `preHandler` middleware arrays)

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update agent context by running the agent script
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

   If the plan involves any of the following, suggest diagram generation in the report:
   - **New entity relationships or data model changes**: "Consider running `/project:diagram.mermaid ERD for [feature name]` to visualize the data model"
   - **State machine additions or modifications**: "Consider running `/project:diagram.mermaid state diagram for [state machine name]` to visualize transitions"
   - **Multi-service or cross-context flows**: "Consider running `/project:diagram.mermaid sequence diagram for [flow name]` to visualize the interaction"
   - **Complex deployment or architecture changes**: "Consider running `/project:diagram.excalidraw architecture for [feature name]` for a visual overview"

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Define interface contracts** (if project has external interfaces) → `/contracts/`:
   - Identify what interfaces the project exposes to users or other systems
   - Document the contract format appropriate for the project type
   - Examples: public APIs for libraries, command schemas for CLI tools, endpoints for web services, grammars for parsers, UI contracts for applications
   - Skip if project is purely internal (build scripts, one-off tools, etc.)

3. **Agent context update**:
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new technology from current plan
   - Preserve manual additions between markers

**Output**: data-model.md, /contracts/*, quickstart.md, agent-specific file

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications
