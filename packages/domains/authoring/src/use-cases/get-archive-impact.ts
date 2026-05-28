import type { ArchiveImpactResponse } from '@nohotfix/shared';

import { AuthorSpecNotFoundError } from '../errors/index.js';
import type { PlaybookSpecRepository } from '../ports/playbook-spec-repository.js';
import type { SpecLibraryRepository } from '../ports/spec-library-repository.js';

export interface GetArchiveImpactDeps {
  specLibraryRepo: SpecLibraryRepository;
  playbookSpecRepo: PlaybookSpecRepository;
}

export interface GetArchiveImpactQuery {
  specId: string;
  orgId: string;
}

export async function getArchiveImpact(deps: GetArchiveImpactDeps, query: GetArchiveImpactQuery): Promise<ArchiveImpactResponse> {
  const spec = await deps.specLibraryRepo.findById(query.specId, query.orgId);
  if (!spec) {
    throw new AuthorSpecNotFoundError(query.specId);
  }

  const playbooks = await deps.playbookSpecRepo.findPlaybooksReferencingSpec(query.specId, query.orgId);

  const activePlaybooks = playbooks.filter((p) => !p.isArchived).map(({ id, name }) => ({ id, name }));
  const archivedPlaybooks = playbooks.filter((p) => p.isArchived).map(({ id, name }) => ({ id, name }));

  return {
    specId: query.specId,
    activePlaybooks,
    archivedPlaybooks,
  };
}
