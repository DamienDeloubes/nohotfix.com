import { z } from 'zod';

export const RunStatusSchema = z.enum(['in_progress', 'awaiting_decision', 'go', 'no_go', 'abandoned']);

export const SpecStatusSchema = z.enum(['pending', 'in_progress', 'passed', 'failed', 'skipped']);

export const RunSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  playbookId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  environment: z.string().optional(),
  status: RunStatusSchema,
  targetDate: z.string().datetime().optional(),
  startedBy: z.string().uuid(),
  decisionBy: z.string().uuid().nullable(),
  decisionAt: z.string().datetime().nullable(),
  decisionStatement: z.string().nullable(),
  failedSpecsAtDecision: z.unknown().nullable(),
  abandonmentReason: z.string().nullable(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export const StartRunRequestSchema = z.object({
  playbookId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  environment: z.string().optional(),
  targetDate: z.string().datetime().optional(),
});

export const RecordDecisionRequestSchema = z.object({
  decision: z.enum(['go', 'no_go', 'abandoned']),
  statement: z.string().optional(),
  abandonmentReason: z.string().optional(),
});

export const RecordSpecResultRequestSchema = z.object({
  result: z.enum(['passed', 'failed', 'skipped']),
  failureReason: z.string().optional(),
  skipReason: z.string().optional(),
  notes: z.string().optional(),
});

export const RunSectionSchema = z.object({
  id: z.string().uuid(),
  runId: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  position: z.number().int(),
  assignedTo: z.string().uuid().nullable(),
  isSkipped: z.boolean(),
  skipReason: z.string().nullable(),
  skippedBy: z.string().uuid().nullable(),
  skippedAt: z.string().datetime().nullable(),
});

export const RunSpecSchema = z.object({
  id: z.string().uuid(),
  runSectionId: z.string().uuid(),
  runId: z.string().uuid(),
  orgId: z.string().uuid(),
  title: z.string(),
  systemUnderTest: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  preconditions: z.unknown().optional(),
  description: z.unknown().optional(),
  testSteps: z.unknown().optional(),
  expectedResult: z.unknown().optional(),
  artifactRequirements: z.unknown().optional(),
  testerNotes: z.string().optional(),
  status: SpecStatusSchema,
  claimedBy: z.string().uuid().nullable(),
  executedBy: z.string().uuid().nullable(),
  executedAt: z.string().datetime().nullable(),
  failureReason: z.string().nullable(),
  skipReason: z.string().nullable(),
  notes: z.string().nullable(),
  position: z.number().int(),
});
