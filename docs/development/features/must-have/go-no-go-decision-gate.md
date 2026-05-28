# Feature: Go/No-Go Decision Gate

## Overview

The go/no-go decision gate is the formal release approval mechanism in NoHotfix. It becomes available only after every spec in the run has been executed (Passed, Failed, or Skipped), and only Admins can invoke it. A Go decision with any failed specs requires mandatory written justification, which is permanently recorded in the immutable audit trail alongside the decision itself.

## Complexity Assessment

- **Technical Complexity**: Medium — requires state machine logic to unlock the review screen only when all specs are resolved, plus atomic locking of the run on decision confirmation.
- **Design Complexity**: Medium — the review screen must surface failed specs prominently, handle two distinct Go flows (clean pass vs. pass with failures), and make the weight of the decision legible without being obstructive.
- **User Experience Complexity**: Medium — the distinction between a clean Go, a Go with justification, and a No-Go must be immediately clear; the typed acknowledgment adds friction that is intentional and must not feel like a bug.

## Detailed Description

The go/no-go review screen becomes available once all specs in the run have been executed — meaning every spec has a result of Passed, Failed, or Skipped. A run with any Pending specs cannot advance to this screen. Only Admins can make the decision.

### Go/No-Go Review Screen

- Displays all specs sorted by severity (Critical → High → Medium → Low), with failed specs surfaced prominently at the top of each severity group
- Each spec row shows: title, severity badge, system under test, result, who executed, and timestamp
- A summary bar shows the total count: X Passed, Y Failed, Z Skipped
- The admin reviews the full picture before making a decision — including any specs that failed

### Go Decision Flow

**All specs passed or skipped:**

- Admin confirms with a typed acknowledgment: `"I confirm this release is ready to ship"`
- Decision recorded: actor name, timestamp
- Run immediately locked — no further edits possible

**One or more specs failed:**

- Admin must provide a mandatory written justification before the confirm button is enabled
- The justification prompt lists the failed specs explicitly: `"The following specs were failed at time of this decision. You must justify proceeding:"`
- The justification, the list of failed specs at time of decision, and the Go decision are all stored in the immutable audit record
- Run immediately locked on confirm

### No-Go Decision Flow

- Admin selects No-Go
- Required: written reason (visible in audit trail)
- Run is locked in No-Go state
- Team is notified
