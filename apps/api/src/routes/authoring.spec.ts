import type * as DomainAudit from '@nohotfix/domain-audit';
import type * as DomainAuthoring from '@nohotfix/domain-authoring';
import { DomainError, ErrorCode } from '@nohotfix/shared';
import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CompositionRoot } from '../composition-root.js';

// ---------- Default orgContext for admin user ----------
const adminOrgContext = {
  orgId: 'org-1',
  orgSlug: 'acme-corp',
  orgName: 'Acme Corp',
  userId: 'user-internal-1',
  membershipId: 'mem-1',
  role: 'admin',
  email: 'admin@test.com',
};

let currentOrgContext = { ...adminOrgContext };

// ---------- Mocks ----------

// Mock auth middleware — sets authUser
vi.mock('../shared/middleware/auth.js', () => ({
  authMiddleware: async (request: { headers: Record<string, string | undefined>; authUser?: unknown }) => {
    const skipAuth = request.headers['x-test-no-auth'];
    if (skipAuth) {
      const { AuthTokenMissingError } = await import('@nohotfix/domain-identity');
      throw new AuthTokenMissingError();
    }
    request.authUser = { userId: 'workos-user-1', email: 'admin@test.com' };
  },
}));

// Mock org scope middleware — sets orgContext from currentOrgContext
vi.mock('../shared/middleware/org-scope.js', () => ({
  orgScopeMiddleware: async (request: { orgContext?: unknown }) => {
    request.orgContext = { ...currentOrgContext };
  },
}));

// Mock tracing
vi.mock('../shared/lib/tracing.js', () => ({
  getSpan: () => ({ setAttribute: () => {} }),
}));

// Mock createLibrarySpec, updateLibrarySpec, and listLibrarySpecs
const mockCreateLibrarySpec = vi.fn();
const mockUpdateLibrarySpec = vi.fn();
const mockListLibrarySpecs = vi.fn();
const mockArchiveLibrarySpec = vi.fn();
const mockGetArchiveImpact = vi.fn();
vi.mock('@nohotfix/domain-authoring', async (importOriginal) => {
  const actual = await importOriginal<typeof DomainAuthoring>();
  return {
    ...actual,
    createLibrarySpec: (...args: unknown[]) => mockCreateLibrarySpec(...args),
    updateLibrarySpec: (...args: unknown[]) => mockUpdateLibrarySpec(...args),
    listLibrarySpecs: (...args: unknown[]) => mockListLibrarySpecs(...args),
    archiveLibrarySpec: (...args: unknown[]) => mockArchiveLibrarySpec(...args),
    getArchiveImpact: (...args: unknown[]) => mockGetArchiveImpact(...args),
  };
});

// Mock recordChangelog, recordSpecChanges, recordPlaybookChanges — no-op
const mockRecordChangelog = vi.fn();
const mockRecordSpecChanges = vi.fn();
const mockRecordPlaybookChanges = vi.fn();
vi.mock('@nohotfix/domain-audit', async (importOriginal) => {
  const actual = await importOriginal<typeof DomainAudit>();
  return {
    ...actual,
    recordChangelog: (...args: unknown[]) => mockRecordChangelog(...args),
    recordSpecChanges: (...args: unknown[]) => mockRecordSpecChanges(...args),
    recordPlaybookChanges: (...args: unknown[]) => mockRecordPlaybookChanges(...args),
  };
});

// Dynamic import AFTER mocks are set up
const { authoringRoutes } = await import('./authoring.js');

// ---------- Helpers ----------

const NOW = '2026-03-09T10:00:00.000Z';

