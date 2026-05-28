# Feature: Run Execution UI

## Overview

The Run Execution UI is the core daily-use surface of NoHotfix — the screen where testers spend the majority of their time. It gives testers a structured view of what to test, how to test it, and what evidence to collect, then enforces that all artifact requirements are satisfied before a spec can be marked as Passed. It also handles the two distinct flows for terminating a run early: a test-driven No-Go and an external Abandonment.

## Complexity Assessment

- **Technical Complexity**: High — managing run state across multiple concurrent testers, enforcing artifact gates in real time, handling two distinct early-termination flows, and ensuring all actions are timestamped and attributed correctly requires careful state management and a robust API.
- **Design Complexity**: High — the execution panel must show spec detail, multiple artifact input types, step checklists, action buttons, and progress indicators simultaneously; the run overview must give at-a-glance visibility into who is doing what across all specs.
- **User Experience Complexity**: Medium — most individual interactions (upload a file, fill a table, mark pass/fail) are familiar; the key UX challenge is making the enforcement model (why is my Pass button locked?) immediately understandable without requiring documentation.

## Detailed Description

This is the core daily-use surface.

### Starting a Run

- Start a run from any active playbook
- Required at start: run name (e.g., "Release 4.2.1 — Staging"), environment auto-filled from playbook
- Optional at start: description / release notes field, target completion date
- Playbook is snapshotted at this moment
- Run is now independent of the playbook template

#### Run States

| State               | Description                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `In Progress`       | Active; specs being executed; one or more specs may already be failed                                                    |
| `Awaiting Go/No-Go` | All specs have been executed (each is Passed, Failed, or Skipped); the go/no-go review screen is now available to Admins |
| `Go`                | Go/no-go decision recorded as go                                                                                         |
| `No-Go`             | Decision recorded as no-go                                                                                               |
| `Abandoned`         | Run cancelled with a reason (preserved in history)                                                                       |

#### Ending a Run Early — Two Distinct Scenarios

A run in progress can be terminated before all specs are naturally executed. There are two fundamentally different situations, each with its own flow and its own meaning in the audit trail.

**Scenario 1: No-Go (test-driven termination)**

The release is stopped because of what the tests revealed — typically, high-severity specs have failed and there is no value in executing the remainder.

Flow:

1. Admin reviews the run and decides the evidence already collected is sufficient to call No-Go.
2. Admin uses the section-level skip action to mark any remaining unexecuted sections as skipped (with a reason).
3. Once all specs have a result (Passed, Failed, or Skipped), the run advances to `Awaiting Go/No-Go`.
4. Admin opens the go/no-go review screen and selects No-Go, providing a required written reason.
5. Run is locked immediately — immutable record.

What is preserved: All spec results, all artifacts uploaded up to that point, the No-Go decision, the written reason, and the decision maker's identity and timestamp.

Who can trigger it: Admin only (go/no-go decision action is Admin-gated).

This is the standard No-Go flow — no special "abandon" action required. The existing go/no-go mechanism handles it cleanly.

**Scenario 2: Abandonment (external, non-test termination)**

The release is cancelled for reasons entirely outside the test scope — a build pipeline failure, a last-minute business decision, a discovered dependency issue. The test results collected so far are not the cause and are not meaningful evidence for the decision.

Flow:

1. Admin locates the run abandonment action in the run's action/settings menu (not a prominent button — intentionally non-accidental).
2. Admin is prompted to provide a mandatory written reason explaining why the run is being abandoned (e.g., "Build pipeline failed — unrelated to test outcomes. Release postponed to next sprint.").
3. On confirmation, the run moves to `Abandoned` state and is immediately locked — immutable record.

What is preserved: The run record, the abandonment reason, the acting Admin's identity, and the timestamp. Any partial spec results and artifacts collected before abandonment are preserved in the record for completeness — but the abandonment reason makes clear they are not the cause of the cancellation.

Who can trigger it: Admin only.

Where the action lives: A settings or actions menu on the run overview page — not a top-level button. The placement signals that this is a deliberate, consequential action.

