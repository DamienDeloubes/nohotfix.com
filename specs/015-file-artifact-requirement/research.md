# Research: File Artifact Requirement

## R-001: File Artifact Type — Schema Extension Pattern

**Decision**: Add `FileArtifactRequirementSchema` as a new variant in the existing `ArtifactRequirementSchema` discriminated union in `packages/shared/src/schemas/specs.ts`.

**Rationale**: Feature 014 established the discriminated union pattern on the `type` field specifically for this extensibility. Adding a new variant requires:
1. Define `FileArtifactRequirementSchema` with `type: z.literal('file')` + same base fields as text (label, description, required)
2. Add it to the `z.discriminatedUnion('type', [...])` array
3. Add `FileArtifactRequirementResponseSchema` for the response variant (with explicit index)

**Alternatives considered**:
- Separate schema file per artifact type: Rejected. All artifact schemas are small and tightly coupled; keeping them in `specs.ts` is simpler.
- Generic base schema with type override: Already in use (base fields are duplicated per variant in the discriminated union, which is the Zod-idiomatic approach).

## R-002: File Artifact Value Object — Domain Layer

**Decision**: Create `FileArtifactRequirement` VO in `packages/domains/authoring/src/entities/value-objects/file-artifact-requirement.ts` following the exact same pattern as `TextArtifactRequirement`.

**Rationale**: The file type has identical base fields (label via `ArtifactLabel` VO, description via `ArtifactDescription` VO, required boolean, index). The only difference is the `type` discriminator (`'file'` vs `'text'`). The VO composes the same value objects.

**Alternatives considered**:
- Shared base class with type parameter: Rejected per YAGNI. Two nearly-identical VOs (text + file) are clearer than a premature abstraction. If 3+ types follow this exact pattern, consider extracting a base at that point.

## R-003: ArtifactRequirements Collection — Type Dispatch

**Decision**: Update `ArtifactRequirements.create()` to accept `type: 'file'` and instantiate `FileArtifactRequirement` alongside the existing `type: 'text'` → `TextArtifactRequirement` dispatch.

**Rationale**: The collection VO is the single point that validates type discriminators and constructs type-specific VOs. Adding a new case to the switch/if is minimal and follows the existing pattern.

**Alternatives considered**:
- Factory registry pattern: Rejected per YAGNI. A switch with 2 cases is simpler than a registry.

## R-004: Frontend Form Component — FileArtifactForm

**Decision**: Create `FileArtifactForm.tsx` as a new component following the `TextArtifactForm.tsx` pattern, adding a static info note about system-enforced file constraints (10 MB max, allowed file types).

**Rationale**: The form fields are identical (label input, description textarea, required checkbox, character counters). The constraint note is a static `<p>` or info callout — not an interactive form field. Keeping it as a separate component (vs parameterizing TextArtifactForm) maintains clear separation per artifact type.

**Alternatives considered**:
- Parameterize TextArtifactForm with a `type` prop and conditional constraint note: Viable but couples two independent artifact types. Separate components are clearer and more maintainable as more types are added.

## R-005: Type Selector in ArtifactRequirementsList

**Decision**: Extend the "Add artifact requirement" control in `ArtifactRequirementsList.tsx` to offer both "Text" and "File" options. The existing implementation likely uses a button or dropdown — add "File" as a second option with an appropriate icon (e.g., file/paperclip icon from lucide-react).

**Rationale**: The type selector is the user's entry point for adding different artifact types. With two types now available, a dropdown/select or segmented button replaces the single-type "Add" flow.

**Alternatives considered**:
- Single "Add" button with post-creation type change: Rejected. Selecting the type upfront is more intuitive and matches the discriminated union data model.

## R-006: No New Error Codes Needed

**Decision**: Reuse existing error codes `AUTHOR_ARTIFACT_LABEL_INVALID` and `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID`.

**Rationale**: The file type uses the same validation rules as text (label 1-200 chars, description max 1,000 chars). The `ArtifactRequirements` collection already throws `AUTHOR_ARTIFACT_REQUIREMENTS_INVALID` for unknown types and max-limit violations. Adding 'file' as a recognized type means the existing error paths cover all file-specific validation.

**Alternatives considered**:
- New `AUTHOR_ARTIFACT_FILE_INVALID` code: Rejected. There are no file-type-specific validation rules at authoring time. File size/extension validation happens at execution time (upload), not authoring time.

## R-007: No Database Migration Required

**Decision**: No migration. The `spec_library.artifact_requirements` JSONB column stores the discriminated union as-is. Adding `{ type: 'file', ... }` objects requires no schema change.

**Rationale**: JSONB is schema-flexible by design. The application layer (Zod schemas + domain VOs) enforces the structure. Existing specs with only text artifacts are unaffected.
