# Screen: Run Detail (Audit View)

_Domain: History_
_Route: `/history/[id]`_
_Roles: Admin and Member (all users, read-only for all)_

---

## Purpose

The compliance-facing, permanently read-only record of a completed or abandoned run. This is the single most important screen for audit and compliance purposes — it surfaces the go/no-go decision record prominently, then the full spec list with every artifact, every tester attribution, and every skip or failure reason. No edits are possible here under any circumstances. Supports browser print-to-PDF for external distribution.

---

## Key UI Components

**Page Header:**
- Back link: "← Run History" → [History List](history-list.md)
- Run name (large heading)
- Final state badge: `Go` (green) / `No-Go` (red) / `Abandoned` (grey) — large and prominent
- Playbook name + environment tag
- "Print" button (top-right action area) — opens browser print dialog with print stylesheet applied
- Lock indicator: e.g., a padlock icon or "Immutable record" label — communicates clearly that this is a locked audit record

**Section 1 — Run Metadata:**
- Started by: name + timestamp
- Completed / Abandoned: timestamp of the terminal state
- Run duration (calculated: completion minus start)
- Total spec count

**Section 2 — Go/No-Go Decision Record (the "compliance receipt"):**

*For Go and No-Go runs:*
- Prominent visual block (distinct background/border styling from the rest of the page)
- Decision label: `Go` or `No-Go`
- Decision maker: full name
- Timestamp: exact date and time (browser local timezone)
- Written statement (if any):
  - For a clean Go: the typed acknowledgment phrase
  - For a Go with failures: the typed acknowledgment + the mandatory written justification (shown in full)
  - For No-Go: the written reason
- Failure context (Go with failures only): _"Go recorded with [N] failed spec(s) at time of decision — see justification above."_ + list of the failed spec titles at the time of decision

*For Abandoned runs:*
- Block labelled "Run Abandoned" (not Go/No-Go)
- Abandoning Admin's name
- Timestamp
- Abandonment reason (full text — mandatory at abandonment)
- Note: "Partial spec results below represent work completed before abandonment."

**Section 3 — Spec Results:**
- Overall summary row: X Passed / Y Failed / Z Skipped (not shown for Abandoned runs)
- Spec list, grouped by section (matching the original playbook snapshot structure)

**Section Header:**
- Section name
- Section-level skip indicator (if the section was skipped):
  - "Section skipped" badge (grey)
  - Skip reason (full text, displayed below the section header)
  - Note: all specs within appear as Skipped

**Per-Spec Row (collapsed by default; expanded on print):**
- Spec title
- Severity badge
- System under test
- Final state badge: `Passed` / `Failed` / `Skipped` (with colours)
- Executed by — name
- Timestamp of terminal action
- Expand/collapse control (chevron icon)

**Per-Spec Expanded View:**
- All spec fields as configured at run-start time (the snapshot version):
  - Severity, system under test, preconditions, description, test steps (with checkmarks showing which were checked), expected result
- Tester notes (if any were added during execution) — labelled "Tester note"
- Failure reason block (state is Failed): label "Failure reason" + full reason text
- Skip reason block (state is Skipped): label "Skip reason" + full reason text
- Artifacts (in configuration order):
  - **File uploads:** filename, file type label, upload timestamp, uploaded by name; image files render as inline previews (reduced size); all files have a download link; if multiple uploaders, each file is attributed separately
  - **Tables:** read-only data grid; all rows and columns preserved; column types rendered correctly (Pass-Fail columns show Pass/Fail/N/A labels); Required vs Optional column header labels preserved
  - **Measured values:** labelled number + unit; threshold shown if configured; threshold violation indicator shown if the entered value violated the threshold (amber indicator — retrospective, not blocking)
  - **URLs:** rendered as a labelled, clickable hyperlink

---

## User Actions

- Expand and collapse spec rows
- Download uploaded file artifacts
- Click URL artifacts (opens in new tab)
- Click "Print" to open browser print dialog (print-to-PDF)
- Navigate back to [History List](history-list.md)

---

## Navigation Flow

**How you get here:**
- Clicking a run row in [History List](history-list.md)
- "View" link in Recent Runs card on [Dashboard](../dashboard/dashboard-active.md)
- Email notification links (go/no-go decision email and abandonment email)
- After recording a go/no-go decision on [Go/No-Go Review Screen](../runs/go-no-go-review.md) — auto-navigated here
- After confirming run abandonment on [Run Overview](../runs/run-overview.md) — auto-navigated here

**Where this screen leads:**
- "← Run History" → [History List](history-list.md)
- File download → file downloaded to the user's device
- URL artifact link → external URL opened in a new tab
- Print → browser print dialog (no navigation)

---

## Data Displayed

- Full run record: name, status, playbook, environment, started by, completion timestamp, duration
- Decision record: decision type, decision maker, timestamp, written statements / justifications
- All sections and specs (from playbook snapshot at run start):
  - Each spec: title, severity, system under test, preconditions, description, test steps (with completion state), expected result
  - All artifacts: files (with previews), tables (rendered as grids), measured values, URLs
  - All tester attributions: who ran each spec, when
  - All failure reasons and skip reasons

---

## Print Layout (Browser Print-to-PDF)

When the user triggers print:
- Left sidebar navigation is hidden
- All spec rows are expanded (no collapsed-by-default behaviour in print)
- Artifact images shown inline at reduced size
- File attachments (non-images) shown as filename + type label (no download link in print)
- URLs rendered as plain text (not hyperlinks)
- Go/No-Go decision block kept on a single page where possible (no page break within the block)
- Repeating page headers: run name, playbook name, completion date, status badge
- Clean typography — no interactive elements rendered

---

## Modals / Sub-views

None — this screen is fully read-only. No modals, no drawers, no action dialogs.

---

## States

**Normal (Go or No-Go run):** Full record with decision block, spec list, artifacts.

**Abandoned run:**
- "Run Abandoned" decision block shown instead of Go/No-Go block
- Spec list shows partial results — executed specs show their state; un-executed specs show as `Pending` with a note: "Not executed — run was abandoned before this spec was reached."
- No overall spec summary (a count would be misleading for an incomplete run)

**Spec rows collapsed (default):** Summary rows only — title, state, executed by, timestamp.

**Spec rows expanded (manual or print):** Full detail including all artifacts.

**Loading:** Skeleton sections while the run data loads.

---

## Notes

- There are no edit controls on this screen for any user, including Admins — the immutability guarantee is enforced at the API level, not just the UI
- Signed URLs for file artifacts expire for security reasons — files accessed from the audit view use fresh signed URLs generated at view time; the underlying files are permanently stored in S3
- If a signed URL for a file has expired or the file has been deleted from S3 (not expected in normal operation), a "File unavailable" error is shown in place of the preview/download link — the audit record entry itself (filename, type, uploader) is preserved regardless
- This screen is the primary deliverable to compliance auditors; its layout and content density should be optimised for that use case

---

## Relevant Features

- [Run History & Audit Trail](../../features/must-have/run-history-audit-trail.md)
- [Run Immutability](../../features/must-have/run-immutability.md)
- [Go/No-Go Decision Gate](../../features/must-have/go-no-go-decision-gate.md)
- [Artifact-Gated Spec Execution](../../features/must-have/artifact-gated-spec-execution.md)
