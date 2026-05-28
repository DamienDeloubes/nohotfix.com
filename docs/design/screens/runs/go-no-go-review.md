# Screen: Go/No-Go Review Screen

_Domain: Runs_
_Route: `/runs/[id]/review`_
_Roles: Admin only (the screen is visible to Members but the decision actions are Admin-gated)_

---

## Purpose

The formal release decision screen. Accessible only after every spec in the run has reached a terminal state (Passed, Failed, or Skipped). This is where the Admin reviews the full test picture, assesses the risk, and records the release decision — Go or No-Go. The decision is permanent and immediately locks the run into an immutable audit record. This screen is the culmination of the entire NoHotfix core loop.

---

## Key UI Components

**Page Header:**

- Run name (large heading)
- State badge: `Awaiting Go/No-Go` (amber)
- Playbook name + environment tag
- "← Back to run overview" link → [Run Overview](run-overview.md)

**Summary Bar:**

- Prominent tally: X Passed, Y Failed, Z Skipped (with colour indicators — green/red/grey)
- If Y > 0 (failed specs): a highlighted alert block — _"[Y] spec(s) failed. A Go decision requires written justification."_
- If Y = 0 and Z = 0: a clean confirmation note — _"All specs passed. The run is ready for a Go decision."_
- If Y = 0 but Z > 0 (some skips): neutral note — _"[Z] spec(s) were skipped. Review below before deciding."_

**Full Spec List:**

- All specs sorted by severity (Critical → High → Medium → Low)
- Within each severity group, failed specs appear at the top (before Passed and Skipped)
- Grouped by section (section name shown as a sub-header)

**Per-Spec Row:**

- Spec title
- Severity badge
- System under test
- Final state badge: `Passed` (green) / `Failed` (red) / `Skipped` (grey)
- Executed by — name of the tester
- Execution timestamp
- Expand control → shows the full spec detail and all artifacts (same rendering as [Run Detail Audit View](../history/run-detail.md))

**Decision Panel (bottom or right-side sticky panel, Admin only):**

_Layout: Two clear CTA sections — Go and No-Go — with distinct visual treatment._

**Go Decision section:**

_When all specs passed or skipped (clean Go):_

- Heading: "Mark as Go"
- Instruction: _"Confirm that this release is ready to ship."_
- Typed acknowledgment input: _"Type: I confirm this release is ready to ship"_ (exact text match required to activate the "Record Go" button)
- "Record Go decision" button (disabled until typed acknowledgment matches exactly)

_When one or more specs failed (Go with failures):_

- Heading: "Mark as Go (with failures)"
- Alert: _"The following specs were failed at the time of this decision. You must justify proceeding:"_ — list of failed spec titles
- Mandatory written justification textarea (required; "Record Go" button disabled until filled)
- Typed acknowledgment input (same as clean Go — both the justification AND the typed acknowledgment are required)
- "Record Go decision" button

**No-Go Decision section:**

- Heading: "Mark as No-Go"
- Required written reason textarea: "Reason for No-Go decision" — cannot be left blank
- Placeholder: _"e.g., Critical claim table failure — must fix before shipping to production."_
- "Record No-Go decision" button (disabled until reason is filled)

**Member view (non-admin):**

- The spec list is fully visible — Members can review the test results
- The Decision Panel is replaced with: _"Only Admins can record the go/no-go decision. Contact your Admin to proceed."_
- No action buttons shown to Members

---

## User Actions

**Admin:**

- Expand spec rows to review detailed results and artifacts
- Record a Go decision (with typed acknowledgment; plus mandatory justification if failures exist)
- Record a No-Go decision (with mandatory written reason)
- Return to the Run Overview to review more context before deciding

**Member:**

- View the full spec results
- Read the summary (no decision actions available)

---

## Navigation Flow

**How you get here:**

- "Go/No-Go review" button on [Run Overview](run-overview.md) (available when state is `Awaiting Go/No-Go`)
- Direct link in the "run ready for go/no-go" email notification (Admins only)

**Where this screen leads:**

- After recording Go or No-Go → run is immediately locked → navigated to [Run Detail (Audit View)](../history/run-detail.md) for the now-completed run
- "← Back to run overview" → [Run Overview](run-overview.md) (state remains `Awaiting Go/No-Go` if no decision has been recorded)

---

## Data Displayed

- All specs from the run snapshot, sorted by severity with failures surfaced
- Per-spec: title, severity, system under test, state, executed by, timestamp
- Per-spec (expanded): all spec fields, all artifacts, failure reason or skip reason
- Summary counts: Passed / Failed / Skipped
- Run metadata: run name, environment, playbook

---

## Modals / Sub-views

### Go Confirmation (Inline within Decision Panel)

Not a modal — the typed acknowledgment and justification are part of the Decision Panel itself. No additional modal is opened on "Record Go decision" — the action is immediate on click (the typed acknowledgment is the confirmation mechanism).

### No-Go Confirmation (Inline within Decision Panel)

Same pattern — the written reason field is part of the panel; no additional confirmation step. "Record No-Go" is the final action.

**Post-decision loading state:**

- Brief spinner / "Recording decision..." state while the API call completes and the run is locked
- On success: navigate to [Run Detail (Audit View)](../history/run-detail.md)
- On failure (network/API error): error message — "Something went wrong. Your decision was not recorded. Please try again." — decision state preserved in form

---

## States

**Awaiting Go/No-Go — all passed/skipped:** Clean state. Summary shows all green/grey. Go decision panel does not show failure justification block.

**Awaiting Go/No-Go — failures present:** Alert block highlighted. Go with failures panel shows the failure list and mandatory justification textarea.

**Expanded spec view:** Individual spec rows expand to show full detail — behaves like the read-only view in Run History.

**Decision pending (Admin partially filled form):** If Admin has started typing a justification but not submitted — no auto-save; navigating away loses the draft.

**Loading (post-submission):** "Recording decision..." state while the run lock is applied.

---

## Notes

- The typed acknowledgment for Go is an intentional UX friction — it ensures the decision is deliberate, not accidental. The exact phrase must match character-for-character.
- Once the decision is recorded, the run transitions to `Go` or `No-Go` and is permanently locked — no further actions are possible on the run; it moves to History
- The email notification for the decision is sent to all team members immediately after the decision is recorded

---

## Relevant Features

- [Go/No-Go Decision Gate](../../features/must-have/go-no-go-decision-gate.md)
- [Run Immutability](../../features/must-have/run-immutability.md)
- [Email Notifications](../../features/must-have/email-notifications.md)
- [Run Execution UI](../../features/must-have/run-execution-ui.md)
