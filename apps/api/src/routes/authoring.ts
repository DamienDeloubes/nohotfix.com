import { randomUUID } from 'node:crypto';

import { getSpecChangelog, recordChangelog, recordPlaybookChanges, recordSpecChanges, type PlaybookSnapshot, type SpecSnapshot } from '@nohotfix/domain-audit';
import {
  addSpecToSection,
  archiveLibrarySpec,
  archivePlaybook,
  AuthorSpecNotFoundError,
  createLibrarySpec,
  createPlaybook,
  createSection,
  deleteSection,
  getArchiveImpact,
  getPlaybookArchiveInfo,
  getPlaybookDetail,
  listLibrarySpecs,
  removeSpecFromSection,
  reorderSections,
  reorderSpecs,
  updateLibrarySpec,
  updatePlaybook,
  updateSection,
} from '@nohotfix/domain-authoring';
import {
  AddSpecFromLibraryRequestSchema,
  CreateLibrarySpecRequestSchema,
  CreatePlaybookRequestSchema,
  CreateSectionRequestSchema,
  ListSpecsRequestSchema,
  ReorderSectionsRequestSchema,
  ReorderSpecsRequestSchema,
  UpdateLibrarySpecRequestSchema,
  UpdatePlaybookRequestSchema,
  UpdateSectionRequestSchema,
} from '@nohotfix/shared';
import type { FastifyInstance } from 'fastify';

import { getSpan } from '../shared/lib/tracing.js';
import { archivedPlaybookGuard } from '../shared/middleware/archived-playbook-guard.js';
import { authMiddleware } from '../shared/middleware/auth.js';
import { orgScopeMiddleware } from '../shared/middleware/org-scope.js';
import { roleGuard } from '../shared/middleware/role-guard.js';

