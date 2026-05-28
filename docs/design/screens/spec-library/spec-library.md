# Screen: Spec Library

_Domain: Spec Library_
_Route: `/spec-library`_
_Roles: Admin only (Members do not see this nav item or screen)_

---

## Purpose

The organisation-wide, centralised view of every spec in the system. All specs — whether created inline in a playbook section, added via the library picker, or created directly here — live in this library. Admins can browse, search, filter, create, edit, and archive specs from this surface. It is the canonical store that feeds all playbooks.

---

## Key UI Components

**Page Header:**
- Heading: "Spec Library"
- "New spec" primary button → [New Spec Form](new-spec.md)

**Tab Bar:**
- "Active" (default) — all non-archived specs
- "Archived" — archived specs

**Search and Filter Bar:**
- Search input: searches by spec title and system under test (live search)
- Filter by severity: All / Critical / High / Medium / Low

**Spec List (Active tab):**
- Table or card list of all active specs
- Per-row fields:
  - Spec title (linked — click opens [Spec Detail](spec-detail.md))
  - System under test
  - Severity badge
  - Number of playbooks this spec is linked to (e.g., "3 playbooks")
  - Last updated date
- Per-row action menu (three-dot icon):
  - "View / Edit" → [Spec Detail](spec-detail.md)
  - "Archive spec" → confirmation prompt

**Spec List (Archived tab):**
- Same table structure
- Per-row action menu:
  - "Unarchive" → moves spec back to Active immediately
- No "New spec" button in this tab context

---

## User Actions

- Search for specs by title or system under test
- Filter specs by severity
- Create a new spec directly in the library
- Open and view / edit a spec
- Archive a spec
- Unarchive a spec (from Archived tab)
- Switch between Active and Archived tabs

---

## Navigation Flow

**How you get here:**
- Clicking "Spec Library" in the sidebar (Admin only)

**Where this screen leads:**
- Click spec row / "View / Edit" → [Spec Detail](spec-detail.md)
- "New spec" → [New Spec Form](new-spec.md)

---

## Data Displayed

- All specs in the org library: title, system under test, severity, playbook usage count, last updated date

---

## Modals / Sub-views

**Archive Confirmation Prompt:**
- Message: _"Archive this spec? It will be hidden from library search. Playbook sections already using this spec are unaffected."_
- Actions: "Cancel", "Archive"

---

## States

**Populated (default):** Full list of specs with search and filter controls.

**Empty library (brand-new org with only the demo playbook):**
- Demo playbook's specs appear here automatically — the library is never truly empty after onboarding
- True empty (edge case): "No specs yet. Create your first spec or start building a playbook — specs you create there will appear here automatically."

**No search results:** "No specs match your search. Try a different term or clear the filter."

**Archived tab empty:** "No archived specs."

**Loading:** Skeleton rows while the list loads.

---

## Notes

- Archiving a spec hides it from library search and from the "Add from library" picker in the playbook editor — but it does not remove it from any section that already uses it
- Editing a library spec directly from this screen does not auto-propagate to linked chapters (v1 sync direction is chapters → library, not library → chapters)

---

## Relevant Features

- [Spec Library](../../features/must-have/spec-library.md)
- [Playbook Templates](../../features/must-have/playbook-templates.md)
