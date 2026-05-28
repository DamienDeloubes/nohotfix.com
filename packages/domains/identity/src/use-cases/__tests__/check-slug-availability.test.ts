import { describe, expect, it, vi } from 'vitest';

import type { OrganisationRepository } from '../../ports/organisation-repository.js';
import { checkSlugAvailability } from '../check-slug-availability.js';

function mockOrgRepo(slugExists: boolean): Pick<OrganisationRepository, 'slugExists'> {
  return { slugExists: vi.fn().mockResolvedValue(slugExists) };
}

describe('checkSlugAvailability', () => {
  it('returns available true when slug does not exist', async () => {
    const repo = mockOrgRepo(false);
    const result = await checkSlugAvailability({ organisationRepo: repo as OrganisationRepository }, 'my-org');
    expect(result).toEqual({ available: true });
    expect(repo.slugExists).toHaveBeenCalledWith('my-org');
  });

  it('returns available false when slug already exists', async () => {
    const repo = mockOrgRepo(true);
    const result = await checkSlugAvailability({ organisationRepo: repo as OrganisationRepository }, 'taken-slug');
    expect(result).toEqual({ available: false });
  });
});
