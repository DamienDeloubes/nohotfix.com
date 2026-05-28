# Feature: Run History & Audit Trail

## Overview

The Run History & Audit Trail is the read-only record of every completed run in the organisation. It gives teams a filterable list of all past runs and a full, tamper-evident detail view for each one — showing every spec result, every artifact, every tester attribution, and the final go/no-go decision. Completed runs are permanently read-only; this is the compliance-facing face of NoHotfix's immutability guarantee.

## Complexity Assessment

- **Technical Complexity**: Low — the underlying data is already captured during run execution; the history view is primarily a read-only rendering surface with filtering and pagination on top of existing records.
- **Design Complexity**: Medium — the run detail view must surface a large amount of nested information (run metadata, spec list, per-spec artifacts, go/no-go record) in a scannable, printable layout that serves both internal review and external compliance audits.
- **User Experience Complexity**: Low — users understand the concept of a history log; the main task is making it easy to find a specific run and quickly understand its outcome without having to read every detail.

## Detailed Description

### Run List

All runs (completed, abandoned, and any terminal state) are listed, paginated.

**Fields shown per row in the list:**

| Field           | Description                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| Run name        | The name given when the run was started                                       |
| Playbook name   | The playbook this run was started from                                        |
| Environment     | The environment tag from the playbook (e.g., "Staging", "Production")         |
| Status          | Final state badge: `Go`, `No-Go`, `Abandoned`                                 |
| Decision maker  | Name of the Admin who recorded the go/no-go decision or triggered abandonment |
| Started by      | Name of the user who started the run                                          |
| Start date      | When the run was created                                                      |
| Completion date | When the terminal state was recorded                                          |
| Spec summary    | X passed / Y failed / Z skipped — e.g., "12 passed, 2 failed, 1 skipped"      |

**Filters (applied in combination):**

- Playbook
- Status (Go / No-Go / Abandoned)
- Environment
- Date range (by completion date)
- Decision maker

**Sort options:**

- Start date (default: newest first)
- Completion date

---

### Individual Run Detail View (read-only)

The run detail view is the compliance-facing record. It is permanently read-only for all users. No edit action exists.

#### Section 1 — Run Header

Shown at the top of the page, prominently:

- **Run name** (large heading)
- **Status badge** — `Go`, `No-Go`, or `Abandoned` — displayed with colour coding (green / red / grey) and large enough to be visible at a glance
- **Playbook name** and environment tag
- **Started by** — name and timestamp
- **Completed** — timestamp of the terminal state

#### Section 2 — Go/No-Go Decision Record

This section is rendered as a visually distinct block — the "compliance receipt." It is shown immediately below the run header, before the spec list, because it is the primary artifact a compliance auditor needs.

**For Go and No-Go runs:**

- Decision: `Go` or `No-Go` (prominent badge)
- Decision maker: full name
- Timestamp: exact date and time (browser local timezone)
- Statement: the written justification (shown in full; required for Go-with-failures, optional for No-Go)
- Failure context: if the decision was `Go` with failed specs, the count of failed specs is shown inline — e.g., _"Go recorded with 2 failed specs — see written justification below."_

**For Abandoned runs:**

- Decision block is labelled "Run Abandoned" (not Go/No-Go)
- Abandoning Admin's name
- Timestamp
- Abandonment reason (full text — this was mandatory on abandonment)

#### Section 3 — Spec Results

The full spec list, grouped by section (matching the original playbook structure).

**Section header row:**

- Section name
- Section-level skip indicator (if the section was skipped): badge "Section skipped" + the skip reason

**Per-spec row (collapsed by default):**

- Spec title
- Severity badge
- System under test
- Final state badge (Passed / Failed / Skipped)
- Executed by — name of the tester who recorded the terminal outcome
- Timestamp of the terminal action
- Expand control to view full detail

**Per-spec expanded view:**

- All spec fields (as configured in the library at run-start time): severity, system under test, preconditions, description, test steps (with completion checkmarks), expected result
- Test step checklist — showing which steps were checked off and by whom (if step attribution is tracked)
- Tester notes (if any were added during execution)
- Failure reason (if state is Failed)
- Skip reason (if state is Skipped)
- All artifacts, in the order they appear in the spec:
  - **File uploads**: filename, file type label, upload timestamp, uploaded by name, and an inline preview for images; a download link for all file types
  - **Tables**: rendered as a read-only data grid with all rows and columns; column types preserved
  - **Measured values**: labelled number with unit; threshold shown if configured; threshold warning indicator if value violated the threshold
  - **URLs**: rendered as a labelled, clickable link

#### Section 4 — Abandoned Run Rendering

Abandoned runs are shown in history with all partial data preserved.

- The run header shows `Abandoned` state badge (grey)
- The Go/No-Go decision block is replaced with the "Run Abandoned" block (see above)
- The spec list shows partial results — specs that were executed before abandonment show their results; specs that were never opened show as `Pending` (with a note: "Not executed — run was abandoned")
- No pass/fail summary is shown for abandoned runs (a summary would be misleading given incomplete execution)
- Abandoned runs are included in the filterable run list (filter by Status: Abandoned)

---

### Print-Friendly Layout

NoHotfix v1 supports printing to PDF via the browser's native print function. The run detail view is designed to render cleanly when printed.

**Print layout rules:**

- The left sidebar navigation is hidden when printing
- All spec rows are expanded (the collapsed-by-default view is expanded automatically for print)
- Artifact images are shown inline at a reduced size to keep the document compact
- File attachments (non-image) are shown as a filename + file type label — no download links (not meaningful in a PDF)
- URLs are rendered as plain text (not hyperlinks) to preserve readability in a printed document
- The go/no-go decision block is kept on a single page where possible (no page break within the block)
- Page headers (repeated on each page if multi-page): run name, playbook name, completion date, status

A "Print" button is available in the run detail view's action bar (top-right of the page). Clicking it opens the browser print dialog with the print stylesheet applied.
