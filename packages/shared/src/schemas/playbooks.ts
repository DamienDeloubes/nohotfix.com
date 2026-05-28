import { z } from 'zod';

export const PLAYBOOK_HISTORY_ACTIONS = [
  'created',
  'archived',
  'unarchived',
  'name_changed',
  'description_updated',
  'environment_changed',
  'section_added',
  'section_renamed',
  'section_removed',
  'sections_reordered',
  'spec_added',
  'spec_removed',
  'spec_archived',
  'specs_reordered',
] as const;

export const PlaybookHistoryActionSchema = z.enum(PLAYBOOK_HISTORY_ACTIONS);

export const PlaybookHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  action: PlaybookHistoryActionSchema,
  fieldChanges: z.record(z.unknown()).nullable(),
  actorName: z.string(),
  isRemovedMember: z.boolean(),
  createdAt: z.string().datetime(),
});

export const PlaybookHistoryResponseSchema = z.object({
  entries: z.array(PlaybookHistoryEntrySchema),
});

export const PlaybookSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  environmentId: z.string().uuid().nullable().optional(),
  isArchived: z.boolean(),
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreatePlaybookRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  environmentId: z.string().uuid().nullable().optional(),
});

export const UpdatePlaybookRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  environmentId: z.string().uuid().nullable().optional(),
});

export const PlaybookSectionSchema = z.object({
  id: z.string().uuid(),
  playbookId: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1),
  position: z.number().int(),
  createdAt: z.string().datetime(),
});

export const CreateSectionRequestSchema = z.object({
  name: z.string().min(1).max(255),
  position: z.number().int().optional(),
});

export const UpdateSectionRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  position: z.number().int().optional(),
});

export const ReorderSectionsRequestSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

export const ReorderSpecsRequestSchema = z.object({
  sectionId: z.string().uuid().nullable().optional(),
  orderedIds: z.array(z.string().uuid()).min(1),
});

export const AddSpecFromLibraryRequestSchema = z.object({
  specLibraryId: z.string().uuid(),
  sectionId: z.string().uuid().nullable().optional(),
  position: z.number().int().min(0).optional(),
});

export const PlaybookArchiveInfoResponseSchema = z.object({
  playbookId: z.string().uuid(),
  activeRunCount: z.number().int().min(0),
});

export const ArchivePlaybookResponseSchema = z.object({
  playbook: PlaybookSchema,
  wasChanged: z.boolean(),
});

export const PlaybookSpecSchema = z.object({
  id: z.string().uuid(),
  sectionId: z.string().uuid().nullable(),
  playbookId: z.string().uuid(),
  orgId: z.string().uuid(),
  specLibraryId: z.string().uuid(),
  position: z.number().int(),
  createdAt: z.string().datetime(),
});