Notification on abandonment: All team members are notified by email when a run is abandoned — see email-notifications.md for full detail.

---

### Spec State Machine

Each spec in a run moves through the following states:

| State         | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `Pending`     | Not yet opened by any tester                                                   |
| `In Progress` | At least one tester has opened the spec's execution panel                      |
| `Passed`      | A tester has satisfied all artifact requirements and marked the spec as Passed |
| `Failed`      | A tester has marked the spec as Failed with a written reason                   |
| `Skipped`     | A tester has marked the spec as Skipped with a mandatory written reason        |

#### Transition Rules

**Pending → In Progress:**
A spec transitions from `Pending` to `In Progress` when any tester opens its execution panel. Opening is defined as navigating into the spec detail view within the run. Merely scrolling past the spec in the run overview does not change its state. The transition is immediate and visible to all participants in the run overview.

**In Progress → Passed / Failed / Skipped:**
The terminal state is recorded when a tester clicks the corresponding action button. The outcome, the acting tester's identity, and the exact timestamp are all recorded and immutable. No further state change is possible after a terminal state is set (no re-open in v1).

**Claiming and State:**
Claiming a spec (via the "Claim it" button) does not change the spec's state. A claimed spec is still `Pending` until someone opens its execution panel, at which point it becomes `In Progress`. Claiming is attribution metadata, not a state transition.

#### Concurrent Tester Behaviour

Two testers may open the same spec simultaneously. NoHotfix does not implement spec-level locking in v1.

**What happens concurrently:**

- Both testers can check test steps; each step-check is attributed to the acting tester
- Both testers can upload artifacts; all uploads are preserved and attributed separately
- Both testers can fill table rows; rows added by each tester are preserved
- The spec-level pass/fail/skip action is a race: the first tester to record a terminal state wins — the spec is immediately locked to that outcome
- The second tester, if their panel is still open, will see a stale view until they refresh; on refresh they will see the terminal state and will be unable to record a conflicting result

**Artifact preservation on concurrent access:**
All artifacts uploaded before a terminal state is recorded — regardless of which tester uploaded them — are preserved in the run record and attributed to the uploading tester. No artifact data is lost due to concurrent access.

---

### Run Overview

- Progress bar: X of Y specs completed
- Spec list with status indicators and severity badges
- Filter specs by: status (All / Pending / In Progress / Passed / Failed / Skipped), severity, assigned tester
- At-a-glance view of who is working on what

### Per-Spec Execution

- View spec details: title, severity badge, system under test, preconditions (if set), description, test steps (if set), expected result, tester notes
- Test steps render as a checklist — tester checks off each step as they go; step-level progress is recorded but does not individually gate the pass action
- Artifact requirements render inline, each in its own panel below the spec detail:
  - **File upload**: drag-and-drop, file picker, or paste from clipboard; MIME type inferred and labelled; image previews render inline
  - **Table**: editable data grid with admin-defined columns; rows added dynamically; type-validated inputs per column
  - **Measured value**: labelled number input; threshold warning surfaced if configured value is violated
  - **URL**: labelled URL input; validated on entry
- Progress indicator per artifact requirement: shows how many of each requirement have been satisfied
- Add a tester note (free text, optional)
- Actions:
  - **Mark as Pass** — enabled only when all declared artifact requirements are satisfied (all required files uploaded, all required table columns filled for each row, measured value entered, URL entered). The button is visually locked and cannot be clicked until every requirement is met.
  - **Mark as Fail** — always available once the spec is open; requires a written reason describing the failure. No artifact requirements apply to a Fail action.
  - **Skip** — always available on any spec, regardless of its content or requirements. Requires a mandatory written reason before the action completes (e.g., "Not applicable to this release — feature not included in this deployment"). The reason is recorded in the run record and visible in run history. Skipped specs count as executed for the purpose of advancing to the go/no-go gate.
- Assign spec to self (claim it)
- Each action is timestamped and attributed to the acting user
