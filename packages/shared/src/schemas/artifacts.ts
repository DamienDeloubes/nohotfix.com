import { z } from 'zod';

export const ArtifactTypeSchema = z.enum(['file', 'table', 'measured_value', 'url']);

export const RunSpecArtifactSchema = z.object({
  id: z.string().uuid(),
  runSpecId: z.string().uuid(),
  runId: z.string().uuid(),
  orgId: z.string().uuid(),
  requirementIndex: z.number().int(),
  type: ArtifactTypeSchema,
  fileKey: z.string().nullable(),
  fileName: z.string().nullable(),
  fileType: z.string().nullable(),
  fileSize: z.number().int().nullable(),
  tableData: z.unknown().nullable(),
  measuredValue: z.number().nullable(),
  measuredUnit: z.string().nullable(),
  measuredThresholdOperator: z.enum(['lte', 'gte', 'eq']).nullable(),
  measuredThresholdValue: z.number().nullable(),
  urlValue: z.string().url().nullable(),
  uploadedBy: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export const PresignUploadRequestSchema = z.object({
  requirementIndex: z.number().int(),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().int().positive(),
});

export const SaveTableDataRequestSchema = z.object({
  tableData: z.array(z.record(z.string(), z.unknown())),
});

export const SaveMeasuredValueRequestSchema = z.object({
  measuredValue: z.number(),
  measuredUnit: z.string().optional(),
  measuredThresholdOperator: z.enum(['lte', 'gte', 'eq']).optional(),
  measuredThresholdValue: z.number().optional(),
});

export const SaveUrlValueRequestSchema = z.object({
  urlValue: z.string().url(),
});
