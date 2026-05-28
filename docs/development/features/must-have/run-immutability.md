# Feature: Run Immutability

## Overview

Run immutability is the core audit trail guarantee of NoHotfix. Once a go/no-go decision is recorded — whether Go, No-Go, or Abandoned — the run and all its artifacts are permanently locked. No edit endpoint exists for completed runs. This constraint is non-negotiable and cannot be relaxed for any reason, including admin convenience.

## Complexity Assessment

- **Technical Complexity**: Medium — enforcing immutability requires that no write endpoint accepts mutations on completed runs, enforced at the API layer independently of the UI; the discipline must be architectural, not just a UI toggle.
- **Design Complexity**: Low — the UI simply renders completed runs in read-only mode; the visual distinction between editable and locked states is straightforward.
- **User Experience Complexity**: Low — users understand the concept of a locked record once it is explained; the system surfaces the locked state clearly and prevents accidental confusion.

## Detailed Description

### Immutability Rule

Completed runs are read-only at the data level — no edit endpoint exists. This is the audit trail guarantee.

Once a go/no-go decision is recorded, the run and all its artifacts are permanently locked. No edit endpoint may exist for completed runs. This constraint is non-negotiable and cannot be relaxed for any reason, including admin convenience.

### Artifact Immutability

Artifacts are permanently linked to the run spec — they are part of the immutable audit record. After a run is completed (go/no-go recorded), artifacts cannot be deleted or replaced.

### Enforcement on the Pass Action

Artifact enforcement cannot be bypassed on the Pass action — there is no admin override. A tester who cannot satisfy an artifact requirement must either fix the gap or Skip the spec with a written reason.

### Scope of Immutability

Immutability applies to completed runs only — runs in the `Go`, `No-Go`, or `Abandoned` state. In-progress runs remain editable until a terminal decision is recorded. Immutability covers:

- All spec results (Passed, Failed, Skipped) and who executed them
- All uploaded artifacts
- All tester notes
- The go/no-go decision record: decision, decision maker, timestamp, any justification or reason
- Any partial spec results and artifacts collected before an abandonment

Sync propagation from the spec library applies to playbook templates only — never to active or completed runs. Runs are snapshotted at start time; a library sync cannot alter execution records.
