# Quickstart: Invite Members

**Feature**: 008-invite-members
**Context**: Identity

## Prerequisites

- Node.js 20, pnpm
- PostgreSQL running (via docker-compose)
- WorkOS account with AuthKit configured
- Resend API key

## Environment Variables (new)

Add to `apps/api/.env`:
```
INVITE_TOKEN_SECRET=<32+ char secret for HMAC if needed — currently unused, tokens are random>
RESEND_API_KEY=<your Resend API key>
```

Add to `apps/web/.env.local`:
```
API_URL=http://localhost:3001
WORKOS_CLIENT_ID=<existing>
WORKOS_API_KEY=<existing>
WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/invite-callback
WORKOS_COOKIE_PASSWORD=<existing>
```

## Setup Steps

1. Run migration: `pnpm --filter db migrate:latest`
2. Start services: `docker-compose up -d`
3. Start API: `pnpm --filter api dev`
4. Start web: `pnpm --filter web dev`
5. Start app: `pnpm --filter app dev`

## Testing the Invite Flow

1. Log in as Owner/Admin on `apps/app`
2. Navigate to Settings → Members
3. Enter email, select role, click "Send invite"
4. Check Resend dashboard or email inbox for invite
5. Click invite link → lands on `apps/web/invite/{token}`
6. Complete WorkOS signup/login with the invited email
7. Verify redirect to org dashboard with active membership

## Running Tests

```bash
# Unit tests (domain logic)
pnpm --filter @nohotfix/domain-identity test

# Integration tests (API routes)
pnpm --filter api test

# All tests
pnpm turbo run test
```

## Key Files to Modify

### New Files
- `packages/db/src/migrations/004_create_invites_table.ts`
- `packages/domains/identity/src/entities/invite.ts`
- `packages/domains/identity/src/ports/invite-repository.ts`
- `packages/domains/identity/src/ports/email-port.ts`
- `packages/domains/identity/src/use-cases/create-invite.ts`
- `packages/domains/identity/src/use-cases/resend-invite.ts`
- `packages/domains/identity/src/use-cases/revoke-invite.ts`
- `packages/domains/identity/src/use-cases/accept-invite.ts`
- `packages/domains/identity/src/use-cases/list-pending-invites.ts`
- `packages/domains/identity/src/use-cases/validate-invite-token.ts`
- `apps/api/src/adapters/repositories/kysely-invite-repository.ts`
- `apps/api/src/adapters/services/resend-email-adapter.ts`
- `apps/api/src/routes/invite.ts`
- `apps/web/src/app/invite/[token]/page.tsx`
- `apps/web/src/app/api/auth/invite-callback/route.ts`
- `packages/domains/identity/src/ui/hooks/useInvites.ts`
- `packages/domains/identity/src/ui/components/InviteMemberForm.tsx`

### Modified Files
- `packages/db/src/schema.ts` — add `InvitesTable` + register in `Database`
- `packages/shared/src/errors/codes.ts` — add invite error codes
- `packages/shared/src/types/index.ts` — add invite DTOs
- `packages/shared/src/schemas/` — add invite Zod schemas
- `packages/domains/identity/src/errors/index.ts` — add invite error classes
- `packages/domains/identity/src/index.ts` — export new use cases + entity
- `packages/domains/identity/src/ui/index.ts` — export new hooks + components
- `apps/api/src/composition-root.ts` — wire InviteRepository + EmailAdapter
- `apps/api/src/server.ts` — register invite routes
- `apps/api/src/config.ts` — add RESEND_API_KEY
- `apps/app/src/api/query-keys.ts` — add invite query keys
- `apps/app/src/routes/_authenticated/settings/members.tsx` — add invite form + pending invites display
