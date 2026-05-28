# Screen: Dashboard — Active Use (Established Organisation)

_Domain: Dashboard_
_Route: `/dashboard`_

---

## Purpose

The primary landing screen for all authenticated users in an organisation with real activity — at least one playbook created and at least one run started. Provides at-a-glance status of active work, recent outcomes, and fast access to all major workflows. The content adapts by role: Admins see organisation-wide oversight; Members see work relevant to them.

---

## Key UI Components

**Persistent Sidebar:**
- Org name (dropdown for multi-org users; static for single-org)
- Nav: Dashboard, Playbooks, Runs, History, Spec Library (Admin only), Settings
- User avatar / name → user menu (Account settings, Sign out)

**Quick Actions Bar (top of content area):**
- Admin: "New run" primary button, "New playbook" secondary button
- Member: "Start a run" primary button

**Active Runs Card** (shown when one or more runs are `In Progress` or `Awaiting Go/No-Go`):
- Card heading: "Active Runs"
- List of up to 5 runs, sorted by start date descending
- Per-run row: run name, playbook name, environment tag badge, progress indicator ("X of Y specs done"), state badge (`In Progress` / `Awaiting Go/No-Go`)
- "View run" link per row → [Run Overview](../runs/run-overview.md)
- "View all active runs" link if >5 active runs exist → [Active Runs List](../runs/active-runs-list.md)
- Member: filtered to runs where they are pre-assigned or have claimed specs

**Recent Runs Card** (shown below Active Runs, or first if no active runs):
- Card heading: "Recent Runs"
- List of up to 5 most recently completed or abandoned runs
- Per-run row: run name, playbook name, environment tag, completion date, go/no-go decision badge (`Go` / `No-Go` / `Abandoned`)
- "View" link per row → [Run Detail (Audit View)](../history/run-detail.md)

**Playbooks Card** (shown below Recent Runs):
- Card heading: "Playbooks"
- List of up to 4 playbooks sorted by most recently used (last run date)
- Per-row: playbook name, environment tag, spec count, last run date
- "Open" link per row → [Playbook Editor](../playbooks/playbook-editor.md) (Admin) or read-only playbook view (Member)
- "New playbook" shortcut in card header (Admin only) → [New Playbook Form](../playbooks/new-playbook.md)
- "View all playbooks" link if >4 exist → [Playbook List](../playbooks/playbook-list.md)

---

## User Actions

**Admin:**
- Start a new run → [Start a Run](../runs/start-run.md)
- Create a new playbook → [New Playbook Form](../playbooks/new-playbook.md)
- View a specific active run → [Run Overview](../runs/run-overview.md)
- View a completed run → [Run Detail (Audit View)](../history/run-detail.md)
- Open a playbook to edit → [Playbook Editor](../playbooks/playbook-editor.md)
- Navigate to full active run list, all playbooks list
- Switch org context (if multi-org)

**Member:**
- Start a run → [Start a Run](../runs/start-run.md)
- View active runs they are involved in → [Run Overview](../runs/run-overview.md)
- View completed runs → [Run Detail (Audit View)](../history/run-detail.md)
- View playbooks (read-only)

---

## Navigation Flow

**How you get here:**
- Clicking "Dashboard" in sidebar from any screen
- After log in (users with ≥1 org membership)
- After completing [Team Creation](../auth/team-creation.md) once org has activity

**Where this screen leads:**
- Any content card link or quick action → respective screen

---

## Data Displayed

- Active runs: run name, playbook name, environment, spec progress, current state
- Recent runs: run name, playbook name, environment, completion date, final decision
- Playbooks: name, environment, spec count, last run date
- Role-appropriate filtering applies to Member views

---

## Modals / Sub-views

**Org Switcher Dropdown** (multi-org users only):
- List of all orgs
- Active org indicated
- Clicking an org switches context and reloads the dashboard

---

## States

**Full data:** All three cards shown with data.

**No active runs:** Active Runs card is hidden; Recent Runs card appears first.

**No completed runs:** Recent Runs card is hidden or shows an empty state — "No completed runs yet."

**Trial countdown (Admin only, final 3 days):** [Trial Countdown Banner](../access-gates/trial-countdown-banner.md) above content area.

**Grace period:** [Grace Period Banner](../access-gates/grace-period-banner.md) replaces or supplements the trial banner (visible to all users).

**Subscription cancelled:** [Cancellation Banner](../access-gates/cancellation-banner.md) shown for Admins above content.

---

## Relevant Features

- [Dashboard / Home Screen](../../features/must-have/dashboard-home.md)
- [Run Execution UI](../../features/must-have/run-execution-ui.md)
- [Run History & Audit Trail](../../features/must-have/run-history-audit-trail.md)
- [Playbook Templates](../../features/must-have/playbook-templates.md)
