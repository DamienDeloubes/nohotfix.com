# Feature: Spec History

## Overview

Spec History provides a complete audit trail of every change made to a spec in the Spec Library. Every mutation — from initial creation through field edits and artifact requirement changes — is recorded as an individual history entry. This gives teams full visibility into how a spec evolved over time, who changed what, and when.

## Detailed Description

### How History is Recorded

Every time a spec is created or edited, the system records what changed. History entries are granular — one entry per changed field per save. If an admin edits both the title and the tags in a single save, two history entries are created, both with the same timestamp.

The following actions are tracked:

| Action                        | What is recorded                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| Spec created                  | A single `created` entry marking the birth of the spec                                    |
| Title changed                 | Old title and new title                                                                   |
| Description changed           | Only that the description was updated (no content diff — rich text diffs are impractical) |
| Tags changed                  | Old tag list and new tag list                                                             |
| Estimated duration changed    | Old duration and new duration                                                             |
| Artifact requirement added    | The label of the added artifact (e.g. "Screenshot")                                       |
| Artifact requirement removed  | The label of the removed artifact                                                         |
| Artifact requirement modified | The old and new state of the modified artifact, identified by label                       |

No history entry is created if a save results in no actual changes to any tracked field (no-op save).

### What is Stored

Each history entry captures:

- **Who** — the user who made the change
- **What** — the action type and, where applicable, the old and new values
- **When** — the timestamp of the change

For most fields, both the old and new values are stored (e.g. title changed from "Deploy Check" to "Deploy Checklist"). For description changes, only the fact that it was updated is recorded — no before/after content is stored because diffing rich text (TipTap JSON) is complex and rarely produces readable output.

### How History is Displayed

The spec detail page shows a simple chronological timeline of all changes, newest first. Each entry reads naturally:

- _"Damien created this spec — 3 days ago"_
- _"Damien changed title from 'Deploy Check' to 'Deploy Checklist' — 2 hours ago"_
- _"Damien updated description — 1 hour ago"_
- _"Damien added artifact requirement 'Screenshot' — 45 minutes ago"_
- _"Damien changed tags from 'deploy, backend' to 'deploy, infra' — 30 minutes ago"_

The history is visible to all organisation members, not just admins. It is purely read-only — no filtering, searching, or editing of history entries.

### Visibility and Retention

- All organisation members can view the history of any spec they have access to
- History is retained forever — there is no automatic cleanup or expiry
- If a user who made a change is later removed from the organisation, their history entries remain visible, displayed with a "Removed member" label

### Scope Boundaries

- **In scope**: Changes to spec fields and artifact requirements only
- **Out of scope**: Playbook-level changes (e.g. adding/removing a spec from a playbook section) — planned as a separate future feature
- **Out of scope**: Archive/unarchive actions — archiving is not yet implemented
- **Out of scope**: Pagination — all history entries are rendered in a single list. Pagination can be added later if specs accumulate very large histories
