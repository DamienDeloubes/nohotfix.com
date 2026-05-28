import { describe, expect, it } from 'vitest';

import { AuthorArtifactLabelInvalidError, AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { TableArtifactRequirement } from '../value-objects/table-artifact-requirement.js';

const textReadOnly = { name: 'Step', type: 'text', readOnly: true };
const textFillable = { name: 'Notes', type: 'text' };
const numberReadOnly = { name: 'Threshold', type: 'number', readOnly: true };
const numberFillable = { name: 'Result', type: 'number' };
const booleanCol = { name: 'Pass', type: 'boolean' };
const measuredValueCol = { name: 'Response Time', type: 'measured_value', unit: 'ms' };

describe('TableArtifactRequirement', () => {
  it('creates with valid columns and rows (mix of types)', () => {
    const req = TableArtifactRequirement.create({
      index: 0,
      label: 'Performance Results',
      description: 'Measured during load test',
      required: true,
      columns: [textReadOnly, numberReadOnly, numberFillable, booleanCol, measuredValueCol],
      rows: [['Login endpoint', 200, null, null, { expectedValue: 100, measuredValue: null }]],
    });

    expect(req.type).toBe('table');
    expect(req.index).toBe(0);
    expect(req.label.value).toBe('Performance Results');
    expect(req.description.value).toBe('Measured during load test');
    expect(req.required).toBe(true);
    expect(req.columns).toHaveLength(5);
    expect(req.rows).toHaveLength(1);
  });

  describe('cell-column consistency', () => {
    it('accepts read-only text with non-empty string', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [textReadOnly],
          rows: [['Hello']],
        }),
      ).not.toThrow();
    });

    it('rejects read-only text with null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [textReadOnly],
          rows: [[null]],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('accepts read-only number with number', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [numberReadOnly],
          rows: [[42]],
        }),
      ).not.toThrow();
    });

    it('rejects read-only number with null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [numberReadOnly],
          rows: [[null]],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('accepts fillable text with null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [textFillable],
          rows: [[null]],
        }),
      ).not.toThrow();
    });

    it('rejects fillable text with non-null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [textFillable],
          rows: [['some value']],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('accepts fillable number with null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [numberFillable],
          rows: [[null]],
        }),
      ).not.toThrow();
    });

    it('rejects fillable number with non-null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [numberFillable],
          rows: [[99]],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('accepts boolean with null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [booleanCol],
          rows: [[null]],
        }),
      ).not.toThrow();
    });

    it('rejects boolean with non-null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [booleanCol],
          rows: [[true]],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('accepts measured_value with { expectedValue: number, measuredValue: null }', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [measuredValueCol],
          rows: [[{ expectedValue: 100, measuredValue: null }]],
        }),
      ).not.toThrow();
    });

    it('rejects measured_value with missing expectedValue', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [measuredValueCol],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rows: [[{ measuredValue: null } as any]],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('rejects measured_value with measuredValue not null', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [measuredValueCol],
          rows: [[{ expectedValue: 100, measuredValue: 95 }]],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });
  });

  describe('boundary tests', () => {
    it('accepts 1 column, 1 row (minimum)', () => {
      const req = TableArtifactRequirement.create({
        index: 0,
        label: 'Min',
        columns: [textReadOnly],
        rows: [['value']],
      });
      expect(req.columns).toHaveLength(1);
      expect(req.rows).toHaveLength(1);
    });

    it('accepts 5 columns, 50 rows (maximum)', () => {
      const columns = [
        { name: 'Col1', type: 'text', readOnly: true },
        { name: 'Col2', type: 'text', readOnly: true },
        { name: 'Col3', type: 'text', readOnly: true },
        { name: 'Col4', type: 'text', readOnly: true },
        { name: 'Col5', type: 'text', readOnly: true },
      ];
      const rows = Array.from({ length: 50 }, (_, i) => [`r${i}c1`, `r${i}c2`, `r${i}c3`, `r${i}c4`, `r${i}c5`]);
      const req = TableArtifactRequirement.create({
        index: 0,
        label: 'Max',
        columns,
        rows,
      });
      expect(req.columns).toHaveLength(5);
      expect(req.rows).toHaveLength(50);
    });

    it('rejects 0 columns', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [],
          rows: [['x']],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('rejects 6 columns', () => {
      const columns = Array.from({ length: 6 }, (_, i) => ({
        name: `Col${i}`,
        type: 'text',
        readOnly: true,
      }));
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns,
          rows: [['a', 'b', 'c', 'd', 'e', 'f']],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('rejects 0 rows', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [textReadOnly],
          rows: [],
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });

    it('rejects 51 rows', () => {
      const rows = Array.from({ length: 51 }, () => ['val']);
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'T',
          columns: [textReadOnly],
          rows,
        }),
      ).toThrow(AuthorArtifactRequirementsInvalidError);
    });
  });

  it('rejects row with wrong number of cells', () => {
    expect(() =>
      TableArtifactRequirement.create({
        index: 0,
        label: 'T',
        columns: [textReadOnly, numberReadOnly],
        rows: [['only one cell']],
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  describe('label and description validation', () => {
    it('rejects empty label', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: '',
          columns: [textReadOnly],
          rows: [['x']],
        }),
      ).toThrow(AuthorArtifactLabelInvalidError);
    });

    it('rejects label exceeding 200 characters', () => {
      expect(() =>
        TableArtifactRequirement.create({
          index: 0,
          label: 'a'.repeat(201),
          columns: [textReadOnly],
          rows: [['x']],
        }),
      ).toThrow(AuthorArtifactLabelInvalidError);
    });
  });

  it('round-trips through toJson', () => {
    const req = TableArtifactRequirement.create({
      index: 1,
      label: 'Round Trip',
      description: 'desc',
      required: true,
      columns: [textReadOnly, measuredValueCol],
      rows: [['Step 1', { expectedValue: 50, measuredValue: null }]],
    });

    const json = req.toJson();

    expect(json).toEqual({
      index: 1,
      type: 'table',
      label: 'Round Trip',
      description: 'desc',
      required: true,
      columns: [
        { name: 'Step', type: 'text', readOnly: true },
        { name: 'Response Time', type: 'measured_value', unit: 'ms' },
      ],
      rows: [['Step 1', { expectedValue: 50, measuredValue: null }]],
    });

    const reconstituted = TableArtifactRequirement.reconstitute(json);
    expect(reconstituted.toJson()).toEqual(json);
  });

  describe('equals', () => {
    it('returns true for structurally equal instances', () => {
      const a = TableArtifactRequirement.create({
        index: 0,
        label: 'Same',
        columns: [textReadOnly],
        rows: [['val']],
      });
      const b = TableArtifactRequirement.create({
        index: 0,
        label: 'Same',
        columns: [textReadOnly],
        rows: [['val']],
      });
      expect(a.equals(b)).toBe(true);
    });

    it('returns false when labels differ', () => {
      const a = TableArtifactRequirement.create({
        index: 0,
        label: 'A',
        columns: [textReadOnly],
        rows: [['val']],
      });
      const b = TableArtifactRequirement.create({
        index: 0,
        label: 'B',
        columns: [textReadOnly],
        rows: [['val']],
      });
      expect(a.equals(b)).toBe(false);
    });

    it('returns false when rows differ', () => {
      const a = TableArtifactRequirement.create({
        index: 0,
        label: 'Same',
        columns: [textReadOnly],
        rows: [['val1']],
      });
      const b = TableArtifactRequirement.create({
        index: 0,
        label: 'Same',
        columns: [textReadOnly],
        rows: [['val2']],
      });
      expect(a.equals(b)).toBe(false);
    });
  });

  it('toString contains column and row counts', () => {
    const req = TableArtifactRequirement.create({
      index: 2,
      label: 'Debug Table',
      columns: [textReadOnly, booleanCol],
      rows: [
        ['step1', null],
        ['step2', null],
        ['step3', null],
      ],
    });
    const str = req.toString();
    expect(str).toContain('2 columns');
    expect(str).toContain('3 rows');
    expect(str).toContain('Debug Table');
  });
});