function fakeSpecResult(overrides: Record<string, unknown> = {}) {
  return {
    id: 'spec-1',
    orgId: 'org-1',
    title: 'Smoke test',
    systemUnderTest: null,
    severity: 'medium',
    preconditions: null,
    description: null,
    testSteps: null,
    expectedResult: null,
    artifactRequirements: null,
    testerNotes: null,
    isArchived: false,
    createdBy: 'user-internal-1',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function fakeRepoEntry(overrides: Record<string, unknown> = {}) {
  return {
    id: 'spec-1',
    orgId: 'org-1',
    title: 'Smoke test',
    systemUnderTest: null,
    severity: 'medium',
    preconditions: null,
    description: null,
    testSteps: null,
    expectedResult: null,
    artifactRequirements: null,
    testerNotes: null,
    isArchived: false,
    createdBy: 'user-internal-1',
    createdAt: new Date(NOW),
    updatedAt: new Date(NOW),
    ...overrides,
  };
}

function buildApp(overrides: { specLibraryRepo?: Record<string, unknown> } = {}) {
  const specLibraryRepo = {
    findById: vi.fn().mockResolvedValue(undefined),
    findByOrg: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue(fakeRepoEntry()),
    update: vi.fn().mockResolvedValue(undefined),
    findDistinctSystemsUnderTest: vi.fn().mockResolvedValue([]),
    findDistinctTags: vi.fn().mockResolvedValue([]),
    list: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    setArchived: vi.fn().mockResolvedValue(undefined),
    ...overrides.specLibraryRepo,
  };

  const changelogRepo = {
    findByEntity: vi.fn().mockResolvedValue([]),
    append: vi.fn().mockResolvedValue({ id: 'cl-1' }),
  };

  const playbookRepo = {
    findById: vi.fn().mockResolvedValue(undefined),
    findByOrg: vi.fn().mockResolvedValue([]),
    findByOrgWithCounts: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    countActiveRuns: vi.fn().mockResolvedValue(0),
    findDetail: vi.fn().mockResolvedValue(undefined),
  };

  const playbookSectionRepo = {
    findByPlaybook: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const playbookSpecRepo = {
    findByPlaybook: vi.fn().mockResolvedValue([]),
    findBySection: vi.fn().mockResolvedValue([]),
    findByLibrarySpec: vi.fn().mockResolvedValue([]),
    findUngrouped: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    delete: vi.fn(),
    updatePositions: vi.fn(),
    existsInPlaybook: vi.fn().mockResolvedValue(false),
    deleteBySectionId: vi.fn(),
    removeByLibrarySpecId: vi.fn().mockResolvedValue(0),
    findPlaybooksReferencingSpec: vi.fn().mockResolvedValue([]),
  };

  const environmentRepo = {
    findById: vi.fn().mockResolvedValue(undefined),
  };

  const app = Fastify({ logger: false });

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

  const txRoot = { specLibraryRepo, changelogRepo, playbookRepo, playbookSectionRepo, playbookSpecRepo };

  app.decorate('root', {
    specLibraryRepo,
    changelogRepo,
    playbookRepo,
    playbookSectionRepo,
    playbookSpecRepo,
    environmentRepo,
    withTransaction: async (fn: (root: typeof txRoot) => Promise<unknown>) => fn(txRoot),
  } as unknown as CompositionRoot);

  void app.register(authoringRoutes);

  return { app, specLibraryRepo, changelogRepo };
}

// ---------- Tests ----------

describe('POST /api/orgs/:orgSlug/specs', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockCreateLibrarySpec.mockReset();
    mockRecordChangelog.mockReset();
    mockCreateLibrarySpec.mockResolvedValue(fakeSpecResult());
    mockRecordChangelog.mockResolvedValue(undefined);
  });

  it('returns 201 with valid body', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: { title: 'Smoke test' },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.id).toBe('spec-1');
    expect(body.title).toBe('Smoke test');
    expect(body.severity).toBe('medium');
  });

  it('calls createLibrarySpec with correct arguments', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Full spec',
        systemUnderTest: 'Auth Service',
        severity: 'critical',
        testSteps: [{ instruction: 'Step 1', expectedOutcome: 'Result 1' }],
        testerNotes: 'Run on staging',
      },
    });

    expect(mockCreateLibrarySpec).toHaveBeenCalledTimes(1);
    const [deps, command] = mockCreateLibrarySpec.mock.calls[0];
    expect(deps).toHaveProperty('specLibraryRepo');
    expect(command.orgId).toBe('org-1');
    expect(command.createdBy).toBe('user-internal-1');
    expect(command.title).toBe('Full spec');
    expect(command.systemUnderTest).toBe('Auth Service');
    expect(command.severity).toBe('critical');
    expect(command.testSteps).toEqual([{ instruction: 'Step 1', expectedOutcome: 'Result 1' }]);
  });

  it('calls recordChangelog after spec creation', async () => {
    mockCreateLibrarySpec.mockResolvedValue(fakeSpecResult({ id: 'new-spec-id' }));
    const { app } = buildApp();

    await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: { title: 'Test' },
    });

    expect(mockRecordChangelog).toHaveBeenCalledTimes(1);
    const [deps, command] = mockRecordChangelog.mock.calls[0];
    expect(deps).toHaveProperty('changelogRepo');
    expect(command.orgId).toBe('org-1');
    expect(command.entityType).toBe('spec_library');
    expect(command.entityId).toBe('new-spec-id');
    expect(command.action).toBe('created');
    expect(command.actorId).toBe('user-internal-1');
  });

  it('returns 400 with empty title', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: { title: '' },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('Invalid request body');
  });

  it('returns 400 with missing title', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 with >50 test steps', async () => {
    const { app } = buildApp();
    const steps = Array.from({ length: 51 }, (_, i) => ({
      instruction: `Step ${i + 1}`,
      expectedOutcome: `Result ${i + 1}`,
    }));

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: { title: 'Too many steps', testSteps: steps },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 403 for member role', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: { title: 'Test' },
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
  });

  it('returns 201 with valid artifact requirements', async () => {
    const artifacts = [
      { index: 0, type: 'text' as const, label: 'Error log output', description: 'Include stack trace', required: true },
      { index: 1, type: 'text' as const, label: 'Manual notes', description: null, required: false },
    ];
    mockCreateLibrarySpec.mockResolvedValue(fakeSpecResult({ artifactRequirements: artifacts }));
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Spec with artifacts',
        artifactRequirements: [
          { type: 'text', label: 'Error log output', description: 'Include stack trace', required: true },
          { type: 'text', label: 'Manual notes' },
        ],
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.artifactRequirements).toHaveLength(2);
    expect(body.artifactRequirements[0].label).toBe('Error log output');
    expect(body.artifactRequirements[0].required).toBe(true);
    expect(body.artifactRequirements[1].label).toBe('Manual notes');
  });

  it('forwards artifactRequirements to createLibrarySpec command', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Test',
        artifactRequirements: [{ type: 'text', label: 'Log output', required: true }],
      },
    });

    const [, command] = mockCreateLibrarySpec.mock.calls[0];
    expect(command.artifactRequirements).toEqual([{ type: 'text', label: 'Log output', required: true, description: null }]);
  });

  it('returns 201 with no artifact requirements (backward compatibility)', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: { title: 'No artifacts' },
    });

    expect(res.statusCode).toBe(201);
  });

  it('returns 400 with empty label in artifact requirements', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Bad artifacts',
        artifactRequirements: [{ type: 'text', label: '' }],
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 with 11 artifact requirements', async () => {
    const { app } = buildApp();
    const artifacts = Array.from({ length: 11 }, (_, i) => ({ type: 'text', label: `Item ${i}` }));

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Too many artifacts',
        artifactRequirements: artifacts,
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 201 with file artifact requirement', async () => {
    const artifacts = [{ index: 0, type: 'file' as const, label: 'Upload screenshot', description: 'PNG only', required: true }];
    mockCreateLibrarySpec.mockResolvedValue(fakeSpecResult({ artifactRequirements: artifacts }));
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Spec with file artifact',
        artifactRequirements: [{ type: 'file', label: 'Upload screenshot', description: 'PNG only', required: true }],
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.artifactRequirements).toHaveLength(1);
    expect(body.artifactRequirements[0].type).toBe('file');
    expect(body.artifactRequirements[0].label).toBe('Upload screenshot');
    expect(body.artifactRequirements[0].description).toBe('PNG only');
    expect(body.artifactRequirements[0].required).toBe(true);
  });

  it('returns 400 with empty label in file artifact requirement', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Bad file artifact',
        artifactRequirements: [{ type: 'file', label: '' }],
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 with file artifact label exceeding 200 chars', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Label too long',
        artifactRequirements: [{ type: 'file', label: 'A'.repeat(201) }],
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 201 with mixed text and file artifact requirements', async () => {
    const artifacts = [
      { index: 0, type: 'text' as const, label: 'Error log', description: null, required: false },
      { index: 1, type: 'file' as const, label: 'Screenshot', description: 'PNG format', required: true },
    ];
    mockCreateLibrarySpec.mockResolvedValue(fakeSpecResult({ artifactRequirements: artifacts }));
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: {
        title: 'Mixed artifacts',
        artifactRequirements: [
          { type: 'text', label: 'Error log' },
          { type: 'file', label: 'Screenshot', description: 'PNG format', required: true },
        ],
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.artifactRequirements).toHaveLength(2);
    expect(body.artifactRequirements[0].type).toBe('text');
    expect(body.artifactRequirements[1].type).toBe('file');
    expect(body.artifactRequirements[1].required).toBe(true);
  });

  it('returns 401 for unauthenticated request', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'POST',
      url: '/api/orgs/acme-corp/specs',
      payload: { title: 'Test' },
      headers: { 'x-test-no-auth': 'true' },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().code).toBe('AUTH_TOKEN_MISSING');
  });
});

