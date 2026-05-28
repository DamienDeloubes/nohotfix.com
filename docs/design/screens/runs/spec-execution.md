# Screen: Spec Execution Panel

_Domain: Runs_
_Route: `/runs/[id]/specs/[spec-id]` (or a panel/drawer within the Run Overview)_
_Roles: Admin and Member_

---

## Purpose

The primary work surface for a tester during a run. Shows the full detail of a single spec — description, preconditions, test steps, expected result — alongside all artifact requirement inputs. The tester completes their evidence collection here and records the final pass, fail, or skip result. The Pass action is hard-gated: it cannot be activated until every declared artifact requirement is satisfied.

---

## Key UI Components

**Navigation:**
- "← Back to run" link → [Run Overview](run-overview.md)
- Previous / Next spec navigation (arrow controls to move through the spec list without returning to the overview)
- Run name + playbook name breadcrumb (muted, top of page)

**Spec Header:**
- Spec title (large heading)
- Severity badge (colour-coded: red for Critical, orange for High, yellow for Medium, grey for Low)
- System under test label
- State badge: `Pending` / `In Progress` / `Passed` / `Failed` / `Skipped`
- Assignment: "Claim it" button (if unclaimed) or "Claimed by [name]" label; "Unclaim" option if the current user is the claimer (and spec is not yet in a terminal state); Admin can unclaim any spec
- Executed by + timestamp (shown once a terminal state is recorded)

**Spec Detail Section:**
- Preconditions block (if configured): rendered as formatted text; labelled "Before you begin"
- Description block (if configured): full rich text rendering
- Test Steps checklist (if steps are configured):
  - Numbered list; each step: instruction text + expected outcome text
  - Checkbox per step — tester checks off as they go
  - Step completion is recorded but does not individually gate the pass action
  - Visual progress indicator: "X of Y steps checked"
- Expected result block (if configured): the single observable pass condition; displayed prominently just above the action buttons
- Tester notes block (if configured in the spec): informational only, clearly labelled "Tester note"

**Artifact Requirements Section:**
- Heading: "Evidence required before passing"
- One panel per configured artifact requirement, in configuration order

**File Upload Panel:**
- Label (e.g., "Before state screenshot")
- Drag-and-drop zone
- File picker button
- Paste from clipboard support (for screenshots)
- If minimum count > 1: labelled upload slots shown individually (e.g., "Upload: Before state", "Upload: After state")
- Uploaded file display:
  - Images: inline thumbnail preview
  - Videos: inline player
  - PDFs / documents: filename + type badge + download link
- Delete uploaded file button (only available before terminal state is reached)
- Enforcement indicator: "X of Y required" — e.g., "1 of 2 uploaded" (turns green when complete)
- File type mismatch error: "This file type is not accepted. Required: Screenshot (PNG, JPG, GIF)"

**Table Panel:**
- Label (e.g., "Browser compatibility matrix")
- Data grid with admin-defined columns
  - Column headers show column name + data type + Required / Optional badge
  - Required columns: standard styling; Optional columns: subtle "Optional" label
- Each row: one cell per column
  - Text columns: free-text input
  - Number columns: numeric input (non-numeric rejected inline)
  - Pass-Fail columns: select (Pass / Fail / N/A)
- "Add row" button — adds a new empty row below
- Row delete button (× icon on each row)
- Enforcement indicator: "X of Y required rows filled" + "All required columns completed" / "X required columns incomplete"

**Measured Value Panel:**
- Label (e.g., "Page load time")
- Number input with unit label (e.g., "ms")
- Entered value display
- Threshold indicator (if configured): e.g., "Threshold: ≤ 5000 ms"
- Threshold violation warning (if entered value violates threshold): amber warning banner — _"Value exceeds threshold: entered 6200 ms, max ≤ 5000 ms"_ — informational only, does not hard-block
- Enforcement indicator: filled (green) or empty (grey)

**URL Panel:**
- Label (e.g., "Link to Loom recording")
- URL text input
- URL validation: real-time check for well-formed URL format; inline error if invalid
- Clickable link preview shown once a valid URL is entered
- Enforcement indicator: filled (green) or empty (grey)

**Tester Note Input:**
- Optional free-text note field
- Label: "Add a tester note (optional)"
- Not visible in the audit trail to end users; internal team context only

**Action Buttons:**

- **"Mark as Pass" button:**
  - Enabled only when all declared artifact requirements are satisfied
  - When locked: button is visually disabled (grey); a helper message lists what is still required — e.g., _"To pass: upload 1 more screenshot, fill the measured value"_
  - When enabled: prominent green button
  - On click: confirmation dialog or direct action (TBD by implementation); spec immediately moves to `Passed` state; run overview updated; if this was the last unresolved spec, the run transitions to `Awaiting Go/No-Go`

