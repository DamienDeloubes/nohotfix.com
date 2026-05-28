# Screen: Dashboard — Empty Fallback

_Domain: Dashboard_
_Route: `/dashboard`_

---

## Purpose

A fallback state for the rare edge case where an org has no playbooks and no demo playbook (e.g., the demo playbook seeding failed at org creation, or the Admin deleted the demo before creating any real playbooks). This state should not occur under normal conditions — it exists as a safety net to prevent a blank or broken-looking dashboard.

---

## Key UI Components

**Persistent Sidebar:** Same as all authenticated screens.

**Main Content Area:**
- Single empty-state illustration or icon
- Admin message: _"No playbooks yet — create your first one to get started."_
- Member message: _"No playbooks yet — ask your Admin to create one."_
- Admin: "New playbook" primary button → [New Playbook Form](../playbooks/new-playbook.md)
- Member: No action button — message only

**Quick Actions Bar:** Same role-appropriate buttons as Active Use state.

---

## User Actions

**Admin:**
- Click "New playbook" → [New Playbook Form](../playbooks/new-playbook.md)
- Navigate via sidebar

**Member:**
- Navigate via sidebar (Runs, History, Settings are accessible; no run to start without a playbook)

---

## Navigation Flow

**How you get here:**
- Dashboard load when the org has zero playbooks (demo deleted, no real playbooks created, seeding failure)

**Where this screen leads:**
- Admin action → [New Playbook Form](../playbooks/new-playbook.md)
- Sidebar navigation → any section

---

## Data Displayed

- No run or playbook data (empty org)

---

## Modals / Sub-views

None.

---

## States

This screen is itself an edge-case state within the dashboard. No additional sub-states.

---

## Notes

- This screen is distinct from the new-org state because it has no demo playbook to show — it is a true empty canvas
- If the seeding process is reliable, this screen should be effectively invisible in production; it is documented for completeness and defensive UI design

---

## Relevant Features

- [Dashboard / Home Screen](../../features/must-have/dashboard-home.md)