describe('GET /api/orgs/:orgSlug/specs/:specId', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
  });

  it('returns 200 for existing spec', async () => {
    const entry = fakeRepoEntry({ title: 'Login test' });
    const { app } = buildApp({
      specLibraryRepo: { findById: vi.fn().mockResolvedValue(entry) },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/spec-1',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.id).toBe('spec-1');
    expect(body.title).toBe('Login test');
    expect(body.severity).toBe('medium');
    expect(body.createdAt).toBe(NOW);
    expect(body.updatedAt).toBe(NOW);
  });

  it('returns 404 with AUTHOR_SPEC_NOT_FOUND for non-existent spec', async () => {
    const { app } = buildApp({
      specLibraryRepo: { findById: vi.fn().mockResolvedValue(undefined) },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/non-existent-id',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().code).toBe('AUTHOR_SPEC_NOT_FOUND');
  });

  it('passes orgId to findById for tenant isolation', async () => {
    const findById = vi.fn().mockResolvedValue(fakeRepoEntry());
    const { app } = buildApp({ specLibraryRepo: { findById } });

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/spec-1',
    });

    expect(findById).toHaveBeenCalledWith('spec-1', 'org-1');
  });

  it('returns 403 for member role', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/spec-1',
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
  });
});

describe('GET /api/orgs/:orgSlug/specs/systems-under-test', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
  });

  it('returns 200 with sorted distinct values', async () => {
    const { app } = buildApp({
      specLibraryRepo: {
        findDistinctSystemsUnderTest: vi.fn().mockResolvedValue(['Auth Service', 'Billing', 'Dashboard']),
      },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/systems-under-test',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().systems).toEqual(['Auth Service', 'Billing', 'Dashboard']);
  });

  it('returns 200 with empty array when no specs exist', async () => {
    const { app } = buildApp({
      specLibraryRepo: { findDistinctSystemsUnderTest: vi.fn().mockResolvedValue([]) },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/systems-under-test',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().systems).toEqual([]);
  });

  it('passes orgId for tenant isolation', async () => {
    const findDistinct = vi.fn().mockResolvedValue([]);
    const { app } = buildApp({ specLibraryRepo: { findDistinctSystemsUnderTest: findDistinct } });

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/systems-under-test',
    });

    expect(findDistinct).toHaveBeenCalledWith('org-1');
  });

  it('returns 403 for member role', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/systems-under-test',
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
  });
});

