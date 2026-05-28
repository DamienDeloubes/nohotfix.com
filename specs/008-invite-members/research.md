# Research: Invite Members

**Feature**: 008-invite-members
**Date**: 2026-03-08

## R1: Invite Token Generation & Validation

**Decision**: Use Node.js `crypto.randomBytes(32)` to generate a 256-bit cryptographically random token, stored as hex in the database. Token lookup by exact match (indexed column).

**Rationale**: Simple, secure, and avoids JWT complexity. No payload to decode — all invite state lives in the database. Token uniqueness is guaranteed by the 256-bit entropy space and a UNIQUE index.

**Alternatives considered**:
- JWT-based tokens: Rejected — adds unnecessary complexity (signing keys, expiry in token vs DB, revocation requires a denylist). Database lookup is required anyway for status checks.
- UUIDv4: Rejected — only 122 bits of entropy; crypto.randomBytes(32) provides 256 bits and is the standard for security tokens.

## R2: Invite URL Structure

**Decision**: Invite URL format: `{WEB_URL}/invite/{token}`. The `apps/web` Next.js app handles the route. The token is the raw hex string from the database.

**Rationale**: The web app already hosts the WorkOS auth flow. The invite acceptance page validates the token server-side, then redirects to WorkOS signup/login with the email pre-filled. After auth completes, a callback route finalises acceptance.

**Alternatives considered**:
- Hosting invite acceptance on `apps/app` (SPA): Rejected — the SPA can't do server-side token validation before auth, and WorkOS redirect URIs are configured for the web app.
- HMAC-signed URL with embedded data: Rejected — adds complexity without benefit since all state is in the DB. The random token IS the secret.

## R3: WorkOS Email Pre-fill & Lock

**Decision**: Pass the invited email as a query parameter to the WorkOS AuthKit authorization URL using the `login_hint` parameter. WorkOS AuthKit supports `login_hint` to pre-fill the email field. The email match is enforced server-side on callback — if the authenticated user's email doesn't match the invite, acceptance is rejected.

**Rationale**: WorkOS AuthKit's `login_hint` parameter pre-fills the email in the hosted auth UI. True "locking" of the email field depends on WorkOS's hosted UI capabilities; server-side enforcement at acceptance time is the authoritative guard.

**Alternatives considered**:
- Custom auth UI: Rejected — defeats the purpose of using WorkOS AuthKit. Server-side enforcement is sufficient.

## R4: Invite Acceptance Flow (Detailed)

**Decision**: Two-phase flow:
1. `GET /invite/{token}` — Server-side page in `apps/web`. Validates token (exists, pending, not expired). If valid, redirects to WorkOS auth with `login_hint={invited_email}` and stores the token in a secure HTTP-only cookie (or state parameter). If invalid, renders error page.
2. `GET /api/auth/invite-callback` — WorkOS redirects back here after auth. Exchanges code for user identity. Verifies email match. Calls API to accept invite. Redirects to `apps/app` org dashboard.

**Rationale**: Keeps the flow within the web app's auth domain. The API handles invite acceptance as a single transactional operation (mark invite accepted + create membership).

**Alternatives considered**:
- Single-step acceptance without auth redirect: Not possible — user must authenticate via WorkOS first.
- API-only acceptance (no web routes): Rejected — WorkOS OAuth callbacks need a server-side handler.

## R5: Resend Rate Limiting Strategy

**Decision**: Store `last_sent_at` timestamp on the invite record. Backend enforces: initial send cooldown = 5 minutes, subsequent resend cooldown = 15 minutes. The frontend reads `last_sent_at` and `created_at` to compute disabled state. Backend rejects resend requests that violate the cooldown.

**Rationale**: Simple timestamp comparison — no need for a separate rate-limiting service or Redis. The invite volume per org is low (bounded by seat limits), so database-level tracking is sufficient.

**Alternatives considered**:
- Redis-based rate limiting: Rejected — over-engineered for the expected volume. Adds infrastructure dependency.
- Frontend-only enforcement: Rejected — must have server-side enforcement as primary guard.

## R6: Resend Email Adapter (Port Design)

**Decision**: Define an `EmailPort` interface in the identity domain package with a `sendInviteEmail` method. The adapter in `apps/api/src/adapters/services/` wraps the existing `EmailSender` from `packages/email`. This keeps the domain free of Resend SDK dependencies.

**Rationale**: Follows hexagonal architecture — domain defines the port, infrastructure implements it. The existing `createEmailSender` factory and `MemberInvite` template are reused.

**Alternatives considered**:
- Calling Resend directly from the use case: Rejected — violates hexagonal architecture (domain must be infrastructure-agnostic).

## R7: Bounded Context Assignment

**Decision**: Feature belongs to the **Identity** context. The `invites` table and all invite logic live in `packages/domains/identity/`. The invite entity, use cases, ports, and errors are part of the identity domain.

**Rationale**: Identity already owns users, organisations, and memberships. Invites are the precursor to memberships — they belong in the same context. No cross-domain imports needed.

**Alternatives considered**:
- Separate "Invitations" context: Rejected — would be a single-entity context with tight coupling to Identity. Adds unnecessary bounded context overhead.
