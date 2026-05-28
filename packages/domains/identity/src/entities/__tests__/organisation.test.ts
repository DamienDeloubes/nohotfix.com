import { describe, expect, it } from 'vitest';

import { OrganisationEntity } from '../organisation.js';
import { OrganisationName } from '../value-objects/organisation-name.js';
import { OrganisationSlug } from '../value-objects/organisation-slug.js';

describe('OrganisationEntity', () => {
  it('creates with timestamps', () => {
    const org = OrganisationEntity.create({ id: 'org-1', name: 'Acme Corp', slug: 'acme-corp' });
    expect(org.id).toBe('org-1');
    expect(org.name.value).toBe('Acme Corp');
    expect(org.slug.value).toBe('acme-corp');
    expect(org.createdAt).toBeInstanceOf(Date);
    expect(org.updatedAt).toBeInstanceOf(Date);
  });

  it('reconstitutes from props', () => {
    const now = new Date();
    const org = OrganisationEntity.reconstitute({
      id: 'org-1',
      name: OrganisationName.create('Acme'),
      slug: OrganisationSlug.create('acme'),
      createdAt: now,
      updatedAt: now,
    });
    expect(org.id).toBe('org-1');
    expect(org.name.value).toBe('Acme');
    expect(org.slug.value).toBe('acme');
  });

  it('rename returns new instance', () => {
    const org = OrganisationEntity.create({ id: 'org-1', name: 'Old Name', slug: 'old-name' });
    const renamed = org.rename('New Name');

    expect(renamed).not.toBe(org);
    expect(renamed.name.value).toBe('New Name');
    expect(renamed.id).toBe(org.id);
    expect(renamed.slug.value).toBe('old-name');
    expect(renamed.createdAt).toBe(org.createdAt);
    expect(org.name.value).toBe('Old Name');
  });

  it('rename validates new name', () => {
    const org = OrganisationEntity.create({ id: 'org-1', name: 'Valid', slug: 'valid' });
    expect(() => org.rename('')).toThrow();
  });
});
