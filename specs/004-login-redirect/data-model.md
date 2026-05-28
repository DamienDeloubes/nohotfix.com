# Data Model: Login Redirect

**Feature**: 004-login-redirect
**Date**: 2026-03-06

## Summary

No new entities, tables, or schema changes required.

This feature operates entirely on existing infrastructure:
- **Refresh token cookie** (`__rp_refresh`): Already exists, set by `/auth/callback`, scoped to API domain `path: '/auth'`.
- **Session ID cookie** (`__rp_sid`): Already exists, used for WorkOS session revocation.
- **Users table**: Already exists. No new columns needed.

The login redirect flow reads existing cookies and calls existing WorkOS APIs. No data model modifications are necessary.
