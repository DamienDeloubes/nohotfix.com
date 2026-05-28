import type { ChangelogRepository } from '../ports/changelog-repository.js';
import type { SpecChangelogEntry } from '../types.js';

export interface GetSpecChangelogDeps {
  changelogRepo: ChangelogRepository;
}

export async function getSpecChangelog(deps: GetSpecChangelogDeps, data: { orgId: string; specId: string }): Promise<SpecChangelogEntry[]> {
  const entries = await deps.changelogRepo.findBySpecWithMembership(data.orgId, data.specId);

  return entries.map((entry) => ({
    ...entry,
    actorName: entry.isRemovedMember ? 'Removed member' : entry.actorName,
  }));
}