- **"Mark as Fail" button:**
  - Always available once the spec is open (no artifact requirement to fail)
  - On click: opens [Fail Reason Dialog](#fail-reason-dialog-sub-view)
  - After confirmation: spec moves to `Failed` state

- **"Skip" button:**
  - Always available on any spec regardless of artifact state
  - On click: opens [Skip Reason Dialog](#skip-reason-dialog-sub-view)
  - After confirmation: spec moves to `Skipped` state

---

## User Actions

- Read spec detail (preconditions, description, test steps, expected result, tester notes)
- Check off test steps as they are executed
- Upload files (drag-and-drop, picker, or paste)
- Fill in table rows
- Enter a measured value
- Enter a URL
- Delete uploaded files (before terminal state)
- Claim or unclaim the spec
- Add a tester note
- Mark spec as Pass (when all artifacts are satisfied)
- Mark spec as Fail (with mandatory reason)
- Skip the spec (with mandatory reason)
- Navigate to previous or next spec in the run

---

## Navigation Flow

**How you get here:**
- Clicking a spec row in [Run Overview](run-overview.md)
- Previous / Next navigation from another Spec Execution Panel

**Where this screen leads:**
- "← Back to run" → [Run Overview](run-overview.md)
- Previous / Next navigation → adjacent Spec Execution Panel
- On last spec reaching terminal state → [Run Overview](run-overview.md) automatically (or user navigates manually)

---

## Data Displayed

- Full spec: title, severity, system under test, preconditions, description, test steps (with expected outcomes), expected result, tester notes (if configured)
- All artifact requirements with current completion state
- Uploaded files and their metadata (filename, type, uploader, upload time)
- Table data (all rows and cells entered so far)
- Entered measured value (if any)
- Entered URL (if any)
- Spec current state and assignment

---

## Sub-views (Modals)

### Fail Reason Dialog

Triggered by "Mark as Fail" button.

- Heading: "Mark spec as Failed"
- Required text area: "Describe the failure" (submit disabled until at least 1 character entered)
- Placeholder: _"e.g., Claim table fails to load — HTTP 500 on the /claims endpoint"_
- Actions: "Cancel", "Mark as Failed"
- On confirmation: spec state → `Failed`; failure reason stored in run record

### Skip Reason Dialog

Triggered by "Skip" button.

- Heading: "Skip this spec"
- Required text area: "Why is this spec being skipped?" (mandatory — consistent enforcement across all skips)
- Placeholder: _"e.g., Not applicable to this release — feature not included in this deployment"_
- Actions: "Cancel", "Skip spec"
- On confirmation: spec state → `Skipped`; skip reason stored in run record

---

## States

**Pending → In Progress:** Opening the spec panel automatically transitions it from `Pending` to `In Progress`. This is immediate and visible in the Run Overview.

**In Progress — no artifacts satisfied:** Pass button disabled. Helper message lists what is required.

**In Progress — some artifacts satisfied:** Pass button partially enabled-progress. Remaining requirements shown in helper.

**In Progress — all artifacts satisfied:** Pass button turns active green. Ready to mark as passed.

**Passed (terminal):**
- All inputs are read-only
- "Passed" state badge prominent
- Executed by + timestamp shown
- No action buttons visible
- A note: "This spec has been completed. Results are locked."

**Failed (terminal):**
- Read-only view
- "Failed" badge + failure reason displayed below
- Executed by + timestamp

**Skipped (terminal):**
- Read-only view
- "Skipped" badge + skip reason displayed
- Executed by + timestamp

**Concurrent edit (stale state):**
- If another tester has already recorded a terminal state while the current tester had the panel open:
- On refresh: the panel shows the terminal state with a note — "This spec was completed by [name] while you had it open."

---

## Notes

- There is no "re-open" action in v1 — once a spec is in a terminal state, only Admin intervention (not supported in v1) could change it
- All artifact uploads, table fills, measured values, and URL entries are stored as they happen — they are not discarded if the spec is ultimately Failed or Skipped; they remain in the run record for completeness
- The enforcement model is the core UX challenge here: the "why is my Pass button locked?" moment must be immediately clear without consulting documentation. The helper message listing remaining requirements is the primary affordance for this.

---

## Relevant Features

- [Run Execution UI](../../features/must-have/run-execution-ui.md)
- [Artifact-Gated Spec Execution](../../features/must-have/artifact-gated-spec-execution.md)
- [Tester Assignment](../../features/must-have/tester-assignment.md)
- [Run Immutability](../../features/must-have/run-immutability.md)
