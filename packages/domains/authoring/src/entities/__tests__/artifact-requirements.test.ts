import { describe, expect, it } from 'vitest';

import { ErrorCode } from '@nohotfix/shared';

import { AuthorArtifactRequirementsInvalidError } from '../../errors/index.js';
import { ArtifactRequirements } from '../value-objects/artifact-requirements.js';

describe('ArtifactRequirements', () => {
  it('creates with 0 items', () => {
    const reqs = ArtifactRequirements.create([]);
    expect(reqs.isEmpty).toBe(true);
    expect(reqs.toJson()).toEqual([]);
  });

  it('creates with 1 item', () => {
    const reqs = ArtifactRequirements.create([{ type: 'text', label: 'Error log' }]);
    expect(reqs.isEmpty).toBe(false);
    expect(reqs.items).toHaveLength(1);
    expect(reqs.items[0].index).toBe(0);
  });

  it('creates with 10 items', () => {
    const raw = Array.from({ length: 10 }, (_, i) => ({ type: 'text', label: `Item ${i}` }));
    const reqs = ArtifactRequirements.create(raw);
    expect(reqs.items).toHaveLength(10);
  });

  it('rejects 11 items', () => {
    const raw = Array.from({ length: 11 }, (_, i) => ({ type: 'text', label: `Item ${i}` }));
    expect(() => ArtifactRequirements.create(raw)).toThrow(AuthorArtifactRequirementsInvalidError);
    try {
      ArtifactRequirements.create(raw);
    } catch (e) {
      expect((e as AuthorArtifactRequirementsInvalidError).code).toBe(ErrorCode.AUTHOR_ARTIFACT_REQUIREMENTS_INVALID);
    }
  });

  it('assigns contiguous 0-based indices', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'First' },
      { type: 'text', label: 'Second' },
      { type: 'text', label: 'Third' },
    ]);
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[1].index).toBe(1);
    expect(reqs.items[2].index).toBe(2);
  });

  it('reports isEmpty correctly', () => {
    expect(ArtifactRequirements.create([]).isEmpty).toBe(true);
    expect(ArtifactRequirements.create([{ type: 'text', label: 'A' }]).isEmpty).toBe(false);
  });

  it('serialises toJson() correctly', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'Error log', description: 'Full trace', required: true },
      { type: 'text', label: 'Notes' },
    ]);
    expect(reqs.toJson()).toEqual([
      { index: 0, type: 'text', label: 'Error log', description: 'Full trace', required: true },
      { index: 1, type: 'text', label: 'Notes', description: null, required: false },
    ]);
  });

  it('rejects unknown type', () => {
    expect(() => ArtifactRequirements.create([{ type: 'unknown', label: 'Confirm' }])).toThrow(AuthorArtifactRequirementsInvalidError);
    try {
      ArtifactRequirements.create([{ type: 'unknown', label: 'Confirm' }]);
    } catch (e) {
      expect((e as AuthorArtifactRequirementsInvalidError).code).toBe(ErrorCode.AUTHOR_ARTIFACT_REQUIREMENTS_INVALID);
    }
  });

  it('accepts checkbox type and indexes correctly', () => {
    const reqs = ArtifactRequirements.create([{ type: 'checkbox', label: 'I verified this in staging' }]);
    expect(reqs.items).toHaveLength(1);
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[0].type).toBe('checkbox');
  });

  it('indexes mixed text, file, and checkbox types contiguously', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'Error log' },
      { type: 'file', label: 'Screenshot' },
      { type: 'checkbox', label: 'No regressions' },
    ]);
    expect(reqs.items).toHaveLength(3);
    expect(reqs.items[0].type).toBe('text');
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[1].type).toBe('file');
    expect(reqs.items[1].index).toBe(1);
    expect(reqs.items[2].type).toBe('checkbox');
    expect(reqs.items[2].index).toBe(2);
  });

  it('accepts checkbox in 10-item array', () => {
    const raw = [
      ...Array.from({ length: 4 }, (_, i) => ({ type: 'text', label: `Text ${i}` })),
      ...Array.from({ length: 3 }, (_, i) => ({ type: 'file', label: `File ${i}` })),
      ...Array.from({ length: 3 }, (_, i) => ({ type: 'checkbox', label: `Check ${i}` })),
    ];
    const reqs = ArtifactRequirements.create(raw);
    expect(reqs.items).toHaveLength(10);
  });

  it('serialises checkbox type correctly via toJson()', () => {
    const reqs = ArtifactRequirements.create([{ type: 'checkbox', label: 'Confirmed', required: true }]);
    const json = reqs.toJson();
    expect(json).toEqual([{ index: 0, type: 'checkbox', label: 'Confirmed', required: true }]);
    expect('description' in json[0]).toBe(false);
  });

  it('accepts file type and indexes correctly', () => {
    const reqs = ArtifactRequirements.create([{ type: 'file', label: 'Upload screenshot' }]);
    expect(reqs.items).toHaveLength(1);
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[0].type).toBe('file');
  });

  it('indexes mixed text and file types contiguously', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'Error log' },
      { type: 'file', label: 'Screenshot' },
      { type: 'text', label: 'Notes' },
    ]);
    expect(reqs.items).toHaveLength(3);
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[0].type).toBe('text');
    expect(reqs.items[1].index).toBe(1);
    expect(reqs.items[1].type).toBe('file');
    expect(reqs.items[2].index).toBe(2);
    expect(reqs.items[2].type).toBe('text');
  });

  it('serialises mixed types via toJson()', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'Error log', required: true },
      { type: 'file', label: 'Screenshot', description: 'PNG only' },
    ]);
    expect(reqs.toJson()).toEqual([
      { index: 0, type: 'text', label: 'Error log', description: null, required: true },
      { index: 1, type: 'file', label: 'Screenshot', description: 'PNG only', required: false },
    ]);
  });

  it('enforces 10-item limit across mixed types', () => {
    const raw = [...Array.from({ length: 5 }, (_, i) => ({ type: 'text', label: `Text ${i}` })), ...Array.from({ length: 6 }, (_, i) => ({ type: 'file', label: `File ${i}` }))];
    expect(() => ArtifactRequirements.create(raw)).toThrow(AuthorArtifactRequirementsInvalidError);
  });

  it('accepts url type and indexes correctly', () => {
    const reqs = ArtifactRequirements.create([{ type: 'url', label: 'CI Pipeline URL' }]);
    expect(reqs.items).toHaveLength(1);
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[0].type).toBe('url');
  });

  it('indexes mixed text, file, checkbox, and url types contiguously', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'Error log' },
      { type: 'file', label: 'Screenshot' },
      { type: 'checkbox', label: 'No regressions' },
      { type: 'url', label: 'CI Pipeline URL' },
    ]);
    expect(reqs.items).toHaveLength(4);
    expect(reqs.items[0].type).toBe('text');
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[1].type).toBe('file');
    expect(reqs.items[1].index).toBe(1);
    expect(reqs.items[2].type).toBe('checkbox');
    expect(reqs.items[2].index).toBe(2);
    expect(reqs.items[3].type).toBe('url');
    expect(reqs.items[3].index).toBe(3);
  });

  it('accepts url in 10-item array', () => {
    const raw = [
      ...Array.from({ length: 3 }, (_, i) => ({ type: 'text', label: `Text ${i}` })),
      ...Array.from({ length: 3 }, (_, i) => ({ type: 'file', label: `File ${i}` })),
      ...Array.from({ length: 2 }, (_, i) => ({ type: 'checkbox', label: `Check ${i}` })),
      ...Array.from({ length: 2 }, (_, i) => ({ type: 'url', label: `URL ${i}` })),
    ];
    const reqs = ArtifactRequirements.create(raw);
    expect(reqs.items).toHaveLength(10);
  });

  it('serialises url type correctly via toJson()', () => {
    const reqs = ArtifactRequirements.create([{ type: 'url', label: 'CI Pipeline', description: 'GitHub Actions link', required: true }]);
    const json = reqs.toJson();
    expect(json).toEqual([{ index: 0, type: 'url', label: 'CI Pipeline', description: 'GitHub Actions link', required: true }]);
  });

  it('accepts single table requirement', () => {
    const reqs = ArtifactRequirements.create([
      {
        type: 'table',
        label: 'API endpoint load times',
        columns: [
          { name: 'Endpoint', type: 'text', readOnly: true },
          { name: 'Response Time', type: 'measured_value', unit: 'ms' },
        ],
        rows: [
          ['/api/overview', { expectedValue: 200, measuredValue: null }],
          ['/api/releases', { expectedValue: 300, measuredValue: null }],
        ],
      },
    ]);
    expect(reqs.items).toHaveLength(1);
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[0].type).toBe('table');
  });

  it('indexes mixed text, file, checkbox, url, and table types contiguously', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'Error log' },
      { type: 'file', label: 'Screenshot' },
      { type: 'checkbox', label: 'No regressions' },
      { type: 'url', label: 'CI Pipeline URL' },
      {
        type: 'table',
        label: 'Metrics',
        columns: [
          { name: 'Metric', type: 'text', readOnly: true },
          { name: 'Value', type: 'measured_value', unit: 'ms' },
        ],
        rows: [['Latency', { expectedValue: 100, measuredValue: null }]],
      },
    ]);
    expect(reqs.items).toHaveLength(5);
    expect(reqs.items[0].type).toBe('text');
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[1].type).toBe('file');
    expect(reqs.items[1].index).toBe(1);
    expect(reqs.items[2].type).toBe('checkbox');
    expect(reqs.items[2].index).toBe(2);
    expect(reqs.items[3].type).toBe('url');
    expect(reqs.items[3].index).toBe(3);
    expect(reqs.items[4].type).toBe('table');
    expect(reqs.items[4].index).toBe(4);
  });

  it('accepts table in 10-item array at the limit', () => {
    const raw = [
      ...Array.from({ length: 3 }, (_, i) => ({ type: 'text' as const, label: `Text ${i}` })),
      ...Array.from({ length: 2 }, (_, i) => ({ type: 'file' as const, label: `File ${i}` })),
      ...Array.from({ length: 2 }, (_, i) => ({ type: 'checkbox' as const, label: `Check ${i}` })),
      ...Array.from({ length: 2 }, (_, i) => ({ type: 'url' as const, label: `URL ${i}` })),
      {
        type: 'table' as const,
        label: 'Performance results',
        columns: [
          { name: 'Scenario', type: 'text', readOnly: true },
          { name: 'Duration', type: 'measured_value', unit: 's' },
        ],
        rows: [['Cold start', { expectedValue: 5, measuredValue: null }]],
      },
    ];
    const reqs = ArtifactRequirements.create(raw);
    expect(reqs.items).toHaveLength(10);
  });

  it('accepts single measured_value requirement', () => {
    const reqs = ArtifactRequirements.create([
      {
        type: 'measured_value',
        label: 'Homepage API response time',
        unit: 'ms',
        expectedValue: 200,
        tolerancePercentage: 10,
        toleranceDescription: 'Based on Q4 average',
      },
    ]);
    expect(reqs.items).toHaveLength(1);
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[0].type).toBe('measured_value');
  });

  it('indexes mixed text, file, checkbox, url, measured_value, and table types contiguously', () => {
    const reqs = ArtifactRequirements.create([
      { type: 'text', label: 'Error log' },
      { type: 'file', label: 'Screenshot' },
      { type: 'checkbox', label: 'No regressions' },
      { type: 'url', label: 'CI Pipeline URL' },
      { type: 'measured_value', label: 'Response time', unit: 'ms', expectedValue: 200 },
      {
        type: 'table',
        label: 'Metrics',
        columns: [
          { name: 'Metric', type: 'text', readOnly: true },
          { name: 'Value', type: 'measured_value', unit: 'ms' },
        ],
        rows: [['Latency', { expectedValue: 100, measuredValue: null }]],
      },
    ]);
    expect(reqs.items).toHaveLength(6);
    expect(reqs.items[0].type).toBe('text');
    expect(reqs.items[0].index).toBe(0);
    expect(reqs.items[1].type).toBe('file');
    expect(reqs.items[1].index).toBe(1);
    expect(reqs.items[2].type).toBe('checkbox');
    expect(reqs.items[2].index).toBe(2);
    expect(reqs.items[3].type).toBe('url');
    expect(reqs.items[3].index).toBe(3);
    expect(reqs.items[4].type).toBe('measured_value');
    expect(reqs.items[4].index).toBe(4);
    expect(reqs.items[5].type).toBe('table');
    expect(reqs.items[5].index).toBe(5);
  });

  it('accepts measured_value in 10-item array at the limit', () => {
    const raw = [
      ...Array.from({ length: 3 }, (_, i) => ({ type: 'text' as const, label: `Text ${i}` })),
      ...Array.from({ length: 2 }, (_, i) => ({ type: 'file' as const, label: `File ${i}` })),
      ...Array.from({ length: 2 }, (_, i) => ({ type: 'checkbox' as const, label: `Check ${i}` })),
      { type: 'url' as const, label: 'URL 0' },
      { type: 'measured_value' as const, label: 'MV 0', unit: 'ms', expectedValue: 100 },
      {
        type: 'table' as const,
        label: 'Performance results',
        columns: [
          { name: 'Scenario', type: 'text', readOnly: true },
          { name: 'Duration', type: 'measured_value', unit: 's' },
        ],
        rows: [['Cold start', { expectedValue: 5, measuredValue: null }]],
      },
    ];
    const reqs = ArtifactRequirements.create(raw);
    expect(reqs.items).toHaveLength(10);
  });

  it('serialises measured_value type correctly via toJson()', () => {
    const reqs = ArtifactRequirements.create([
      {
        type: 'measured_value',
        label: 'API Response',
        description: 'P95 latency',
        required: true,
        unit: 'ms',
        expectedValue: 200,
        tolerancePercentage: 10,
        toleranceDescription: 'Baseline from Q4',
      },
    ]);
    const json = reqs.toJson();
    expect(json).toHaveLength(1);
    expect(json[0]).toEqual({
      index: 0,
      type: 'measured_value',
      label: 'API Response',
      description: 'P95 latency',
      required: true,
      unit: 'ms',
      expectedValue: 200,
      tolerancePercentage: 10,
      toleranceDescription: 'Baseline from Q4',
    });
  });

  it('serialises table type correctly via toJson()', () => {
    const reqs = ArtifactRequirements.create([
      {
        type: 'table',
        label: 'API endpoint load times',
        description: 'Measure under normal load',
        required: true,
        columns: [
          { name: 'Endpoint', type: 'text', readOnly: true },
          { name: 'Response Time', type: 'measured_value', unit: 'ms' },
        ],
        rows: [
          ['/api/overview', { expectedValue: 200, measuredValue: null }],
          ['/api/releases', { expectedValue: 300, measuredValue: null }],
        ],
      },
    ]);
    const json = reqs.toJson();
    expect(json).toHaveLength(1);
    expect(json[0]).toEqual({
      index: 0,
      type: 'table',
      label: 'API endpoint load times',
      description: 'Measure under normal load',
      required: true,
      columns: [
        { name: 'Endpoint', type: 'text', readOnly: true },
        { name: 'Response Time', type: 'measured_value', unit: 'ms' },
      ],
      rows: [
        ['/api/overview', { expectedValue: 200, measuredValue: null }],
        ['/api/releases', { expectedValue: 300, measuredValue: null }],
      ],
    });
  });
});
