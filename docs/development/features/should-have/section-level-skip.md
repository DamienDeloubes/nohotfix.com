# Feature: Section-Level Skip

## Overview

Section-level skip allows an admin or tester to mark an entire playbook section as skipped for the current run with a single action and a required written reason. All specs within the section are automatically marked as Skipped. This is the primary mechanism for the early No-Go flow — an admin skips any remaining unexecuted sections to bring all specs to a resolved state before invoking the go/no-go gate.

## Complexity Assessment

- **Technical Complexity**: Low — the action sets the status of all specs in the section to Skipped atomically and records the written reason; the logic is a straightforward bulk-status update scoped to a section.
- **Design Complexity**: Low — a single action in the section header with a reason prompt and a clear visual state for the skipped section; the skipped specs within it inherit the section's skipped indicator.
- **User Experience Complexity**: Low — the interaction is intuitive; the mandatory written reason is a minor friction point that reinforces intentionality without confusion.

## Detailed Description

### Section-Level Skip

An entire section can be skipped for a run. The user selects "Skip section" and provides a required written reason (e.g., "Payment processing not affected in this release"). The skip and reason are recorded in the run record and visible in run history. All specs within a skipped section are marked as Skipped automatically and do not contribute to the go/no-go gate. A skipped section counts as executed — once all other specs are resolved, the run can advance to `Awaiting Go/No-Go`.