export async function authoringRoutes(fastify: FastifyInstance): Promise<void> {
  // ── Spec Library ─────────────────────────────────────────────────────────

  // GET /api/orgs/:orgSlug/specs — list specs with search/filter/sort/pagination
  fastify.get('/api/orgs/:orgSlug/specs', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);

    const parsed = ListSpecsRequestSchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid query parameters', details: parsed.error.flatten() });
    }

    const { tab, q, severity, sort, order, page } = parsed.data;

    span.setAttribute('filter.tab', tab);
    if (q) span.setAttribute('search.term', q);
    if (severity) span.setAttribute('filter.severity', severity);
    span.setAttribute('sort.column', sort);
    span.setAttribute('sort.order', order);
    span.setAttribute('filter.page', page);

    const result = await listLibrarySpecs({ specLibraryRepo: request.server.root.specLibraryRepo }, { orgId, tab, search: q, severity, sort, order, page });

    span.setAttribute('result.total', result.total);

    return reply.send(result);
  });

  // POST /api/orgs/:orgSlug/specs — create a new spec
  fastify.post('/api/orgs/:orgSlug/specs', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId, email } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);

    const parsed = CreateLibrarySpecRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('validation.passed', true);

    const specId = randomUUID();
    const result = await request.server.root.withTransaction(async (txRoot) => {
      const spec = await createLibrarySpec(
        { specLibraryRepo: txRoot.specLibraryRepo },
        {
          id: specId,
          orgId,
          createdBy: userId,
          title: parsed.data.title,
          systemUnderTest: parsed.data.systemUnderTest ?? null,
          severity: parsed.data.severity,
          preconditions: parsed.data.preconditions,
          description: parsed.data.description,
          testSteps: parsed.data.testSteps,
          expectedResult: parsed.data.expectedResult,
          artifactRequirements: parsed.data.artifactRequirements?.map((a) => ({ ...a, description: 'description' in a ? (a.description ?? null) : null })),
          testerNotes: parsed.data.testerNotes ?? null,
          estimatedDurationMinutes: parsed.data.estimatedDurationMinutes ?? null,
          tags: parsed.data.tags,
        },
      );

      await recordChangelog(
        { changelogRepo: txRoot.changelogRepo },
        {
          orgId,
          entityType: 'spec_library',
          entityId: spec.id,
          action: 'created',
          actorId: userId,
          actorName: email,
        },
      );

      return spec;
    });

    span.setAttribute('spec.id', result.id);
    span.setAttribute('spec.title', result.title);

    return reply.code(201).send(result);
  });

  // PUT /api/orgs/:orgSlug/specs/:specId — update an existing spec
  fastify.put('/api/orgs/:orgSlug/specs/:specId', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId, email } = request.orgContext!;
    const { specId } = request.params as { specId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);
    span.setAttribute('spec.id', specId);

    const parsed = UpdateLibrarySpecRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('validation.passed', true);

    const result = await request.server.root.withTransaction(async (txRoot) => {
      // Build old snapshot before update
      const existing = await txRoot.specLibraryRepo.findById(specId, orgId);
      if (!existing) {
        throw new AuthorSpecNotFoundError(specId);
      }

      const oldSnapshot: SpecSnapshot = {
        title: existing.title,
        description: existing.description,
        tags: existing.tags ?? [],
        estimatedDurationMinutes: existing.estimatedDurationMinutes,
        artifactRequirements: existing.artifactRequirements as Array<{ label: string; [key: string]: unknown }> | null,
        systemUnderTest: existing.systemUnderTest,
        severity: existing.severity,
        preconditions: existing.preconditions,
        testSteps: existing.testSteps,
        expectedResult: existing.expectedResult,
        testerNotes: existing.testerNotes,
      };

      const updated = await updateLibrarySpec(
        { specLibraryRepo: txRoot.specLibraryRepo },
        {
          id: specId,
          orgId,
          title: parsed.data.title,
          systemUnderTest: parsed.data.systemUnderTest ?? null,
          severity: parsed.data.severity,
          preconditions: parsed.data.preconditions,
          description: parsed.data.description,
          testSteps: parsed.data.testSteps,
          expectedResult: parsed.data.expectedResult,
          artifactRequirements: parsed.data.artifactRequirements?.map((a) => ({ ...a, description: 'description' in a ? (a.description ?? null) : null })),
          testerNotes: parsed.data.testerNotes ?? null,
          estimatedDurationMinutes: parsed.data.estimatedDurationMinutes ?? null,
          tags: parsed.data.tags,
        },
      );

      // Build new snapshot and record changes
      const newSnapshot: SpecSnapshot = {
        title: updated.title,
        description: updated.description,
        tags: updated.tags ?? [],
        estimatedDurationMinutes: updated.estimatedDurationMinutes,
        artifactRequirements: updated.artifactRequirements as Array<{ label: string; [key: string]: unknown }> | null,
        systemUnderTest: updated.systemUnderTest,
        severity: updated.severity,
        preconditions: updated.preconditions,
        testSteps: updated.testSteps,
        expectedResult: updated.expectedResult,
        testerNotes: updated.testerNotes,
      };

      await recordSpecChanges(
        { changelogRepo: txRoot.changelogRepo },
        {
          orgId,
          specId,
          actorId: userId,
          actorName: email,
          oldSpec: oldSnapshot,
          newSpec: newSnapshot,
        },
      );

      return { updated, oldSnapshot, newSnapshot };
    });

    // Track which fields changed
    const changedFields = Object.keys(result.oldSnapshot).filter(
      (k) => JSON.stringify(result.oldSnapshot[k as keyof typeof result.oldSnapshot]) !== JSON.stringify(result.newSnapshot[k as keyof typeof result.newSnapshot]),
    );
    if (changedFields.length > 0) {
      span.setAttribute('changelog.fields_changed', changedFields.join(','));
    }

    return reply.code(200).send(result.updated);
  });

  // GET /api/orgs/:orgSlug/specs/systems-under-test — distinct values for combobox
  fastify.get('/api/orgs/:orgSlug/specs/systems-under-test', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);

    const systems = await request.server.root.specLibraryRepo.findDistinctSystemsUnderTest(orgId);

    return reply.send({ systems });
  });

  // GET /api/orgs/:orgSlug/specs/tags — distinct tag values for combobox
  fastify.get('/api/orgs/:orgSlug/specs/tags', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);

    const tags = await request.server.root.specLibraryRepo.findDistinctTags(orgId);

    return reply.send({ tags });
  });

  // GET /api/orgs/:orgSlug/specs/:specId — get a single spec
  fastify.get('/api/orgs/:orgSlug/specs/:specId', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId } = request.orgContext!;
    const { specId } = request.params as { specId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);
    span.setAttribute('spec.id', specId);

    const entry = await request.server.root.specLibraryRepo.findById(specId, orgId);
    if (!entry) {
      throw new AuthorSpecNotFoundError(specId);
    }

    return reply.send({
      id: entry.id,
      orgId: entry.orgId,
      title: entry.title,
      systemUnderTest: entry.systemUnderTest,
      severity: entry.severity,
      preconditions: entry.preconditions,
      description: entry.description,
      testSteps: entry.testSteps,
      expectedResult: entry.expectedResult,
      artifactRequirements: entry.artifactRequirements,
      testerNotes: entry.testerNotes,
      estimatedDurationMinutes: entry.estimatedDurationMinutes,
      tags: entry.tags,
      isArchived: entry.isArchived,
      createdBy: entry.createdBy,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    });
  });

  // GET /api/orgs/:orgSlug/specs/:specId/archive-impact — preview playbook impact before archiving
  fastify.get('/api/orgs/:orgSlug/specs/:specId/archive-impact', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    const { specId } = request.params as { specId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('spec.id', specId);

    const impact = await getArchiveImpact({ specLibraryRepo: request.server.root.specLibraryRepo, playbookSpecRepo: request.server.root.playbookSpecRepo }, { specId, orgId });

    return reply.code(200).send(impact);
  });

  // PATCH /api/orgs/:orgSlug/specs/:specId/archive — archive a spec
  fastify.patch('/api/orgs/:orgSlug/specs/:specId/archive', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId, email } = request.orgContext!;
    const { specId } = request.params as { specId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);
    span.setAttribute('spec.id', specId);
    span.setAttribute('spec.action', 'archive');

    const result = await request.server.root.withTransaction(async (txRoot) => {
      // BEFORE archive: capture spec title and all affected playbooks with section context
      const libSpec = await txRoot.specLibraryRepo.findById(specId, orgId);
      const specTitle = libSpec?.title ?? '(deleted spec)';
      const affectedPlaybookSpecs = await txRoot.playbookSpecRepo.findByLibrarySpec(specId, orgId);

      // Build a map of sectionId → sectionName for all affected sections
      const affectedPlaybookIds = [...new Set(affectedPlaybookSpecs.map((ps) => ps.playbookId))];
      const sectionNameMap = new Map<string, string>();
      for (const pbId of affectedPlaybookIds) {
        const sections = await txRoot.playbookSectionRepo.findByPlaybook(pbId, orgId);
        for (const sec of sections) {
          sectionNameMap.set(sec.id, sec.name);
        }
      }

      const { spec, wasChanged } = await archiveLibrarySpec(
        { specLibraryRepo: txRoot.specLibraryRepo, playbookSpecRepo: txRoot.playbookSpecRepo },
        { specId, orgId, archive: true },
      );

      if (wasChanged) {
        // Record spec_library changelog entry
        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'spec_library',
            entityId: specId,
            action: 'archived',
            actorId: userId,
            actorName: email,
          },
        );

        // Record spec_archived on each affected playbook
        for (const ps of affectedPlaybookSpecs) {
          await recordChangelog(
            { changelogRepo: txRoot.changelogRepo },
            {
              orgId,
              entityType: 'playbook',
              entityId: ps.playbookId,
              action: 'spec_archived',
              actorId: userId,
              actorName: email,
              fieldChanges: {
                specLibraryId: specId,
                specTitle,
                sectionId: ps.sectionId,
                sectionName: ps.sectionId ? (sectionNameMap.get(ps.sectionId) ?? null) : null,
              } as unknown as Record<string, { old: unknown; new: unknown }>,
            },
          );
        }
      }

      return spec;
    });

    return reply.code(200).send(result);
  });

  // PATCH /api/orgs/:orgSlug/specs/:specId/unarchive — unarchive a spec
  fastify.patch('/api/orgs/:orgSlug/specs/:specId/unarchive', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId, email } = request.orgContext!;
    const { specId } = request.params as { specId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);
    span.setAttribute('spec.id', specId);
    span.setAttribute('spec.action', 'unarchive');

    const result = await request.server.root.withTransaction(async (txRoot) => {
      const { spec, wasChanged } = await archiveLibrarySpec(
        { specLibraryRepo: txRoot.specLibraryRepo, playbookSpecRepo: txRoot.playbookSpecRepo },
        { specId, orgId, archive: false },
      );

      if (wasChanged) {
        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'spec_library',
            entityId: specId,
            action: 'unarchived',
            actorId: userId,
            actorName: email,
          },
        );
      }

      return spec;
    });

    return reply.code(200).send(result);
  });

  // GET /api/orgs/:orgSlug/specs/:specId/history — spec change history
  fastify.get('/api/orgs/:orgSlug/specs/:specId/history', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    const { specId } = request.params as { specId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('spec.id', specId);

    const spec = await request.server.root.specLibraryRepo.findById(specId, orgId);
    if (!spec) {
      throw new AuthorSpecNotFoundError(specId);
    }

    const entries = await getSpecChangelog({ changelogRepo: request.server.root.changelogRepo }, { orgId, specId });

    span.setAttribute('result.count', entries.length);

    return reply.send({
      entries: entries.map((e) => ({
        id: e.id,
        action: e.action,
        fieldChanges: e.fieldChanges,
        actorName: e.actorName,
        isRemovedMember: e.isRemovedMember,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  });

  // ── Playbooks ───────────────────────────────────────────────────────────

  // GET /api/orgs/:orgSlug/playbooks — list playbooks with counts
  fastify.get('/api/orgs/:orgSlug/playbooks', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);

    const query = request.query as { isArchived?: string };
    const isArchivedFilter = query.isArchived === 'true' ? true : false;
    span.setAttribute('filter.isArchived', isArchivedFilter);

    const playbooks = await request.server.root.playbookRepo.findByOrgWithCounts(orgId, isArchivedFilter);

    span.setAttribute('result.count', playbooks.length);

    return reply.send({ playbooks });
  });

  // POST /api/orgs/:orgSlug/playbooks — create a new playbook
  fastify.post('/api/orgs/:orgSlug/playbooks', { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug, userId, email } = request.orgContext!;
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('user.id', userId);

    const parsed = CreatePlaybookRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      span.setAttribute('validation.passed', false);
      return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    span.setAttribute('validation.passed', true);

    const playbook = await request.server.root.withTransaction(async (txRoot) => {
      const pb = await createPlaybook(
        { playbookRepo: txRoot.playbookRepo },
        {
          orgId,
          name: parsed.data.name,
          ...(parsed.data.description != null && { description: parsed.data.description }),
          ...(parsed.data.environmentId != null && { environmentId: parsed.data.environmentId }),
          createdBy: userId,
        },
      );

      await recordChangelog(
        { changelogRepo: txRoot.changelogRepo },
        {
          orgId,
          entityType: 'playbook',
          entityId: pb.id,
          action: 'created',
          actorId: userId,
          actorName: email,
        },
      );

      return pb;
    });

    span.setAttribute('playbook.id', playbook.id);
    span.setAttribute('playbook.name', playbook.name);
    if (playbook.environmentId) span.setAttribute('playbook.environment_id', playbook.environmentId);

    return reply.code(201).send({
      id: playbook.id,
      name: playbook.name,
      ...(playbook.description != null && { description: playbook.description }),
      ...(playbook.environmentId != null && { environmentId: playbook.environmentId }),
      isArchived: playbook.isArchived,
      createdBy: playbook.createdBy,
      createdAt: playbook.createdAt.toISOString(),
      updatedAt: playbook.updatedAt.toISOString(),
    });
  });

  // GET /api/orgs/:orgSlug/playbooks/:playbookId — full playbook with sections and specs
  fastify.get('/api/orgs/:orgSlug/playbooks/:playbookId', { preHandler: [authMiddleware, orgScopeMiddleware] }, async (request, reply) => {
    const span = getSpan(request);
    const { orgId, orgSlug } = request.orgContext!;
    const { playbookId } = request.params as { playbookId: string };
    span.setAttribute('org.slug', orgSlug);
    span.setAttribute('playbook.id', playbookId);

    const result = await getPlaybookDetail({ playbookRepo: request.server.root.playbookRepo }, { playbookId, orgId });

    span.setAttribute('result.section_count', result.sections.length);
    span.setAttribute('result.spec_count', result.sections.reduce((sum, s) => sum + s.specs.length, 0) + result.ungroupedSpecs.length);
    span.setAttribute('result.ungrouped_spec_count', result.ungroupedSpecs.length);

    return reply.send({
      playbook: {
        id: result.playbook.id,
        name: result.playbook.name,
        ...(result.playbook.description != null && { description: result.playbook.description }),
        ...(result.playbook.environmentId != null && { environmentId: result.playbook.environmentId }),
        isArchived: result.playbook.isArchived,
        createdBy: result.playbook.createdBy,
        createdAt: result.playbook.createdAt.toISOString(),
        updatedAt: result.playbook.updatedAt.toISOString(),
      },
      sections: result.sections,
      ungroupedSpecs: result.ungroupedSpecs,
    });
  });

  // GET /api/orgs/:orgSlug/playbooks/:playbookId/archive-info — active run count for archive dialog
  fastify.get(
    '/api/orgs/:orgSlug/playbooks/:playbookId/archive-info',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);

      const result = await getPlaybookArchiveInfo({ playbookRepo: request.server.root.playbookRepo }, { playbookId, orgId });

      span.setAttribute('playbook.activeRunCount', result.activeRunCount);

      return reply.code(200).send(result);
    },
  );

  // PATCH /api/orgs/:orgSlug/playbooks/:playbookId/archive — archive a playbook
  fastify.patch(
    '/api/orgs/:orgSlug/playbooks/:playbookId/archive',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('user.id', userId);
      span.setAttribute('playbook.id', playbookId);
      span.setAttribute('playbook.action', 'archive');

      const result = await request.server.root.withTransaction(async (txRoot) => {
        const { playbook, wasChanged } = await archivePlaybook({ playbookRepo: txRoot.playbookRepo }, { playbookId, orgId, isArchived: true });

        if (wasChanged) {
          await recordChangelog(
            { changelogRepo: txRoot.changelogRepo },
            {
              orgId,
              entityType: 'playbook',
              entityId: playbookId,
              action: 'archived',
              actorId: userId,
              actorName: email,
            },
          );
        }

        return { playbook, wasChanged };
      });

      span.setAttribute('playbook.isArchived', true);
      span.setAttribute('playbook.wasChanged', result.wasChanged);

      return reply.code(200).send(result);
    },
  );

  // PATCH /api/orgs/:orgSlug/playbooks/:playbookId/unarchive — unarchive a playbook
  fastify.patch(
    '/api/orgs/:orgSlug/playbooks/:playbookId/unarchive',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' })] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('user.id', userId);
      span.setAttribute('playbook.id', playbookId);
      span.setAttribute('playbook.action', 'unarchive');

      const result = await request.server.root.withTransaction(async (txRoot) => {
        const { playbook, wasChanged } = await archivePlaybook({ playbookRepo: txRoot.playbookRepo }, { playbookId, orgId, isArchived: false });

        if (wasChanged) {
          await recordChangelog(
            { changelogRepo: txRoot.changelogRepo },
            {
              orgId,
              entityType: 'playbook',
              entityId: playbookId,
              action: 'unarchived',
              actorId: userId,
              actorName: email,
            },
          );
        }

        return { playbook, wasChanged };
      });

      span.setAttribute('playbook.isArchived', false);
      span.setAttribute('playbook.wasChanged', result.wasChanged);

      return reply.code(200).send(result);
    },
  );

  // PATCH /api/orgs/:orgSlug/playbooks/:playbookId — update playbook metadata
  fastify.patch(
    '/api/orgs/:orgSlug/playbooks/:playbookId',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('user.id', userId);
      span.setAttribute('playbook.id', playbookId);

      const parsed = UpdatePlaybookRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        span.setAttribute('validation.passed', false);
        return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
      }

      span.setAttribute('validation.passed', true);
      const updatedFields = Object.keys(parsed.data).filter((k) => parsed.data[k as keyof typeof parsed.data] !== undefined);
      span.setAttribute('update.fields', updatedFields.join(','));

      const playbook = await request.server.root.withTransaction(async (txRoot) => {
        // Capture old state before update
        const existing = await txRoot.playbookRepo.findById(playbookId, orgId);
        let oldEnvName: string | null = null;
        if (existing?.environmentId) {
          const oldEnv = await request.server.root.environmentRepo.findById(existing.environmentId, orgId);
          oldEnvName = oldEnv?.name.value ?? null;
        }

        const oldSnapshot: PlaybookSnapshot = {
          name: existing?.name ?? '',
          description: existing?.description ?? null,
          environmentId: existing?.environmentId ?? null,
          environmentName: oldEnvName,
        };

        const updated = await updatePlaybook(
          { playbookRepo: txRoot.playbookRepo },
          {
            id: playbookId,
            orgId,
            ...(parsed.data.name != null ? { name: parsed.data.name } : {}),
            ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
            ...(parsed.data.environmentId !== undefined ? { environmentId: parsed.data.environmentId } : {}),
          },
        );

        // Resolve new environment name
        let newEnvName: string | null = null;
        if (updated.environmentId) {
          const newEnv = await request.server.root.environmentRepo.findById(updated.environmentId, orgId);
          newEnvName = newEnv?.name.value ?? null;
        }

        const newSnapshot: PlaybookSnapshot = {
          name: updated.name,
          description: updated.description ?? null,
          environmentId: updated.environmentId ?? null,
          environmentName: newEnvName,
        };

        await recordPlaybookChanges(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            playbookId,
            actorId: userId,
            actorName: email,
            oldPlaybook: oldSnapshot,
            newPlaybook: newSnapshot,
          },
        );

        return updated;
      });

      return reply.send({
        id: playbook.id,
        name: playbook.name,
        ...(playbook.description != null && { description: playbook.description }),
        ...(playbook.environmentId != null && { environmentId: playbook.environmentId }),
        isArchived: playbook.isArchived,
        createdBy: playbook.createdBy,
        createdAt: playbook.createdAt.toISOString(),
        updatedAt: playbook.updatedAt.toISOString(),
      });
    },
  );

  // POST /api/orgs/:orgSlug/playbooks/:playbookId/sections — create section
  fastify.post(
    '/api/orgs/:orgSlug/playbooks/:playbookId/sections',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);

      const parsed = CreateSectionRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        span.setAttribute('validation.passed', false);
        return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
      }

      span.setAttribute('validation.passed', true);

      const section = await request.server.root.withTransaction(async (txRoot) => {
        const sec = await createSection({ playbookRepo: txRoot.playbookRepo, playbookSectionRepo: txRoot.playbookSectionRepo }, { playbookId, orgId, name: parsed.data.name });

        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'playbook',
            entityId: playbookId,
            action: 'section_added',
            actorId: userId,
            actorName: email,
            fieldChanges: { sectionId: sec.id, name: sec.name } as unknown as Record<string, { old: unknown; new: unknown }>,
          },
        );

        return sec;
      });

      span.setAttribute('section.id', section.id);
      span.setAttribute('section.name', section.name);
      span.setAttribute('section.position', section.position);

      return reply.code(201).send({
        id: section.id,
        playbookId: section.playbookId,
        name: section.name,
        position: section.position,
        createdAt: section.createdAt.toISOString(),
      });
    },
  );

  // PATCH /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId — update section
  fastify.patch(
    '/api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId, sectionId } = request.params as { playbookId: string; sectionId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);
      span.setAttribute('section.id', sectionId);

      const parsed = UpdateSectionRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        span.setAttribute('validation.passed', false);
        return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
      }

      span.setAttribute('validation.passed', true);

      const section = await request.server.root.withTransaction(async (txRoot) => {
        // Capture old section name before update
        const sections = await txRoot.playbookSectionRepo.findByPlaybook(playbookId, orgId);
        const oldSection = sections.find((s) => s.id === sectionId);
        const oldName = oldSection?.name ?? '';

        const updated = await updateSection(
          { playbookSectionRepo: txRoot.playbookSectionRepo },
          { sectionId, orgId, ...(parsed.data.name != null ? { name: parsed.data.name } : {}) },
        );

        if (parsed.data.name != null && oldName !== updated.name) {
          await recordChangelog(
            { changelogRepo: txRoot.changelogRepo },
            {
              orgId,
              entityType: 'playbook',
              entityId: playbookId,
              action: 'section_renamed',
              actorId: userId,
              actorName: email,
              fieldChanges: { sectionId, old: oldName, new: updated.name } as unknown as Record<string, { old: unknown; new: unknown }>,
            },
          );
        }

        return updated;
      });

      return reply.send({
        id: section.id,
        playbookId: section.playbookId,
        name: section.name,
        position: section.position,
        createdAt: section.createdAt.toISOString(),
      });
    },
  );

  // DELETE /api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId — delete section
  fastify.delete(
    '/api/orgs/:orgSlug/playbooks/:playbookId/sections/:sectionId',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId, sectionId } = request.params as { playbookId: string; sectionId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);
      span.setAttribute('section.id', sectionId);

      await request.server.root.withTransaction(async (txRoot) => {
        // Capture section name and spec count before deletion
        const sections = await txRoot.playbookSectionRepo.findByPlaybook(playbookId, orgId);
        const section = sections.find((s) => s.id === sectionId);
        const sectionName = section?.name ?? '';
        const specsInSection = await txRoot.playbookSpecRepo.findBySection(sectionId, orgId);
        const specCount = specsInSection.length;
        span.setAttribute('result.specs_removed', specCount);

        await deleteSection({ playbookSectionRepo: txRoot.playbookSectionRepo, playbookSpecRepo: txRoot.playbookSpecRepo }, { sectionId, orgId });

        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'playbook',
            entityId: playbookId,
            action: 'section_removed',
            actorId: userId,
            actorName: email,
            fieldChanges: { sectionId, name: sectionName, specCount } as unknown as Record<string, { old: unknown; new: unknown }>,
          },
        );
      });

      return reply.code(204).send();
    },
  );

  // POST /api/orgs/:orgSlug/playbooks/:playbookId/sections/reorder — reorder sections
  fastify.post(
    '/api/orgs/:orgSlug/playbooks/:playbookId/sections/reorder',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);

      const parsed = ReorderSectionsRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        span.setAttribute('validation.passed', false);
        return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
      }

      span.setAttribute('validation.passed', true);
      span.setAttribute('reorder.count', parsed.data.orderedIds.length);

      await request.server.root.withTransaction(async (txRoot) => {
        await reorderSections({ playbookRepo: txRoot.playbookRepo, playbookSectionRepo: txRoot.playbookSectionRepo }, { playbookId, orderedIds: parsed.data.orderedIds, orgId });

        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'playbook',
            entityId: playbookId,
            action: 'sections_reordered',
            actorId: userId,
            actorName: email,
            fieldChanges: { orderedIds: parsed.data.orderedIds } as unknown as Record<string, { old: unknown; new: unknown }>,
          },
        );
      });

      return reply.send({ success: true });
    },
  );
  // POST /api/orgs/:orgSlug/playbooks/:playbookId/specs — add spec from library
  fastify.post(
    '/api/orgs/:orgSlug/playbooks/:playbookId/specs',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);

      const parsed = AddSpecFromLibraryRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        span.setAttribute('validation.passed', false);
        return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
      }

      span.setAttribute('validation.passed', true);

      const result = await request.server.root.withTransaction(async (txRoot) => {
        const spec = await addSpecToSection(
          {
            playbookRepo: txRoot.playbookRepo,
            playbookSectionRepo: txRoot.playbookSectionRepo,
            playbookSpecRepo: txRoot.playbookSpecRepo,
            specLibraryRepo: txRoot.specLibraryRepo,
          },
          {
            playbookId,
            specLibraryId: parsed.data.specLibraryId,
            sectionId: parsed.data.sectionId ?? null,
            orgId,
          },
        );

        // Resolve spec title and section name for changelog
        const libSpec = await txRoot.specLibraryRepo.findById(spec.specLibraryId, orgId);
        let sectionName: string | null = null;
        if (spec.sectionId) {
          const sections = await txRoot.playbookSectionRepo.findByPlaybook(playbookId, orgId);
          const section = sections.find((s) => s.id === spec.sectionId);
          sectionName = section?.name ?? null;
        }

        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'playbook',
            entityId: playbookId,
            action: 'spec_added',
            actorId: userId,
            actorName: email,
            fieldChanges: {
              specLibraryId: spec.specLibraryId,
              specTitle: libSpec?.title ?? '(deleted spec)',
              sectionId: spec.sectionId,
              sectionName,
            } as unknown as Record<string, { old: unknown; new: unknown }>,
          },
        );

        return { spec, libSpec };
      });

      span.setAttribute('spec.id', result.spec.id);
      span.setAttribute('spec.library_id', result.spec.specLibraryId);
      span.setAttribute('spec.section_id', result.spec.sectionId ?? 'ungrouped');

      return reply.code(201).send({
        id: result.spec.id,
        sectionId: result.spec.sectionId,
        specLibraryId: result.spec.specLibraryId,
        title: result.libSpec?.title ?? '(deleted spec)',
        severity: result.libSpec?.severity ?? null,
        systemUnderTest: result.libSpec?.systemUnderTest ?? null,
        position: result.spec.position,
      });
    },
  );

  // DELETE /api/orgs/:orgSlug/playbooks/:playbookId/specs/:specId — remove spec from playbook
  fastify.delete(
    '/api/orgs/:orgSlug/playbooks/:playbookId/specs/:specId',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId, specId } = request.params as { playbookId: string; specId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);
      span.setAttribute('spec.id', specId);

      await request.server.root.withTransaction(async (txRoot) => {
        // Capture spec details before deletion
        const allSpecs = await txRoot.playbookSpecRepo.findByPlaybook(playbookId, orgId);
        const specRecord = allSpecs.find((s) => s.id === specId);
        const specLibraryId = specRecord?.specLibraryId ?? '';
        const sectionId = specRecord?.sectionId ?? null;

        const libSpec = specLibraryId ? await txRoot.specLibraryRepo.findById(specLibraryId, orgId) : undefined;
        let sectionName: string | null = null;
        if (sectionId) {
          const sections = await txRoot.playbookSectionRepo.findByPlaybook(playbookId, orgId);
          const section = sections.find((s) => s.id === sectionId);
          sectionName = section?.name ?? null;
        }

        await removeSpecFromSection({ playbookSpecRepo: txRoot.playbookSpecRepo }, { specId, orgId });

        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'playbook',
            entityId: playbookId,
            action: 'spec_removed',
            actorId: userId,
            actorName: email,
            fieldChanges: {
              specLibraryId,
              specTitle: libSpec?.title ?? '(deleted spec)',
              sectionId,
              sectionName,
            } as unknown as Record<string, { old: unknown; new: unknown }>,
          },
        );
      });

      return reply.code(204).send();
    },
  );

  // POST /api/orgs/:orgSlug/playbooks/:playbookId/specs/reorder — reorder specs
  fastify.post(
    '/api/orgs/:orgSlug/playbooks/:playbookId/specs/reorder',
    { preHandler: [authMiddleware, orgScopeMiddleware, roleGuard({ minimum: 'admin' }), archivedPlaybookGuard] },
    async (request, reply) => {
      const span = getSpan(request);
      const { orgId, orgSlug, userId, email } = request.orgContext!;
      const { playbookId } = request.params as { playbookId: string };
      span.setAttribute('org.slug', orgSlug);
      span.setAttribute('playbook.id', playbookId);

      const parsed = ReorderSpecsRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        span.setAttribute('validation.passed', false);
        return reply.code(400).send({ error: 'Invalid request body', details: parsed.error.flatten() });
      }

      span.setAttribute('validation.passed', true);
      span.setAttribute('reorder.section_id', parsed.data.sectionId ?? 'ungrouped');
      span.setAttribute('reorder.count', parsed.data.orderedIds.length);

      await request.server.root.withTransaction(async (txRoot) => {
        await reorderSpecs(
          {
            playbookRepo: txRoot.playbookRepo,
            playbookSpecRepo: txRoot.playbookSpecRepo,
          },
          {
            playbookId,
            sectionId: parsed.data.sectionId ?? null,
            orderedIds: parsed.data.orderedIds,
            orgId,
          },
        );

        // Resolve section name if sectionId provided
        let sectionName: string | null = null;
        const sectionId = parsed.data.sectionId ?? null;
        if (sectionId) {
          const sections = await txRoot.playbookSectionRepo.findByPlaybook(playbookId, orgId);
          const section = sections.find((s) => s.id === sectionId);
          sectionName = section?.name ?? null;
        }

        await recordChangelog(
          { changelogRepo: txRoot.changelogRepo },
          {
            orgId,
            entityType: 'playbook',
            entityId: playbookId,
            action: 'specs_reordered',
            actorId: userId,
            actorName: email,
            fieldChanges: {
              sectionId,
              sectionName,
              orderedIds: parsed.data.orderedIds,
            } as unknown as Record<string, { old: unknown; new: unknown }>,
          },
        );
      });

      return reply.send({ success: true });
    },
  );
}
