# Edge Case Patterns

Recurring edge cases to always consider when speccing features in this project.

## Authorization
- Unauthorised role navigating directly to a restricted URL → redirect to safe read-only equivalent
- Archived/inactive resource accessed via edit URL → redirect to detail/view page

## Form behaviour (create and edit forms)
- Required field cleared → disable save button + inline validation error
- No-op save (nothing changed) → silently redirect, no side effects, no history entries
- Network/server error on save → stay on form with error message, preserve all unsaved input for retry
- Session expires mid-form → redirect to login, preserve form state for recovery after re-auth
- Concurrent edits by two admins → last save wins, no conflict detection in v1

## Spec-specific limits (from create spec feature, carry over to edit)
- Max 50 test steps — exceeding blocks "Add step" with a visible message
- Title max 500 characters — frontend enforces with visible counter, backend validates too
- Duplicate titles allowed — specs identified by unique ID, not title
- Empty rich text normalised to null on storage

## History / changelog
- One history entry per changed field per save (not one entry per save)
- No history entry on no-op save
- Rich text fields (description, preconditions, expected result): only record "was updated", no before/after content (TipTap JSON diffs are impractical)
- History visible to all org members (not just admins), read-only

## Pagination / list pages
- Always reset to page 1 when search, filter, sort, or tab changes
- Sync all filter/search/sort/page state to URL query params for shareability and browser nav

## Data not yet built
- Playbook linking / playbook spec propagation: not yet implemented — spec edits only affect spec_library entry
- Spec deletion: not yet implemented — no need to handle "spec deleted while editing" scenario
