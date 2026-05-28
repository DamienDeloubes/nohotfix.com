# Data Model: App Logout

**Feature**: 002-app-logout | **Date**: 2026-03-05

## Overview

This feature introduces no new entities, tables, or persistent data structures. It operates on existing session state:

## Existing State Affected

### In-Memory Access Token (apps/app)
- **Location**: `apps/app/src/lib/session.ts` — module-level `accessToken` variable
- **Type**: `string | null`
- **Lifecycle**: Set on login (from URL param or refresh), cleared on logout
- **Action**: Set to `null` during logout

### Refresh Token Cookie (apps/api domain)
- **Cookie name**: `__rp_refresh`
- **Attributes**: httpOnly, signed, sameSite=lax, path=/auth, maxAge=30d
- **Lifecycle**: Set on login/refresh callback, cleared on logout
- **Action**: Cleared by `POST /auth/logout` endpoint (already implemented)

### TanStack Query Cache (apps/app)
- **Query key**: `['session']`
- **Cached data**: User profile from `GET /api/users/me`
- **Action**: Cache cleared during logout to prevent stale auth state

## New Configuration

### Environment Variable
- **Name**: `VITE_WEB_URL`
- **Purpose**: Target URL for post-logout redirect
- **Development**: `http://localhost:3000`
- **Production**: `https://releasepilot.io`
- **Fallback**: `https://releasepilot.io`
