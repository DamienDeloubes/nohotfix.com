import { MembershipEntity, OrganisationEntity, Role, type MembershipRepository, type MemberWithUserDto, type OrganisationRepository } from '@nohotfix/domain-identity';
import type * as DomainIdentity from '@nohotfix/domain-identity';
import { DomainError } from '@nohotfix/shared';
import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CompositionRoot } from '../composition-root.js';

const mockOrg = OrganisationEntity.create({ id: 'org-1', name: 'Acme Corp', slug: 'acme-corp' });
const mockMembership = MembershipEntity.create({ id: 'mem-1', orgId: 'org-1', userId: 'user-internal-1', role: 'member' });

// Mock auth middleware — orgScopeMiddleware calls authMiddleware internally
vi.mock('../shared/middleware/auth.js', () => ({
  authMiddleware: async (request: { headers: Record<string, string | undefined>; authUser?: unknown }) => {
    const skipAuth = request.headers['x-test-no-auth'];
    if (skipAuth) {
      const { AuthTokenMissingError } = await import('@nohotfix/domain-identity');
      throw new AuthTokenMissingError();
    }
    request.authUser = { userId: 'workos-user-1', email: 'test@example.com' };
  },
}));

// Mock tracing — getSpan returns a no-op span
vi.mock('../shared/lib/tracing.js', () => ({
  getSpan: () => ({ setAttribute: () => {} }),
}));

// Mock resolveUserFromJwt + updateUserProfile — returns internal user from WorkOS ID
vi.mock('@nohotfix/domain-identity', async (importOriginal) => {
  const actual = await importOriginal<typeof DomainIdentity>();
  return {
    ...actual,
    resolveUserFromJwt: vi.fn().mockResolvedValue({
      id: 'user-internal-1',
      workosUserId: 'workos-user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    }),
    updateUserProfile: vi.fn().mockResolvedValue({
      id: 'user-internal-1',
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      updatedAt: '2026-03-08T12:00:00.000Z',
    }),
  };
});

// Dynamic import AFTER mocks are set up
const { identityRoutes } = await import('./identity.js');

function buildApp(
  overrides: {
    membershipRepo?: Partial<MembershipRepository>;
    organisationRepo?: Partial<OrganisationRepository>;
  } = {},
) {
  const membershipRepo: MembershipRepository = {
    findMembersWithUsers: vi.fn().mockResolvedValue([]),
    findByOrg: vi.fn().mockResolvedValue([]),
    findByOrgAndUser: vi.fn().mockResolvedValue(mockMembership),
    findByOrgAndEmail: vi.fn().mockResolvedValue(undefined),
    findByOrgAndId: vi.fn().mockResolvedValue(undefined),
    countAdmins: vi.fn().mockResolvedValue(0),
    create: vi.fn(),
    updateRole: vi.fn(),
    transferOwnership: vi.fn(),
    delete: vi.fn().mockResolvedValue(true),
    ...overrides.membershipRepo,
  };

  const organisationRepo = {
    findById: vi.fn(),
    findBySlug: vi.fn().mockResolvedValue(mockOrg),
    findByUserId: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    slugExists: vi.fn().mockResolvedValue(false),
    ...overrides.organisationRepo,
  } as unknown as OrganisationRepository;

  const app = Fastify({ logger: false });

  // Register error handler matching server.ts
  app.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.code(error.statusCode).send({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }
    return reply.code(500).send({ code: 'SYS_INTERNAL', message: 'Internal error' });
  });

  app.decorate('root', {
    membershipRepo,
    organisationRepo,
    userRepo: {},
    workosUserProfileAdapter: {},
  } as unknown as CompositionRoot);

  void app.register(identityRoutes);

  return { app, membershipRepo, organisationRepo };
}

describe('GET /api/orgs/:orgSlug/members', () => {
  let app: ReturnType<typeof buildApp>['app'];
  let membershipRepo: MembershipRepository;

  const members: MemberWithUserDto[] = [
    { membershipId: 'm1', userId: 'u1', firstName: 'Alice', lastName: null, email: 'alice@test.com', role: 'owner', joinedAt: new Date('2026-01-15T10:30:00.000Z') },
    { membershipId: 'm2', userId: 'u2', firstName: null, lastName: null, email: 'bob@test.com', role: 'member', joinedAt: new Date('2026-02-20T14:00:00.000Z') },
  ];

  beforeEach(() => {
    const built = buildApp({
      membershipRepo: {
        findMembersWithUsers: vi.fn().mockResolvedValue(members),
      },
    });
    app = built.app;
    membershipRepo = built.membershipRepo;
  });

  it('returns members for authenticated member of the org', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/members',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.members).toHaveLength(2);
    expect(body.members[0].firstName).toBe('Alice');
    expect(body.members[0].role).toBe('owner');
    expect(body.members[0].joinedAt).toBe('2026-01-15T10:30:00.000Z');
    expect(body.members[1].firstName).toBeNull();
    expect(body.members[1].email).toBe('bob@test.com');
  });

  it('uses middleware-resolved orgId for the DB query (tenant isolation)', async () => {
    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/members',
    });

    // The middleware resolves acme-corp → org-1, so the repo should get org-1
    expect(membershipRepo.findMembersWithUsers).toHaveBeenCalledWith('org-1');
  });

  it('returns empty members array for org with no members', async () => {
    const { app: emptyApp } = buildApp({
      membershipRepo: { findMembersWithUsers: vi.fn().mockResolvedValue([]) },
    });

    const res = await emptyApp.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/members',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().members).toEqual([]);
  });

  it('returns 404 for non-existent org slug', async () => {
    const { app: noOrgApp } = buildApp({
      organisationRepo: { findBySlug: vi.fn().mockResolvedValue(undefined) },
    });

    const res = await noOrgApp.inject({
      method: 'GET',
      url: '/api/orgs/no-such-org/members',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().code).toBe('AUTH_ORG_NOT_FOUND');
  });

  it('returns 403 for non-member user', async () => {
    const { app: noMemberApp } = buildApp({
      membershipRepo: { findByOrgAndUser: vi.fn().mockResolvedValue(undefined) },
    });

    const res = await noMemberApp.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/members',
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_MEMBERSHIP_NOT_FOUND');
  });

  it('returns 401 for unauthenticated request', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/members',
      headers: { 'x-test-no-auth': 'true' },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().code).toBe('AUTH_TOKEN_MISSING');
  });
});

