import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@releasepilot/shared';

import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { TableColumnDef } from '../value-objects/table-column-def.js';

describe('TableColumnDef', () => {
  // ── Column type creation ──────────────────────────────────────────

  it('creates a text column', () => {
    const col = TableColumnDef.create({ name: 'Notes', type: 'text' });
    expect(col.name).toBe('Notes');
    expect(col.columnType).toBe('text');
    expect(col.readOnly).toBe(false);
    expect(col.unit).toBeUndefined();
    expect(col.tolerancePercentage).toBeUndefined();
  });

  it('creates a number column', () => {
    const col = TableColumnDef.create({ name: 'Count', type: 'number' });
    expect(col.columnType).toBe('number');
    expect(col.readOnly).toBe(false);
  });

  it('creates a boolean column', () => {
    const col = TableColumnDef.create({ name: 'Passed', type: 'boolean' });
    expect(col.columnType).toBe('boolean');
    expect(col.readOnly).toBe(false);
  });

  it('creates a measured_value column with unit', () => {
    const col = TableColumnDef.create({ name: 'Latency', type: 'measured_value', unit: 'ms' });
    expect(col.columnType).toBe('measured_value');
    expect(col.unit).toBe('ms');
    expect(col.tolerancePercentage).toBeUndefined();
  });

  it('rejects an invalid column type', () => {
    expect(() => TableColumnDef.create({ name: 'X', type: 'date' })).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  // ── readOnly validation ───────────────────────────────────────────

  it('accepts readOnly=true for text columns', () => {
    const col = TableColumnDef.create({ name: 'Label', type: 'text', readOnly: true });
    expect(col.readOnly).toBe(true);
  });

  it('accepts readOnly=true for number columns', () => {
    const col = TableColumnDef.create({ name: 'Baseline', type: 'number', readOnly: true });
    expect(col.readOnly).toBe(true);
  });

  it('strips readOnly for boolean columns (stays false)', () => {
    const col = TableColumnDef.create({ name: 'Flag', type: 'boolean', readOnly: true });
    expect(col.readOnly).toBe(false);
  });

  it('strips readOnly for measured_value columns (stays false)', () => {
    const col = TableColumnDef.create({
      name: 'Speed',
      type: 'measured_value',
      unit: 's',
      readOnly: true,
    });
    expect(col.readOnly).toBe(false);
  });

  it('defaults readOnly to false for text', () => {
    const col = TableColumnDef.create({ name: 'A', type: 'text' });
    expect(col.readOnly).toBe(false);
  });

  // ── unit validation ───────────────────────────────────────────────

  it('requires unit for measured_value', () => {
    expect(() => TableColumnDef.create({ name: 'X', type: 'measured_value' })).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('accepts each valid unit for measured_value', () => {
    const validUnits = ['ms', 's', '%', 'MB', 'GB', 'req/s'] as const;
    for (const unit of validUnits) {
      const col = TableColumnDef.create({ name: 'Col', type: 'measured_value', unit });
      expect(col.unit).toBe(unit);
    }
  });

  it('rejects an invalid unit for measured_value', () => {
    expect(() => TableColumnDef.create({ name: 'X', type: 'measured_value', unit: 'kg' })).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('strips unit for text columns', () => {
    const col = TableColumnDef.create({ name: 'A', type: 'text', unit: 'ms' });
    expect(col.unit).toBeUndefined();
  });

  it('strips unit for number columns', () => {
    const col = TableColumnDef.create({ name: 'A', type: 'number', unit: 'ms' });
    expect(col.unit).toBeUndefined();
  });

  it('strips unit for boolean columns', () => {
    const col = TableColumnDef.create({ name: 'A', type: 'boolean', unit: 'ms' });
    expect(col.unit).toBeUndefined();
  });

  // ── tolerancePercentage validation ────────────────────────────────

  it('accepts tolerancePercentage for measured_value', () => {
    const col = TableColumnDef.create({
      name: 'Latency',
      type: 'measured_value',
      unit: 'ms',
      tolerancePercentage: 10,
    });
    expect(col.tolerancePercentage).toBe(10);
  });

  it('rejects non-positive tolerancePercentage for measured_value', () => {
    expect(() =>
      TableColumnDef.create({
        name: 'Latency',
        type: 'measured_value',
        unit: 'ms',
        tolerancePercentage: 0,
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);

    expect(() =>
      TableColumnDef.create({
        name: 'Latency',
        type: 'measured_value',
        unit: 'ms',
        tolerancePercentage: -5,
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('strips tolerancePercentage for text columns', () => {
    const col = TableColumnDef.create({ name: 'A', type: 'text', tolerancePercentage: 5 });
    expect(col.tolerancePercentage).toBeUndefined();
  });

  it('strips tolerancePercentage for number columns', () => {
    const col = TableColumnDef.create({ name: 'A', type: 'number', tolerancePercentage: 5 });
    expect(col.tolerancePercentage).toBeUndefined();
  });

  it('strips tolerancePercentage for boolean columns', () => {
    const col = TableColumnDef.create({ name: 'A', type: 'boolean', tolerancePercentage: 5 });
    expect(col.tolerancePercentage).toBeUndefined();
  });

  // ── name boundaries ───────────────────────────────────────────────

  it('accepts a 1-character name', () => {
    const col = TableColumnDef.create({ name: 'X', type: 'text' });
    expect(col.name).toBe('X');
  });

  it('accepts a 100-character name', () => {
    const name = 'a'.repeat(100);
    const col = TableColumnDef.create({ name, type: 'text' });
    expect(col.name).toBe(name);
  });

  it('rejects an empty name', () => {
    expect(() => TableColumnDef.create({ name: '', type: 'text' })).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('rejects a 101-character name', () => {
    const name = 'a'.repeat(101);
    expect(() => TableColumnDef.create({ name, type: 'text' })).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('rejects a whitespace-only name', () => {
    expect(() => TableColumnDef.create({ name: '   ', type: 'text' })).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  // ── error code ────────────────────────────────────────────────────

  it('throws with the correct error code', () => {
    try {
      TableColumnDef.create({ name: '', type: 'text' });
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AuthorArtifactRequirementsInvalidError);
      expect((err as AuthorArtifactRequirementsInvalidError).code).toBe(ErrorCode.AUTHOR_ARTIFACT_REQUIREMENTS_INVALID);
    }
  });

  // ── toJson round-trip ─────────────────────────────────────────────

  it('serializes a text column to JSON', () => {
    const col = TableColumnDef.create({ name: 'Notes', type: 'text' });
    expect(col.toJson()).toEqual({ name: 'Notes', type: 'text' });
  });

  it('serializes a readOnly text column to JSON', () => {
    const col = TableColumnDef.create({ name: 'Label', type: 'text', readOnly: true });
    expect(col.toJson()).toEqual({ name: 'Label', type: 'text', readOnly: true });
  });

  it('serializes a measured_value column with all fields to JSON', () => {
    const col = TableColumnDef.create({
      name: 'Latency',
      type: 'measured_value',
      unit: 'ms',
      tolerancePercentage: 10,
    });
    expect(col.toJson()).toEqual({
      name: 'Latency',
      type: 'measured_value',
      unit: 'ms',
      tolerancePercentage: 10,
    });
  });

  it('round-trips through reconstitute and toJson', () => {
    const original = TableColumnDef.create({
      name: 'Response Time',
      type: 'measured_value',
      unit: 'ms',
      tolerancePercentage: 5,
    });
    const json = original.toJson();
    const restored = TableColumnDef.reconstitute(json);
    expect(restored.toJson()).toEqual(json);
  });

  // ── equals ────────────────────────────────────────────────────────

  it('considers structurally identical columns equal', () => {
    const a = TableColumnDef.create({ name: 'A', type: 'text' });
    const b = TableColumnDef.create({ name: 'A', type: 'text' });
    expect(a.equals(b)).toBe(true);
  });

  it('considers columns with different names unequal', () => {
    const a = TableColumnDef.create({ name: 'A', type: 'text' });
    const b = TableColumnDef.create({ name: 'B', type: 'text' });
    expect(a.equals(b)).toBe(false);
  });

  it('considers columns with different types unequal', () => {
    const a = TableColumnDef.create({ name: 'A', type: 'text' });
    const b = TableColumnDef.create({ name: 'A', type: 'number' });
    expect(a.equals(b)).toBe(false);
  });

  it('considers columns with different readOnly unequal', () => {
    const a = TableColumnDef.create({ name: 'A', type: 'text', readOnly: true });
    const b = TableColumnDef.create({ name: 'A', type: 'text', readOnly: false });
    expect(a.equals(b)).toBe(false);
  });

  it('considers measured_value columns with different units unequal', () => {
    const a = TableColumnDef.create({ name: 'A', type: 'measured_value', unit: 'ms' });
    const b = TableColumnDef.create({ name: 'A', type: 'measured_value', unit: 's' });
    expect(a.equals(b)).toBe(false);
  });

  it('considers measured_value columns with different tolerances unequal', () => {
    const a = TableColumnDef.create({
      name: 'A',
      type: 'measured_value',
      unit: 'ms',
      tolerancePercentage: 5,
    });
    const b = TableColumnDef.create({
      name: 'A',
      type: 'measured_value',
      unit: 'ms',
      tolerancePercentage: 10,
    });
    expect(a.equals(b)).toBe(false);
  });
});
