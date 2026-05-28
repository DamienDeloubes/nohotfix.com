import { z } from 'zod';

export const EnvironmentDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
});

export const CreateEnvironmentRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const UpdateEnvironmentRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const ReorderEnvironmentsRequestSchema = z.object({
  environmentIds: z.array(z.string().uuid()).min(1),
});
