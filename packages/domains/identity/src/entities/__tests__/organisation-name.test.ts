import { describe, expect, it } from 'vitest';

import { AuthOrgNameInvalidError } from '../../errors/index.js';
import { OrganisationName } from '../value-objects/organisation-name.js';

describe('OrganisationName', () => {
  it('creates from valid name', () => {
    const name = OrganisationName.create('Acme Corp');
    expect(name.value).toBe('Acme Corp');
  });

  it('trims whitespace', () => {
    const name = OrganisationName.create('  Acme Corp  ');
    expect(name.value).toBe('Acme Corp');
  });

  it('throws AuthOrgNameInvalidError on empty string', () => {
    expect(() => OrganisationName.create('')).toThrow(AuthOrgNameInvalidError);
  });

  it('throws AuthOrgNameInvalidError on whitespace-only string', () => {
    expect(() => OrganisationName.create('   ')).toThrow(AuthOrgNameInvalidError);
  });

  it('throws AuthOrgNameInvalidError on name exceeding 100 chars', () => {
    expect(() => OrganisationName.create('a'.repeat(101))).toThrow(AuthOrgNameInvalidError);
  });

  it('allows exactly 100 chars', () => {
    const name = OrganisationName.create('a'.repeat(100));
    expect(name.value.length).toBe(100);
  });

  it('allows single character', () => {
    const name = OrganisationName.create('X');
    expect(name.value).toBe('X');
  });

  it('equals same name', () => {
    const a = OrganisationName.create('Acme');
    const b = OrganisationName.create('Acme');
    expect(a.equals(b)).toBe(true);
  });

  it('does not equal different name', () => {
    const a = OrganisationName.create('Acme');
    const b = OrganisationName.create('Beta');
    expect(a.equals(b)).toBe(false);
  });

  it('toString returns value', () => {
    expect(OrganisationName.create('Acme').toString()).toBe('Acme');
  });
});
