# Data Model: Dark Mode / Light Mode Toggle

**Branch**: `031-dark-mode-toggle` | **Date**: 2026-03-13

## No Data Model Changes

This feature is frontend-only. No database tables, columns, or migrations are needed.

### Client-Side Storage

The only persisted data is a single `localStorage` key:

| Key | Type | Values | Default |
|-----|------|--------|---------|
| `theme-preference` | string | `"light"`, `"dark"`, `"system"` | absent (treated as `"system"`) |

This is a per-browser, per-device preference. It is not synced across devices or stored server-side.