describe('GET /api/orgs/:orgSlug/specs', () => {
  const defaultListResult = {
    items: [
      { id: 'spec-1', title: 'Login test', systemUnderTest: 'Auth Service', severity: 'critical', tags: ['smoke'], updatedAt: NOW },
      { id: 'spec-2', title: 'Checkout flow', systemUnderTest: null, severity: 'medium', tags: [], updatedAt: NOW },
    ],
    total: 2,
    page: 1,
    pageSize: 25,
    totalPages: 1,
  };

  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockListLibrarySpecs.mockReset();
    mockListLibrarySpecs.mockResolvedValue(defaultListResult);
  });

  it('returns 200 with paginated list of active specs (default params)', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.items).toHaveLength(2);
    expect(body.total).toBe(2);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(25);

    const [, query] = mockListLibrarySpecs.mock.calls[0];
    expect(query.tab).toBe('active');
    expect(query.sort).toBe('updated');
    expect(query.order).toBe('desc');
    expect(query.page).toBe(1);
  });

  it('returns only archived specs when tab=archived', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?tab=archived',
    });

    const [, query] = mockListLibrarySpecs.mock.calls[0];
    expect(query.tab).toBe('archived');
  });

  it('filters by severity', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?severity=critical',
    });

    const [, query] = mockListLibrarySpecs.mock.calls[0];
    expect(query.severity).toBe('critical');
  });

  it('searches by query param', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?q=login',
    });

    const [, query] = mockListLibrarySpecs.mock.calls[0];
    expect(query.search).toBe('login');
  });

  it('sorts by title ascending', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?sort=title&order=asc',
    });

    const [, query] = mockListLibrarySpecs.mock.calls[0];
    expect(query.sort).toBe('title');
    expect(query.order).toBe('asc');
  });

  it('sorts by severity descending', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?sort=severity&order=desc',
    });

    const [, query] = mockListLibrarySpecs.mock.calls[0];
    expect(query.sort).toBe('severity');
    expect(query.order).toBe('desc');
  });

  it('returns page 2 with correct page param', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?page=2',
    });

    const [, query] = mockListLibrarySpecs.mock.calls[0];
    expect(query.page).toBe(2);
  });

  it('returns empty items array and total=0 when no matches', async () => {
    mockListLibrarySpecs.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 25, totalPages: 0 });
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?q=nonexistent',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.items).toEqual([]);
    expect(body.total).toBe(0);
  });

  it('returns 400 for invalid sort column', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?sort=invalid',
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for negative page', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs?page=-1',
    });

    expect(res.statusCode).toBe(400);
  });

  it('enforces org_id tenant boundary via orgContext', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs',
    });

    const [deps, query] = mockListLibrarySpecs.mock.calls[0];
    expect(deps.specLibraryRepo).toBeDefined();
    expect(query.orgId).toBe('org-1');
  });

  it('is accessible by member role (not admin-only)', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs',
    });

    expect(res.statusCode).toBe(200);
  });
});

