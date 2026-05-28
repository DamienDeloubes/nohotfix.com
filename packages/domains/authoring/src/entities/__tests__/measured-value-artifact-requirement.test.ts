import { describe, expect, it } from 'vitest';

import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { MeasuredValueArtifactRequirement } from '../value-objects/measured-value-artifact-requirement.js';

describe('MeasuredValueArtifactRequirement', () => {
  it('creates with all fields', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Homepage API response time',
      description: 'Measure the P95 response time under normal load',
      required: true,
      unit: 'ms',
      expectedValue: 200,
      tolerancePercentage: 10,
      toleranceDescription: 'Based on last quarter P95 average',
    });
    expect(req.index).toBe(0);
    expect(req.type).toBe('measured_value');
    expect(req.label.value).toBe('Homepage API response time');
    expect(req.description.value).toBe('Measure the P95 response time under normal load');
    expect(req.required).toBe(true);
    expect(req.unit.value).toBe('ms');
    expect(req.expectedValue).toBe(200);
    expect(req.tolerancePercentage).toBe(10);
    expect(req.toleranceDescription.value).toBe('Based on last quarter P95 average');
  });

  it('creates without tolerance (both null)', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 1,
      label: 'Error rate',
      unit: '%',
      expectedValue: 0.5,
    });
    expect(req.tolerancePercentage).toBeNull();
    expect(req.toleranceDescription.value).toBeNull();
  });

  it('creates without description (null)', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Latency',
      description: null,
      unit: 'ms',
      expectedValue: 100,
    });
    expect(req.description.value).toBeNull();
  });

  it('defaults required to false', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Latency',
      unit: 'ms',
      expectedValue: 100,
    });
    expect(req.required).toBe(false);
  });

  it('accepts expectedValue of zero', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Error rate',
      unit: '%',
      expectedValue: 0,
    });
    expect(req.expectedValue).toBe(0);
  });

  it('accepts negative expectedValue', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Temperature delta',
      unit: 's',
      expectedValue: -5,
    });
    expect(req.expectedValue).toBe(-5);
  });

  it('accepts decimal expectedValue', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Error rate',
      unit: '%',
      expectedValue: 0.5,
    });
    expect(req.expectedValue).toBe(0.5);
  });

  it('rejects NaN expectedValue', () => {
    expect(() =>
      MeasuredValueArtifactRequirement.create({
        index: 0,
        label: 'Latency',
        unit: 'ms',
        expectedValue: NaN,
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('rejects Infinity expectedValue', () => {
    expect(() =>
      MeasuredValueArtifactRequirement.create({
        index: 0,
        label: 'Latency',
        unit: 'ms',
        expectedValue: Infinity,
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('rejects invalid unit', () => {
    expect(() =>
      MeasuredValueArtifactRequirement.create({
        index: 0,
        label: 'Latency',
        unit: 'bytes',
        expectedValue: 100,
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('rejects negative tolerancePercentage', () => {
    expect(() =>
      MeasuredValueArtifactRequirement.create({
        index: 0,
        label: 'Latency',
        unit: 'ms',
        expectedValue: 100,
        tolerancePercentage: -5,
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('rejects zero tolerancePercentage', () => {
    expect(() =>
      MeasuredValueArtifactRequirement.create({
        index: 0,
        label: 'Latency',
        unit: 'ms',
        expectedValue: 100,
        tolerancePercentage: 0,
      }),
    ).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('accepts tolerancePercentage >= 100', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Latency',
      unit: 'ms',
      expectedValue: 100,
      tolerancePercentage: 150,
    });
    expect(req.tolerancePercentage).toBe(150);
  });

  it('silently discards toleranceDescription when tolerancePercentage is absent', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Latency',
      unit: 'ms',
      expectedValue: 100,
      toleranceDescription: 'Should be ignored',
    });
    expect(req.tolerancePercentage).toBeNull();
    expect(req.toleranceDescription.value).toBeNull();
  });

  it('accepts label at 200-char boundary', () => {
    const label = 'a'.repeat(200);
    const req = MeasuredValueArtifactRequirement.create({ index: 0, label, unit: 'ms', expectedValue: 100 });
    expect(req.label.value).toBe(label);
  });

  it('rejects label exceeding 200 characters', () => {
    const label = 'a'.repeat(201);
    expect(() => MeasuredValueArtifactRequirement.create({ index: 0, label, unit: 'ms', expectedValue: 100 })).toThrow();
  });

  it('rejects whitespace-only label', () => {
    expect(() => MeasuredValueArtifactRequirement.create({ index: 0, label: '   ', unit: 'ms', expectedValue: 100 })).toThrow();
  });

  it('accepts description at 1000-char boundary', () => {
    const desc = 'b'.repeat(1000);
    const req = MeasuredValueArtifactRequirement.create({ index: 0, label: 'L', description: desc, unit: 'ms', expectedValue: 100 });
    expect(req.description.value).toBe(desc);
  });

  it('rejects description exceeding 1000 characters', () => {
    const desc = 'b'.repeat(1001);
    expect(() => MeasuredValueArtifactRequirement.create({ index: 0, label: 'L', description: desc, unit: 'ms', expectedValue: 100 })).toThrow();
  });

  it('normalizes whitespace-only description to null', () => {
    const req = MeasuredValueArtifactRequirement.create({ index: 0, label: 'L', description: '   ', unit: 'ms', expectedValue: 100 });
    expect(req.description.value).toBeNull();
  });

  it('accepts toleranceDescription at 1000-char boundary', () => {
    const desc = 'c'.repeat(1000);
    const req = MeasuredValueArtifactRequirement.create({ index: 0, label: 'L', unit: 'ms', expectedValue: 100, tolerancePercentage: 10, toleranceDescription: desc });
    expect(req.toleranceDescription.value).toBe(desc);
  });

  it('rejects toleranceDescription exceeding 1000 characters', () => {
    const desc = 'c'.repeat(1001);
    expect(() => MeasuredValueArtifactRequirement.create({ index: 0, label: 'L', unit: 'ms', expectedValue: 100, tolerancePercentage: 10, toleranceDescription: desc })).toThrow();
  });

  it('normalizes whitespace-only toleranceDescription to null', () => {
    const req = MeasuredValueArtifactRequirement.create({ index: 0, label: 'L', unit: 'ms', expectedValue: 100, tolerancePercentage: 10, toleranceDescription: '   ' });
    expect(req.toleranceDescription.value).toBeNull();
  });

  it('round-trips through toJson() with all fields', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 2,
      label: 'Latency',
      description: 'P95 under load',
      required: true,
      unit: 'ms',
      expectedValue: 200,
      tolerancePercentage: 10,
      toleranceDescription: 'Baseline from Q4',
    });
    expect(req.toJson()).toEqual({
      index: 2,
      type: 'measured_value',
      label: 'Latency',
      description: 'P95 under load',
      required: true,
      unit: 'ms',
      expectedValue: 200,
      tolerancePercentage: 10,
      toleranceDescription: 'Baseline from Q4',
    });
  });

  it('round-trips through toJson() with null fields', () => {
    const req = MeasuredValueArtifactRequirement.create({
      index: 0,
      label: 'Error rate',
      unit: '%',
      expectedValue: 0.5,
    });
    expect(req.toJson()).toEqual({
      index: 0,
      type: 'measured_value',
      label: 'Error rate',
      description: null,
      required: false,
      unit: '%',
      expectedValue: 0.5,
      tolerancePercentage: null,
      toleranceDescription: null,
    });
  });

  it('compares equality (equal)', () => {
    const a = MeasuredValueArtifactRequirement.create({ index: 0, label: 'A', unit: 'ms', expectedValue: 100, tolerancePercentage: 5 });
    const b = MeasuredValueArtifactRequirement.create({ index: 0, label: 'A', unit: 'ms', expectedValue: 100, tolerancePercentage: 5 });
    expect(a.equals(b)).toBe(true);
  });

  it('compares equality (not equal)', () => {
    const a = MeasuredValueArtifactRequirement.create({ index: 0, label: 'A', unit: 'ms', expectedValue: 100 });
    const b = MeasuredValueArtifactRequirement.create({ index: 0, label: 'A', unit: 'ms', expectedValue: 200 });
    expect(a.equals(b)).toBe(false);
  });

  it('converts to string', () => {
    const req = MeasuredValueArtifactRequirement.create({ index: 3, label: 'Latency', unit: 'ms', expectedValue: 200 });
    expect(req.toString()).toBe('MeasuredValueArtifactRequirement(3: Latency — 200 ms)');
  });
});
