# Screen: New Spec Form (Library)

_Domain: Spec Library_
_Route: `/spec-library/new`_
_Roles: Admin only_

---

## Purpose

Allows an Admin to create a fully configured spec directly in the library, outside of any playbook context. Useful for pre-populating the library before building a new playbook, or for adding specs to the organisation's testing vocabulary that will be pulled into playbooks later via the "Add from library" picker.

---

## Key UI Components

- Page heading: "New spec"
- Back link: "← Spec Library" → [Spec Library](spec-library.md)

**Spec Fields (same as Spec Detail):**
- Title (required)
- System under test (required)
- Severity (select: Critical / High / Medium / Low; defaults to Medium)
- Preconditions (rich text, optional)
- Description (rich text, optional)
- Test steps (ordered list with add/remove/reorder; each step: Instruction + Expected outcome)
- Expected result (rich text, optional)
- Tester notes (plain text, optional)

**Artifact Requirements Section:**
- "Add artifact requirement" button with type selector:
  - File Upload
  - Table
  - Measured Value
  - URL
- Configuration form per type appears inline after type selection
- All configured requirements listed above the add button

**Form Actions:**
- "Create spec" primary button — saves the spec to the library; navigates to [Spec Detail](spec-detail.md) for the new spec
- "Cancel" → [Spec Library](spec-library.md)

---

## User Actions

- Fill in all spec fields (title and system under test are required; all others optional)
- Add one or more artifact requirements with configuration
- Submit to create the spec in the library
- Cancel to return to the library without saving

---

## Navigation Flow

**How you get here:**
- "New spec" button on [Spec Library](spec-library.md)

**Where this screen leads:**
- Successful creation → [Spec Detail](spec-detail.md) for the newly created spec (with a success confirmation)
- "Cancel" → [Spec Library](spec-library.md)

---

## Data Displayed

- No pre-populated data; all fields start empty

---

## Modals / Sub-views

None — all interactions are inline on this page.

---

## States

**Default:** All fields empty; "Create spec" button present.

**Validation error:** Title or system under test missing — inline error on the required fields.

**Loading:** "Create spec" button shows spinner while the record is saved.

---

## Notes

- Specs created here behave identically to specs created inline within a playbook section — they live in the library and can be pulled into any section via "Add from library"
- No sync-or-keep-local prompt on creation — that prompt only appears when editing an existing spec that is already linked to playbooks
- Only the title is strictly required to save; an Admin can create a minimal spec and fill in the rest later via [Spec Detail](spec-detail.md)

---

## Relevant Features

- [Spec Library](../../features/must-have/spec-library.md)
- [Artifact-Gated Spec Execution](../../features/must-have/artifact-gated-spec-execution.md)