describe('PUT /api/orgs/:orgSlug/specs/:specId', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockUpdateLibrarySpec.mockReset();
    mockRecordSpecChanges.mockReset();
    mockUpdateLibrarySpec.mockResolvedValue(fakeSpecResult({ title: 'Updated title' }));
    mockRecordSpecChanges.mockResolvedValue(undefined);
  });

  it('returns 200 on valid admin update', async () => {
    const entry = fakeRepoEntry({ title: 'Original title' });
    const { app } = buildApp({
      specLibraryRepo: { findById: vi.fn().mockResolvedValue(entry) },
    });

    const res = await app.inject({
      method: 'PUT',
      url: '/api/orgs/acme-corp/specs/spec-1',
      payload: { title: 'Updated title' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().title).toBe('Updated title');
    expect(mockUpdateLibrarySpec).toHaveBeenCalledOnce();
    expect(mockRecordSpecChanges).toHaveBeenCalledOnce();
  });

  it('returns 403 with AUTH_ROLE_INSUFFICIENT when member calls endpoint', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PUT',
      url: '/api/orgs/acme-corp/specs/spec-1',
      payload: { title: 'Test' },
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
    expect(mockUpdateLibrarySpec).not.toHaveBeenCalled();
  });

  it('returns 404 with AUTHOR_SPEC_NOT_FOUND for non-existent spec', async () => {
    const { app } = buildApp({
      specLibraryRepo: { findById: vi.fn().mockResolvedValue(undefined) },
    });

    const res = await app.inject({
      method: 'PUT',
      url: '/api/orgs/acme-corp/specs/non-existent',
      payload: { title: 'Test' },
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().code).toBe('AUTHOR_SPEC_NOT_FOUND');
  });

  it('returns 400 on invalid body (missing title)', async () => {
    const entry = fakeRepoEntry();
    const { app } = buildApp({
      specLibraryRepo: { findById: vi.fn().mockResolvedValue(entry) },
    });

    const res = await app.inject({
      method: 'PUT',
      url: '/api/orgs/acme-corp/specs/spec-1',
      payload: {},
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('Invalid request body');
  });

  it('passes old and new snapshots to recordSpecChanges', async () => {
    const entry = fakeRepoEntry({ title: 'Old title', severity: 'low', systemUnderTest: 'Auth' });
    mockUpdateLibrarySpec.mockResolvedValue(fakeSpecResult({ title: 'New title', severity: 'high', systemUnderTest: 'Billing' }));
    const { app } = buildApp({
      specLibraryRepo: { findById: vi.fn().mockResolvedValue(entry) },
    });

    await app.inject({
      method: 'PUT',
      url: '/api/orgs/acme-corp/specs/spec-1',
      payload: { title: 'New title', severity: 'high', systemUnderTest: 'Billing' },
    });

    expect(mockRecordSpecChanges).toHaveBeenCalledOnce();
    const [, command] = mockRecordSpecChanges.mock.calls[0];
    expect(command.oldSpec.title).toBe('Old title');
    expect(command.newSpec.title).toBe('New title');
    expect(command.oldSpec.systemUnderTest).toBe('Auth');
    expect(command.newSpec.systemUnderTest).toBe('Billing');
    expect(command.specId).toBe('spec-1');
    expect(command.orgId).toBe('org-1');
  });

  it('allows owner role', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'owner' };
    const entry = fakeRepoEntry();
    const { app } = buildApp({
      specLibraryRepo: { findById: vi.fn().mockResolvedValue(entry) },
    });

    const res = await app.inject({
      method: 'PUT',
      url: '/api/orgs/acme-corp/specs/spec-1',
      payload: { title: 'Test' },
    });

    expect(res.statusCode).toBe(200);
  });
});

