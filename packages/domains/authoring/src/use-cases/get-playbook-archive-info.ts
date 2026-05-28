import type { PlaybookArchiveInfoResponse } from '@releasepilot/shared';

import { AuthorPlaybookNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';

export interface GetPlaybookArchiveInfoDeps {
  playbookRepo: PlaybookRepository;
}

export interface GetPlaybookArchiveInfoQuery {
  playbookId: string;
  orgId: string;
}

export async function getPlaybookArchiveInfo(deps: GetPlaybookArchiveInfoDeps, query: GetPlaybookArchiveInfoQuery): Promise<PlaybookArchiveInfoResponse> {
  const playbook = await deps.playbookRepo.findById(query.playbookId, query.orgId);
  if (!playbook) {
    throw new AuthorPlaybookNotFoundError(query.playbookId);
  }

  const activeRunCount = await deps.playbookRepo.countActiveRuns(query.playbookId, query.orgId);

  return {
    playbookId: query.playbookId,
    activeRunCount,
  };
}
