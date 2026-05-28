# Feature: Spec Library

## Overview

The Spec Library is the organisation-wide, centralised store of reusable testing specs. Every spec in the system — regardless of how it was created — lives in the library and is linked by reference into playbook sections. This means specs are never siloed inside a single playbook; they are always discoverable, searchable, and reusable across any number of playbooks. When a spec is edited in a chapter, the admin chooses to sync the change back to the library (and all linked chapters) or keep it local.

## Complexity Assessment

- **Technical Complexity**: High — the link-by-reference model (specs linked via `spec_library_id`) requires careful handling of sync propagation, decoupling (keep local), and snapshot isolation for active/completed runs; multiple editing paths must all converge on consistent library state.
- **Design Complexity**: Medium — two distinct surfaces (the library view and the in-chapter spec editor) plus the sync confirmation panel must feel coherent; the sync scope preview (listing all affected playbooks) requires a non-trivial query.
- **User Experience Complexity**: Medium — the "Sync to library" vs "Keep local" choice on every save is the key UX decision point; it must be clear enough that admins never accidentally propagate or accidentally silo a change.

## Detailed Description

### Spec Library

Every spec — regardless of how it was created — exists in a centralised **Spec Library** for the organisation. Specs inside chapters are linked to their library entry via a `spec_library_id`. This means:

- Specs are never siloed inside a single playbook; they are always discoverable and reusable
- The library grows organically as admins build playbooks — no separate maintenance step required
- Specs can also be created directly in the library and pulled into chapters later

### Spec Fields

Each spec has the following fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | Short text | Yes | e.g., "Claim table loads within 5 seconds" |
| System under test | Short text | Yes | e.g., "Broker Studio → Claim Page" |
| Severity | Select: Critical / High / Medium / Low | Yes | Defaults to Medium. Indicates how serious a failure of this spec is for the release decision — Critical: failure almost certainly means No-Go; High: strong justification required to Go; Medium: failure noted and explained; Low: acceptable to ship with, typically resolved in the next patch. Used to sort the Go/No-Go review screen. |
| Preconditions | Rich text | No | State that must be true before the spec can be executed (e.g., "User must be logged in as a Broker with ≥3 active claims in Pending state"). Kept separate from Description for reproducibility |
| Description | Rich text | No | Overview of what is being tested and any relevant context. Does not contain step-by-step instructions — those belong in Test Steps |
| Test steps | Ordered list | No | Numbered steps, each with an instruction and an expected outcome per step. See detail below |
| Expected result | Rich text | No | The single, observable condition that defines an overall pass — summarises the final state after all steps complete. Unambiguous; no interpretation needed |
| Artifact requirements | List of artifact requirements | No | Defaults to none. A spec can have zero or more artifact requirements, each of a different type. See Artifact Types below. All declared requirements must be satisfied before the pass button is enabled |
| Tester notes | Text | No | Optional hints or context for whoever runs this spec (not visible in the audit trail, internal only) |

### Test Steps

Each test step is a structured row containing:

| Sub-field | Type | Notes |
|---|---|---|
| Step number | Auto-incremented | Display only — reorders automatically on drag |
| Instruction | Short text | What the tester must do (e.g., "Navigate to /claims and log in as a Broker") |
| Expected outcome | Short text | The observable result of this specific step (e.g., "Claim table renders with at least one row") |

During a run, each step renders as a checklist row. The tester checks off steps as they go — step-level completion is recorded but does not individually gate the pass action. The spec-level pass action is gated by artifact requirements only.

Steps are optional at the spec level — a spec with no steps relies on its Description and Expected result fields alone. Steps are most valuable for multi-action flows where a tester unfamiliar with the feature needs unambiguous guidance.

### Adding Specs to a Section

**Method 1: Create a new spec inline within a section**
- While editing a playbook, the admin clicks "New spec" inside a section
- An inline editor opens within the section — the same fields as the library spec editor (title, system under test, severity, preconditions, description, test steps, expected result, artifact requirements, tester notes)
- On save, the spec is created in the library and simultaneously linked into the current section — it behaves identically to a spec added via Method 2
- The spec is immediately available in the library for reuse in other playbooks
- No "Sync to library / Keep local" prompt on creation — that prompt only applies when editing an existing spec. Newly created specs always go to the library automatically.
- A spec title is the only required field to save — all other fields can be filled in later via the library or the section editor

**Method 2: Add from the spec library**
- Admin searches the spec library by title or system under test
- Selects a spec — a linked copy is added to the current section, fully configured and ready to use
- The chapter spec stays linked to the library entry, enabling sync (see below)

**Method 3: Create directly in the library**
- Admin creates a fully configured spec in the library without adding it to a chapter immediately
- Useful for pre-populating the library before building new playbooks
- Spec can be pulled into any chapter at any time via Method 2

### Editing a Spec — Sync or Keep Local

When an admin edits a chapter spec, they are prompted on save:

**Sync to library** — updates the library entry and propagates the change to all other chapters across all playbooks that are linked to the same spec. Before confirming, a panel shows the full scope of the update:

```
Update spec in library and sync to:

  ☑ Pre-production deployment — Broker Studio Claims
  ☑ Pre-staging deployment — Broker Studio Claims
  ☑ Hotfix checklist — Broker Studio Claims

  [ Cancel ]  [ Sync to 3 playbooks ]
```

Admin confirms → spec is updated in the library and in all listed chapter copies simultaneously.

**Keep local** — the chapter spec is decoupled from the library entry. The modified version is saved as a new, independent library entry. The original library spec is unchanged. Other chapters linked to the original are unaffected.

**Important**: sync propagation applies to playbook templates only — never to active or completed runs. Runs are snapshotted at start time and are immutable; a sync cannot alter execution records.

### Spec Management

- Edit spec (with sync or keep local prompt on save)
- Remove spec from section (does not delete the library entry)
- Reorder specs within a section (drag and drop)

### Spec Library Management

- Browse and search the full spec library — searchable by title and system under test; filterable by severity
- Create specs directly in the library
- Edit library specs directly (no propagation prompt — library edits do not auto-push to linked chapters in v1)
- Archive a library spec (hides it from search; does not affect chapters already using it)
