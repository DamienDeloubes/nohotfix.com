# Data Model: App Shell & Dashboard Layout

**Branch**: `030-dashboard-layout` | **Date**: 2026-03-12

## Summary

This feature requires **no database changes**. It is a purely frontend feature that styles the existing layout and navigation components.

All data consumed by the new layout components already exists and is accessible through existing hooks and context:

| Data | Source | Existing Hook/Context |
|------|--------|-----------------------|
| Current user (name, email, initials) | WorkOS JWT + `users` table | `request.authUser` via session, user profile from identity domain |
| Current organisation (name, slug) | `organisations` table | `OrgContext` from `_authenticated/$orgSlug.tsx` route |
| User's organisations list | `organisations` + `memberships` tables | `useUserOrganisations` hook |
| Current route (for active nav state) | TanStack Router | `useRouterState()` / `useMatchRoute()` |

## No New Entities

No new domain entities, value objects, or database tables are introduced by this feature.

## No New API Endpoints

No new backend routes are required. The frontend consumes existing data already available in the React component tree.

## No Migrations

No database migrations are needed.