describe('PATCH /api/orgs/:orgSlug/specs/:specId/archive', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockArchiveLibrarySpec.mockReset();
    mockRecordChangelog.mockReset();
    mockArchiveLibrarySpec.mockResolvedValue({ spec: fakeSpecResult({ isArchived: true }), wasChanged: true });
    mockRecordChangelog.mockResolvedValue(undefined);
  });

  it('returns 200 with archived spec DTO on success', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/archive',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.isArchived).toBe(true);
    expect(body.id).toBe('spec-1');
  });

  it('calls archiveLibrarySpec with archive=true', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/archive',
    });

    expect(mockArchiveLibrarySpec).toHaveBeenCalledOnce();
    const [deps, command] = mockArchiveLibrarySpec.mock.calls[0];
    expect(deps).toHaveProperty('specLibraryRepo');
    expect(deps).toHaveProperty('playbookSpecRepo');
    expect(command.specId).toBe('spec-1');
    expect(command.orgId).toBe('org-1');
    expect(command.archive).toBe(true);
  });

  it('records changelog with action "archived"', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/archive',
    });

    expect(mockRecordChangelog).toHaveBeenCalledOnce();
    const [, command] = mockRecordChangelog.mock.calls[0];
    expect(command.entityType).toBe('spec_library');
    expect(command.entityId).toBe('spec-1');
    expect(command.action).toBe('archived');
    expect(command.actorId).toBe('user-internal-1');
  });

  it('returns 404 AUTHOR_SPEC_NOT_FOUND for non-existent spec', async () => {
    mockArchiveLibrarySpec.mockRejectedValue(
      new (class extends DomainError {
        constructor() {
          super(ErrorCode.AUTHOR_SPEC_NOT_FOUND, 'Spec not found', 404);
        }
      })(),
    );
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/non-existent/archive',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().code).toBe('AUTHOR_SPEC_NOT_FOUND');
  });

  it('returns 403 AUTH_ROLE_INSUFFICIENT when caller is a member', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/archive',
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
    expect(mockArchiveLibrarySpec).not.toHaveBeenCalled();
  });

  it('enforces org_id boundary via orgContext', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/archive',
    });

    const [, command] = mockArchiveLibrarySpec.mock.calls[0];
    expect(command.orgId).toBe('org-1');
  });
});

