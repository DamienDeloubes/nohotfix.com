import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@nohotfix/shared';

import { AuthorSpecDurationInvalidError, AuthorSpecFieldTooLongError, AuthorSpecTitleInvalidError } from '../../errors/index.js';
import { SpecLibraryEntryEntity } from '../spec-library-entry.js';

function makeTipTapDoc(text: string): unknown {
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  };
}

const baseParams = {
  id: '00000000-0000-0000-0000-000000000001',
  orgId: '00000000-0000-0000-0000-000000000002',
  createdBy: '00000000-0000-0000-0000-000000000003',
};

describe('SpecLibraryEntryEntity', () => {
  describe('create', () => {
    it('creates with title only, defaults severity to medium', () => {
      const entity = SpecLibraryEntryEntity.create({ ...baseParams, title: 'Smoke test' });
      expect(entity.title.toString()).toBe('Smoke test');
      expect(entity.severity.toString()).toBe('medium');
      expect(entity.systemUnderTest).toBeNull();
      expect(entity.preconditions).toBeNull();
      expect(entity.description).toBeNull();
      expect(entity.testSteps).toEqual([]);
      expect(entity.expectedResult).toBeNull();
      expect(entity.testerNotes).toBeNull();
      expect(entity.estimatedDurationMinutes).toBeNull();
      expect(entity.tags).toEqual([]);
      expect(entity.isArchived).toBe(false);
      expect(entity.artifactRequirements).toBeNull();
    });

    it('creates with all fields and passes rich text through as-is', () => {
      const richDoc = { version: 1, doc: { type: 'doc', content: [{ type: 'paragraph' }] } };
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Full spec',
        systemUnderTest: 'Auth Service',
        severity: 'critical',
        preconditions: richDoc,
        description: richDoc,
        testSteps: [
          { instruction: 'Step 1', expectedOutcome: 'Result 1' },
          { instruction: 'Step 2', expectedOutcome: 'Result 2' },
        ],
        expectedResult: richDoc,
        testerNotes: 'Run on staging',
      });
      expect(entity.severity.toString()).toBe('critical');
      expect(entity.systemUnderTest).toBe('Auth Service');
      expect(entity.testSteps).toHaveLength(2);
      expect(entity.testSteps[0]!.instruction).toBe('Step 1');
      expect(entity.testerNotes).toBe('Run on staging');
      expect(entity.preconditions).toEqual(richDoc);
      expect(entity.description).toEqual(richDoc);
      expect(entity.expectedResult).toEqual(richDoc);
    });

    it('normalises null/undefined rich text to null', () => {
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Test',
        preconditions: null,
        description: null,
        expectedResult: undefined,
      });
      expect(entity.preconditions).toBeNull();
      expect(entity.description).toBeNull();
      expect(entity.expectedResult).toBeNull();
    });

    it('rejects more than 50 test steps', () => {
      const steps = Array.from({ length: 51 }, (_, i) => ({
        instruction: `Step ${i + 1}`,
        expectedOutcome: `Result ${i + 1}`,
      }));
      expect(() => SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', testSteps: steps })).toThrow('Cannot exceed 50 test steps');
    });

    it('accepts exactly 50 test steps', () => {
      const steps = Array.from({ length: 50 }, (_, i) => ({
        instruction: `Step ${i + 1}`,
        expectedOutcome: `Result ${i + 1}`,
      }));
      const entity = SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', testSteps: steps });
      expect(entity.testSteps).toHaveLength(50);
    });

    it('propagates SpecTitle validation error', () => {
      expect(() => SpecLibraryEntryEntity.create({ ...baseParams, title: '' })).toThrow(AuthorSpecTitleInvalidError);
    });

    it('propagates Severity validation error', () => {
      expect(() => SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', severity: 'invalid' })).toThrow('Invalid severity');
    });
  });

  describe('create — rich text character limits', () => {
    it('accepts preconditions at exactly 5000 chars', () => {
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Test',
        preconditions: makeTipTapDoc('a'.repeat(5000)),
      });
      expect(entity.preconditions).not.toBeNull();
    });

    it('throws AuthorSpecFieldTooLongError for preconditions at 5001 chars', () => {
      try {
        SpecLibraryEntryEntity.create({
          ...baseParams,
          title: 'Test',
          preconditions: makeTipTapDoc('a'.repeat(5001)),
        });
        expect.unreachable();
      } catch (e) {
        const err = e as AuthorSpecFieldTooLongError;
        expect(err).toBeInstanceOf(AuthorSpecFieldTooLongError);
        expect(err.code).toBe(ErrorCode.AUTHOR_SPEC_FIELD_TOO_LONG);
        expect(err.details?.field).toBe('preconditions');
        expect(err.details?.maxLength).toBe(5000);
      }
    });

    it('accepts description at exactly 10000 chars', () => {
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Test',
        description: makeTipTapDoc('a'.repeat(10000)),
      });
      expect(entity.description).not.toBeNull();
    });

    it('throws AuthorSpecFieldTooLongError for description at 10001 chars', () => {
      try {
        SpecLibraryEntryEntity.create({
          ...baseParams,
          title: 'Test',
          description: makeTipTapDoc('a'.repeat(10001)),
        });
        expect.unreachable();
      } catch (e) {
        expect((e as AuthorSpecFieldTooLongError).details?.field).toBe('description');
      }
    });

    it('accepts expectedResult at exactly 5000 chars', () => {
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Test',
        expectedResult: makeTipTapDoc('a'.repeat(5000)),
      });
      expect(entity.expectedResult).not.toBeNull();
    });

    it('throws AuthorSpecFieldTooLongError for expectedResult at 5001 chars', () => {
      try {
        SpecLibraryEntryEntity.create({
          ...baseParams,
          title: 'Test',
          expectedResult: makeTipTapDoc('a'.repeat(5001)),
        });
        expect.unreachable();
      } catch (e) {
        expect((e as AuthorSpecFieldTooLongError).details?.field).toBe('expectedResult');
      }
    });
  });

  describe('create — tester notes validation', () => {
    it('accepts tester notes at exactly 2000 chars', () => {
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Test',
        testerNotes: 'a'.repeat(2000),
      });
      expect(entity.testerNotes).toBe('a'.repeat(2000));
    });

    it('throws AuthorSpecFieldTooLongError for tester notes at 2001 chars', () => {
      try {
        SpecLibraryEntryEntity.create({
          ...baseParams,
          title: 'Test',
          testerNotes: 'a'.repeat(2001),
        });
        expect.unreachable();
      } catch (e) {
        const err = e as AuthorSpecFieldTooLongError;
        expect(err.code).toBe(ErrorCode.AUTHOR_SPEC_FIELD_TOO_LONG);
        expect(err.details?.field).toBe('testerNotes');
        expect(err.details?.maxLength).toBe(2000);
      }
    });

    it('normalises whitespace-only tester notes to null', () => {
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Test',
        testerNotes: '   ',
      });
      expect(entity.testerNotes).toBeNull();
    });

    it('trims tester notes', () => {
      const entity = SpecLibraryEntryEntity.create({
        ...baseParams,
        title: 'Test',
        testerNotes: '  some notes  ',
      });
      expect(entity.testerNotes).toBe('some notes');
    });
  });

  describe('create — estimated duration validation', () => {
    it('accepts null estimatedDurationMinutes', () => {
      const entity = SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test' });
      expect(entity.estimatedDurationMinutes).toBeNull();
    });

    it('accepts valid estimatedDurationMinutes', () => {
      const entity = SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', estimatedDurationMinutes: 30 });
      expect(entity.estimatedDurationMinutes).toBe(30);
    });

    it('accepts estimatedDurationMinutes at boundary 1', () => {
      const entity = SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', estimatedDurationMinutes: 1 });
      expect(entity.estimatedDurationMinutes).toBe(1);
    });

    it('accepts estimatedDurationMinutes at boundary 999', () => {
      const entity = SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', estimatedDurationMinutes: 999 });
      expect(entity.estimatedDurationMinutes).toBe(999);
    });

    it('rejects estimatedDurationMinutes of 0', () => {
      expect(() => SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', estimatedDurationMinutes: 0 })).toThrow(AuthorSpecDurationInvalidError);
    });

    it('rejects estimatedDurationMinutes of 1000', () => {
      expect(() => SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', estimatedDurationMinutes: 1000 })).toThrow(AuthorSpecDurationInvalidError);
    });

    it('rejects non-integer estimatedDurationMinutes', () => {
      expect(() => SpecLibraryEntryEntity.create({ ...baseParams, title: 'Test', estimatedDurationMinutes: 2.5 })).toThrow(AuthorSpecDurationInvalidError);
    });
  });

  describe('reconstitute', () => {
    it('creates from persistence props without validation', async () => {
      const { SpecTitle } = await import('../value-objects/spec-title.js');
      const { Severity } = await import('../value-objects/severity.js');
      const entity = SpecLibraryEntryEntity.reconstitute({
        id: baseParams.id,
        orgId: baseParams.orgId,
        title: SpecTitle.create('Reconstituted'),
        systemUnderTest: null,
        severity: Severity.create('low'),
        preconditions: null,
        description: null,
        testSteps: [],
        expectedResult: null,
        artifactRequirements: null,
        testerNotes: null,
        estimatedDurationMinutes: null,
        tags: [],
        isArchived: false,
        createdBy: baseParams.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(entity.title.toString()).toBe('Reconstituted');
      expect(entity.severity.toString()).toBe('low');
    });
  });
});
