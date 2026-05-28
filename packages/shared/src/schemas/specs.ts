import { z } from 'zod';

export const TestStepSchema = z.object({
  instruction: z.string().min(1).max(500),
  expectedOutcome: z.string().max(500).optional(),
});

export const SeveritySchema = z.enum(['critical', 'high', 'medium', 'low']);

export const TextArtifactRequirementSchema = z.object({
  type: z.literal('text'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
});

export const FileArtifactRequirementSchema = z.object({
  type: z.literal('file'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
});

export const CheckboxArtifactRequirementSchema = z.object({
  type: z.literal('checkbox'),
  label: z.string().min(1).max(200),
  required: z.boolean().optional().default(false),
});

export const UrlArtifactRequirementSchema = z.object({
  type: z.literal('url'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
});

export const MeasuredValueUnitSchema = z.enum(['ms', 's', '%', 'MB', 'GB', 'req/s']);

export const TableColumnDefSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['text', 'number', 'boolean', 'measured_value']),
  readOnly: z.boolean().optional(),
  unit: MeasuredValueUnitSchema.optional(),
  tolerancePercentage: z.number().positive().optional(),
});

export const CellValueSchema: z.ZodType = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.object({
    expectedValue: z.number(),
    measuredValue: z.number().nullable(),
  }),
]);

export const TableArtifactRequirementSchema = z.object({
  type: z.literal('table'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
  columns: z.array(TableColumnDefSchema).min(1).max(5),
  rows: z.array(z.array(CellValueSchema)).min(1).max(50),
});

export const MeasuredValueArtifactRequirementSchema = z.object({
  type: z.literal('measured_value'),
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional().default(false),
  unit: MeasuredValueUnitSchema,
  expectedValue: z.number().refine(Number.isFinite, { message: 'Expected value must be a finite number' }),
  tolerancePercentage: z.number().positive().optional(),
  toleranceDescription: z.string().max(1000).optional(),
});

export const ArtifactRequirementSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementSchema,
  FileArtifactRequirementSchema,
  CheckboxArtifactRequirementSchema,
  UrlArtifactRequirementSchema,
  MeasuredValueArtifactRequirementSchema,
  TableArtifactRequirementSchema,
]);