describe('PATCH /api/orgs/:orgSlug/specs/:specId/unarchive', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockArchiveLibrarySpec.mockReset();
    mockRecordChangelog.mockReset();
    mockArchiveLibrarySpec.mockResolvedValue({ spec: fakeSpecResult({ isArchived: false }), wasChanged: true });
    mockRecordChangelog.mockResolvedValue(undefined);
  });

  it('returns 200 with unarchived spec DTO on success', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/unarchive',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.isArchived).toBe(false);
  });

  it('calls archiveLibrarySpec with archive=false', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/unarchive',
    });

    expect(mockArchiveLibrarySpec).toHaveBeenCalledOnce();
    const [, command] = mockArchiveLibrarySpec.mock.calls[0];
    expect(command.archive).toBe(false);
  });

  it('records changelog with action "unarchived"', async () => {
    const { app } = buildApp();

    await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/unarchive',
    });

    expect(mockRecordChangelog).toHaveBeenCalledOnce();
    const [, command] = mockRecordChangelog.mock.calls[0];
    expect(command.action).toBe('unarchived');
  });

  it('returns 403 AUTH_ROLE_INSUFFICIENT when caller is a member', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/unarchive',
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
  });

  it('allows owner role', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'owner' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/unarchive',
    });

    expect(res.statusCode).toBe(200);
  });
});

describe('PATCH /api/orgs/:orgSlug/specs/:specId/archive — idempotency', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockArchiveLibrarySpec.mockReset();
    mockRecordChangelog.mockReset();
  });

  it('skips changelog when spec is already archived (idempotent)', async () => {
    mockArchiveLibrarySpec.mockResolvedValue({ spec: fakeSpecResult({ isArchived: true }), wasChanged: false });
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/archive',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().isArchived).toBe(true);
    expect(mockRecordChangelog).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/orgs/:orgSlug/specs/:specId/unarchive — idempotency', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockArchiveLibrarySpec.mockReset();
    mockRecordChangelog.mockReset();
  });

  it('skips changelog when spec is already active (idempotent)', async () => {
    mockArchiveLibrarySpec.mockResolvedValue({ spec: fakeSpecResult({ isArchived: false }), wasChanged: false });
    const { app } = buildApp();

    const res = await app.inject({
      method: 'PATCH',
      url: '/api/orgs/acme-corp/specs/spec-1/unarchive',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().isArchived).toBe(false);
    expect(mockRecordChangelog).not.toHaveBeenCalled();
  });
});

describe('GET /api/orgs/:orgSlug/specs/:specId/archive-impact', () => {
  beforeEach(() => {
    currentOrgContext = { ...adminOrgContext };
    mockGetArchiveImpact.mockReset();
    mockGetArchiveImpact.mockResolvedValue({
      specId: 'spec-1',
      activePlaybooks: [{ id: 'pb-1', name: 'Sprint Release' }],
      archivedPlaybooks: [{ id: 'pb-2', name: 'Q4 Release' }],
    });
  });

  it('returns 200 with grouped playbook impact', async () => {
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/spec-1/archive-impact',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.specId).toBe('spec-1');
    expect(body.activePlaybooks).toHaveLength(1);
    expect(body.archivedPlaybooks).toHaveLength(1);
  });

  it('returns 403 AUTH_ROLE_INSUFFICIENT when caller is a member', async () => {
    currentOrgContext = { ...adminOrgContext, role: 'member' };
    const { app } = buildApp();

    const res = await app.inject({
      method: 'GET',
      url: '/api/orgs/acme-corp/specs/spec-1/archive-impact',
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().code).toBe('AUTH_ROLE_INSUFFICIENT');
    expect(mockGetArchiveImpact).not.toHaveBeenCalled();
  });
});
