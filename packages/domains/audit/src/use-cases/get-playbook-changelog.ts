import type { ChangelogRepository } from '../ports/changelog-repository.js';
import type { PlaybookChangelogEntry } from '../types.js';

export interface GetPlaybookChangelogDeps {
  changelogRepo: ChangelogRepository;
}

export async function getPlaybookChangelog(deps: GetPlaybookChangelogDeps, data: { orgId: string; playbookId: string }): Promise<PlaybookChangelogEntry[]> {
  const entries = await deps.changelogRepo.findByPlaybookWithMembership(data.orgId, data.playbookId);

  return entries.map((entry) => ({
    ...entry,
    actorName: entry.isRemovedMember ? 'Removed member' : entry.actorName,
  }));
}