describe('PATCH /api/users/me', () => {
  it('updates user profile with valid data', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/users/me',
      payload: { firstName: 'Jane', lastName: 'Doe' },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.id).toBe('user-internal-1');
    expect(body.firstName).toBe('Jane');
    expect(body.lastName).toBe('Doe');
    expect(body.updatedAt).toBeDefined();
  });

  it('returns 400 for missing firstName', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/users/me',
      payload: { lastName: 'Doe' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for missing lastName', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/users/me',
      payload: { firstName: 'Jane' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 401 for unauthenticated request', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/users/me',
      headers: { 'x-test-no-auth': 'true' },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().code).toBe('AUTH_TOKEN_MISSING');
  });
});

describe('DELETE /api/orgs/:orgSlug/members/:memberId', () => {
  const adminMembership = MembershipEntity.reconstitute({
    id: 'mem-1',
    orgId: 'org-1',
    userId: 'user-internal-1',
    role: Role.create('admin'),
    createdAt: new Date(),
  });

  const targetMemberMembership = MembershipEntity.reconstitute({
    id: 'mem-target',
    orgId: 'org-1',
    userId: 'target-user',
    role: Role.create('member'),
    createdAt: new Date(),
  });

  const ownerMembership = MembershipEntity.reconstitute({
    id: 'mem-owner',
    orgId: 'org-1',
    userId: 'owner-user',
    role: Role.create('owner'),
    createdAt: new Date(),
  });

  it('admin removes a member → 204', async () => {
    const { app, membershipRepo } = buildApp({
      membershipRepo: {
        findByOrgAndUser: vi.fn().mockResolvedValue(adminMembership),
        findByOrgAndId: vi.fn().mockResolvedValue(targetMemberMembership),
        delete: vi.fn().mockResolvedValue(true),
      },
    });

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/orgs/acme-corp/members/mem-target',
    });

    expect(res.statusCode).toBe(204);
    expect(membershipRepo.delete).toHaveBeenCalledWith('org-1', 'mem-target');
  });

  it('member tries to remove another → 403 AUTH_ROLE_INSUFFICIENT', async () => {
    const memberMembership = MembershipEntity.reconstitute({
      id: 'mem-1',
      orgId: 'org-1',
      userId: 'user-internal-1',
      role: Role.create('member'),
      createdAt: new Date(),
    });

    const { app } = buildApp({
      membershipRepo: {
        findByOrgAndUser: vi.fn().mockResolvedValue(memberMembership),
        findByOrgAndId: vi.fn().mockResolvedValue(targetMemberMembership),
      },
    });

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/orgs/acme-corp/members/mem-target',
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
  });

  it('attempt to remove owner → 409 AUTH_OWNER_CANNOT_BE_REMOVED', async () => {
    const { app } = buildApp({
      membershipRepo: {
        findByOrgAndUser: vi.fn().mockResolvedValue(adminMembership),
        findByOrgAndId: vi.fn().mockResolvedValue(ownerMembership),
      },
    });

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/orgs/acme-corp/members/mem-owner',
    });

    expect(res.statusCode).toBe(409);
    expect(res.json().code).toBe('AUTH_OWNER_CANNOT_BE_REMOVED');
  });

  it('membership not found → 404 AUTH_TARGET_NOT_FOUND', async () => {
    const { app } = buildApp({
      membershipRepo: {
        findByOrgAndUser: vi.fn().mockResolvedValue(adminMembership),
        findByOrgAndId: vi.fn().mockResolvedValue(undefined),
      },
    });

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/orgs/acme-corp/members/non-existent',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().code).toBe('AUTH_TARGET_NOT_FOUND');
  });

  it('membership from different org → 404 (tenant isolation)', async () => {
    const { app } = buildApp({
      membershipRepo: {
        findByOrgAndUser: vi.fn().mockResolvedValue(adminMembership),
        findByOrgAndId: vi.fn().mockResolvedValue(undefined),
      },
    });

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/orgs/acme-corp/members/mem-from-other-org',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().code).toBe('AUTH_TARGET_NOT_FOUND');
  });
});
