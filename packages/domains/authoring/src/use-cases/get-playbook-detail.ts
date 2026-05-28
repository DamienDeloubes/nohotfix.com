import { AuthorPlaybookNotFoundError } from '../errors/index.js';
import type { PlaybookRepository } from '../ports/playbook-repository.js';
import type { PlaybookDetail } from '../types.js';

export interface GetPlaybookDetailDeps {
  playbookRepo: PlaybookRepository;
}

export interface GetPlaybookDetailQuery {
  playbookId: string;
  orgId: string;
}

export async function getPlaybookDetail(deps: GetPlaybookDetailDeps, query: GetPlaybookDetailQuery): Promise<PlaybookDetail> {
  const result = await deps.playbookRepo.findDetail(query.playbookId, query.orgId);
  if (!result) {
    throw new AuthorPlaybookNotFoundError(query.playbookId);
  }
  return result;
}
