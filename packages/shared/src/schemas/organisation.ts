import { z } from 'zod';

import { RESERVED_SLUGS } from '../constants/reserved-slugs.js';

export const OrganisationSlugSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .refine((slug) => !RESERVED_SLUGS.has(slug), 'This slug is reserved and cannot be used');

export const CreateOrganisationRequestSchema = z.object({
  name: z.string().min(1).max(100),
  slug: OrganisationSlugSchema,
});

export const UpdateOrganisationRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const OrganisationDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
});

export const UserOrganisationDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
  createdAt: z.string().datetime(),
});

export const CheckSlugDtoSchema = z.object({
  available: z.boolean(),
});

export const OrgMemberDtoSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  role: z.enum(['owner', 'admin', 'member']),
  joinedAt: z.string().datetime(),
});

export const ListOrgMembersDtoSchema = z.object({
  members: z.array(OrgMemberDtoSchema),
});