export const TextArtifactRequirementResponseSchema = z.object({
  index: z.number().int().min(0),
  type: z.literal('text'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
});

export const FileArtifactRequirementResponseSchema = z.object({
  index: z.number().int().min(0),
  type: z.literal('file'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
});

export const CheckboxArtifactRequirementResponseSchema = z.object({
  index: z.number().int().min(0),
  type: z.literal('checkbox'),
  label: z.string(),
  required: z.boolean(),
});

export const UrlArtifactRequirementResponseSchema = z.object({
  index: z.number().int().min(0),
  type: z.literal('url'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
});

export const TableColumnDefResponseSchema = z.object({
  name: z.string(),
  type: z.enum(['text', 'number', 'boolean', 'measured_value']),
  readOnly: z.boolean().optional(),
  unit: MeasuredValueUnitSchema.optional(),
  tolerancePercentage: z.number().optional(),
});

export const TableArtifactRequirementResponseSchema = z.object({
  index: z.number().int().min(0),
  type: z.literal('table'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
  columns: z.array(TableColumnDefResponseSchema),
  rows: z.array(z.array(CellValueSchema)),
});

export const MeasuredValueArtifactRequirementResponseSchema = z.object({
  index: z.number().int().min(0),
  type: z.literal('measured_value'),
  label: z.string(),
  description: z.string().nullable(),
  required: z.boolean(),
  unit: MeasuredValueUnitSchema,
  expectedValue: z.number(),
  tolerancePercentage: z.number().nullable(),
  toleranceDescription: z.string().nullable(),
});

export const ArtifactRequirementResponseSchema = z.discriminatedUnion('type', [
  TextArtifactRequirementResponseSchema,
  FileArtifactRequirementResponseSchema,
  CheckboxArtifactRequirementResponseSchema,
  UrlArtifactRequirementResponseSchema,
  MeasuredValueArtifactRequirementResponseSchema,
  TableArtifactRequirementResponseSchema,
]);

export const LibrarySpecSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  title: z.string().min(1),
  systemUnderTest: z.string().nullable(),
  severity: SeveritySchema,
  preconditions: z.unknown().nullable(),
  description: z.unknown().nullable(),
  testSteps: z.array(TestStepSchema).nullable(),
  expectedResult: z.unknown().nullable(),
  artifactRequirements: z.array(ArtifactRequirementResponseSchema).nullable(),
  testerNotes: z.string().nullable(),
  isArchived: z.boolean(),
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  estimatedDurationMinutes: z.number().int().min(1).max(999).nullable(),
  tags: z.array(z.string()).default([]),
});

export const CreateLibrarySpecRequestSchema = z.object({
  title: z.string().min(1).max(200),
  systemUnderTest: z.string().optional(),
  severity: SeveritySchema.optional(),
  preconditions: z.unknown().optional(),
  description: z.unknown().optional(),
  testSteps: z.array(TestStepSchema).max(50).optional(),
  expectedResult: z.unknown().optional(),
  artifactRequirements: z.array(ArtifactRequirementSchema).max(10).optional(),
  testerNotes: z.string().max(2000).optional(),
  estimatedDurationMinutes: z.number().int().min(1).max(999).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

export const UpdateLibrarySpecRequestSchema = z.object({
  title: z.string().min(1).max(200),
  systemUnderTest: z.string().nullable().optional(),
  severity: SeveritySchema.optional(),
  preconditions: z.unknown().nullable().optional(),
  description: z.unknown().nullable().optional(),
  testSteps: z.array(TestStepSchema).max(50).optional(),
  expectedResult: z.unknown().nullable().optional(),
  artifactRequirements: z.array(ArtifactRequirementSchema).max(10).optional(),
  testerNotes: z.string().max(2000).nullable().optional(),
  estimatedDurationMinutes: z.number().int().min(1).max(999).nullable().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

export const SystemsUnderTestResponseSchema = z.object({
  systems: z.array(z.string()),
});

// ── Spec Library List ─────────────────────────────────────────────────────

export const ListSpecsRequestSchema = z.object({
  tab: z.enum(['active', 'archived']).default('active'),
  q: z.string().max(200).optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  sort: z.enum(['title', 'system', 'severity', 'updated']).default('updated'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
});

export const SpecListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  systemUnderTest: z.string().nullable(),
  severity: z.string().nullable(),
  tags: z.array(z.string()),
  updatedAt: z.string(),
});

export const SpecListResultSchema = z.object({
  items: z.array(SpecListItemSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export const TagsResponseSchema = z.object({
  tags: z.array(z.string()),
});

// ── Spec History ──────────────────────────────────────────────────────────

export const SPEC_HISTORY_ACTIONS = [
  'created',
  'title_changed',
  'description_updated',
  'tags_changed',
  'duration_changed',
  'artifact_added',
  'artifact_removed',
  'artifact_modified',
  'system_under_test_changed',
  'severity_changed',
  'preconditions_updated',
  'test_steps_updated',
  'expected_result_updated',
  'tester_notes_updated',
  'archived',
  'unarchived',
] as const;

export const SpecHistoryActionSchema = z.enum(SPEC_HISTORY_ACTIONS);

export const SpecHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  action: SpecHistoryActionSchema,
  fieldChanges: z.record(z.object({ old: z.unknown(), new: z.unknown() })).nullable(),
  actorName: z.string(),
  isRemovedMember: z.boolean(),
  createdAt: z.string().datetime(),
});

export const SpecHistoryResponseSchema = z.object({
  entries: z.array(SpecHistoryEntrySchema),
});

// ── Archive Impact ───────────────────────────────────────────────────────

const PlaybookRefSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const ArchiveImpactResponseSchema = z.object({
  specId: z.string().uuid(),
  activePlaybooks: z.array(PlaybookRefSchema),
  archivedPlaybooks: z.array(PlaybookRefSchema),
});
