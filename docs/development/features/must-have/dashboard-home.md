# Feature: Dashboard / Home Screen

_Last updated: 2026-03-01_

## Overview

The Dashboard is the landing screen for every authenticated user. It is the starting point for all primary workflows — finding and starting a run, building or editing a playbook, browsing run history, and managing the team. It surfaces at-a-glance status for the user's current work and provides fast navigation to every major section of the product.

## Complexity Assessment

- **Technical Complexity**: Low — the dashboard is a read surface aggregating data already captured by other modules; no new domain logic required.
- **Design Complexity**: Medium — the dashboard must serve two very different user states (new org with no data vs. established org with active runs) and two roles (Admin managing workflows, Member executing work), while remaining uncluttered and immediately actionable.
- **User Experience Complexity**: Low — the dashboard pattern is familiar; the key challenge is surfacing the right default action for each user state without overwhelming new users or hiding relevant items from established users.

---

## Detailed Description

### Navigation Model

The application uses a **left sidebar** for primary navigation. The sidebar is persistent across all screens.

| Nav Item     | Visible to    | Description                                  |
| ------------ | ------------- | -------------------------------------------- |
| Dashboard    | Admin, Member | Home screen — overview and quick actions     |
| Playbooks    | Admin, Member | Playbook list and editor                     |
| Runs         | Admin, Member | Active and recently completed runs           |
| History      | Admin, Member | Full read-only run history and audit trail   |
| Spec Library | Admin         | Organisation-wide spec library               |
| Settings     | Admin, Member | Org settings (Admin), Account settings (all) |

**Role-based sidebar differences:**

- The **Spec Library** nav item is shown only to Admins in v1. Members interact with specs exclusively through runs.
- **Settings** is visible to all roles; the content rendered inside Settings differs by role (Admins see org management tabs; Members see only their account settings).

The active org name is displayed at the top of the sidebar. For users belonging to multiple orgs, clicking the org name opens the org switcher dropdown.

---

### Dashboard Layout

The dashboard is divided into two zones:

1. **Primary zone** (main content area): contextual cards based on the user's state
2. **Quick actions bar** (top of primary zone): role-appropriate actions rendered as primary buttons

---

### State 1 — New Organisation (first login after signup)

The user has just completed signup and org creation. The dashboard is pre-populated with the **demo playbook** (seeded at org creation time — see authentication.md, Onboarding Flow).

**Primary zone content:**

- A prominently labelled banner: _"Welcome to NoHotfix — here's an example playbook to explore."_
- A card for the demo playbook showing its name ("Example — Pre-production release checklist"), section count, and spec count
- Three quick-start action links below the demo card:
  - "Start a run from this playbook" — navigates directly to the run start flow for the demo playbook
  - "Explore the playbook" — opens the demo playbook in the editor
  - "Build your own playbook" — navigates to the new playbook creation form

**Role-based differences in State 1:**

- **Admin**: sees all three quick-start actions above
- **Member** invited to a new org: sees the demo playbook card and a "Start a run" link; the "Explore the playbook" link navigates to a read-only view (Members cannot edit playbooks); "Build your own playbook" is not shown

---

### State 2 — Established Organisation (active use)

The user belongs to an org with real playbooks and at least one run started.

**Primary zone content:**

**Active Runs card** (shown only if one or more runs are `In Progress` or `Awaiting Go/No-Go`):

- Lists up to 5 active runs in descending order of start date
- Each row shows: run name, playbook name, environment tag, progress indicator (X of Y specs done), current state badge
- "View run" link per row navigates directly to the run overview
- If more than 5 active runs exist, a "View all active runs" link is shown below the list

**Recent Runs card** (shown below Active Runs, or as the first card if no active runs exist):

- Lists up to 5 most recently completed or abandoned runs
- Each row shows: run name, playbook name, environment tag, completion date, go/no-go decision badge (Go / No-Go / Abandoned)
- "View" link per row navigates to the read-only run detail in History

**Playbooks card** (shown below Recent Runs):

- Lists up to 4 playbooks in order of most recently used (last run date)
- Each row shows: playbook name, environment tag, spec count, last run date
- "Open" link per row navigates to the playbook detail / editor
- "New playbook" shortcut at the top right of the card (Admin only)
- "View all playbooks" link if more than 4 exist

**Quick actions bar (Admin):**

- "New run" — opens the run start flow (select playbook first)
- "New playbook" — opens the new playbook form

**Quick actions bar (Member):**

- "Start a run" — opens a playbook picker to start a new run
- No authoring actions shown

---

### State 3 — Trial Expiring / Expired

When a trial is within 3 days of expiry or has expired, a **billing banner** is shown at the top of the dashboard (and all other pages), above the primary zone. See billing-subscription.md for full detail.

---

### Empty State (no playbooks, no demo playbook)

This state should not occur under normal conditions — the demo playbook is seeded at org creation time. It is a fallback for edge cases (e.g., seeding failed, or the demo was deleted before any real playbook was created).

If there are no playbooks and no runs:

- The primary zone shows a single empty-state prompt: _"No playbooks yet — create your first one to get started."_
- A single "New playbook" button is shown (Admin only)
- A Member seeing this state sees: _"No playbooks yet — ask your Admin to create one."_

---

### Role-Based Differences Summary

| UI Element                  | Admin                 | Member                                                               |
| --------------------------- | --------------------- | -------------------------------------------------------------------- |
| "New playbook" quick action | Yes                   | No                                                                   |
| "New run" quick action      | Yes                   | No                                                                   |
| "Start a run" quick action  | No                    | Yes                                                                  |
| Spec Library nav item       | Yes                   | No                                                                   |
| Org Settings in sidebar     | Full access           | Account settings only                                                |
| Active Runs card            | Yes — full list       | Yes — filtered to runs they are assigned to or have claimed specs in |
| Recent Runs card            | Yes — all runs        | Yes — all runs (read access to history)                              |
| Playbooks card              | Yes — with edit links | Yes — links navigate to read-only playbook view                      |
