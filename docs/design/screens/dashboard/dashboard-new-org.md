# Screen: Dashboard — New Organisation (First Login)

_Domain: Dashboard_
_Route: `/dashboard`_

---

## Purpose

The first screen a new user sees after completing signup and team creation. The organisation has just been created and the demo playbook has been seeded automatically. This state is designed to make the product immediately feel alive and demonstrate its full capability without requiring the user to build anything first.

---

## Key UI Components

**Persistent Sidebar (all screens):**

- NoHotfix logo
- Org name at top (static text for single-org users; dropdown for multi-org users)
- Nav links: Dashboard, Playbooks, Runs, History, Spec Library (Admin only), Settings
- User avatar / name at bottom → opens user menu (Account settings, Sign out)

**Main Content Area:**

- Welcome banner: _"Welcome to NoHotfix — here's an example playbook to explore."_
- Demo playbook card:
  - Name: "Example — Pre-production release checklist"
  - Section count
  - Spec count
  - Three quick-start action links:
    - "Start a run from this playbook" (Admin and Member)
    - "Explore the playbook" (Admin: opens editor; Member: opens read-only view)
    - "Build your own playbook" (Admin only — links to New Playbook form; not shown to Members)

**Quick Actions Bar (top of content area):**

- Admin: "New run" button, "New playbook" button
- Member: "Start a run" button only

---

## User Actions

**Admin:**

- Click "Start a run from this playbook" → [Start a Run](../runs/start-run.md) pre-selected with demo playbook
- Click "Explore the playbook" → [Playbook Editor](../playbooks/playbook-editor.md) for the demo playbook
- Click "Build your own playbook" → [New Playbook Form](../playbooks/new-playbook.md)
- Click "New run" (quick action) → [Start a Run](../runs/start-run.md) (playbook selector)
- Click "New playbook" (quick action) → [New Playbook Form](../playbooks/new-playbook.md)
- Open org switcher (if multi-org user)
- Navigate via sidebar to any section

**Member (first login, invited to a new org):**

- Click "Start a run" → [Start a Run](../runs/start-run.md)
- Click "Explore the playbook" → read-only playbook view
- Navigate via sidebar

---

## Navigation Flow

**How you get here:**

- Immediately after [Team Creation](../auth/team-creation.md) for the org creator
- For invited Members: first login to a brand-new org that has no real runs yet

**Where this screen leads:**

- Any sidebar nav item
- Any quick-start action card link
- As the org accumulates playbooks and runs, this state naturally transitions to [Dashboard — Active Use](dashboard-active.md)

---

## Data Displayed

- Demo playbook name, section count, spec count (seeded at org creation)
- Active org name (sidebar)

---

## Modals / Sub-views

None on initial state.

**Org Switcher Dropdown** (only for multi-org users, triggered by clicking org name in sidebar):

- List of all orgs the user belongs to
- Clicking an org switches the active context and reloads the dashboard for that org

---

## States

**Normal:** Welcome banner + demo playbook card displayed.

**Demo playbook deleted (edge case):** If the Admin deleted the demo playbook before any real playbooks were created, falls back to [Dashboard — Empty Fallback](dashboard-empty.md).

**Trial countdown (final 3 days):** [Trial Countdown Banner](../access-gates/trial-countdown-banner.md) displayed above the content area for Admins.

---

## Relevant Features

- [Dashboard / Home Screen](../../features/must-have/dashboard-home.md)
- [WorkOS-Powered Authentication](../../features/must-have/authentication.md)
- [Playbook Templates](../../features/must-have/playbook-templates.md)
