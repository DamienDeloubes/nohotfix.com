import { z } from 'zod';

export const SessionUserSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const InviteMemberRequestSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
});

export const ChangeMemberRoleRequestSchema = z.object({
  role: z.enum(['owner', 'admin', 'member']),
});

export const UpdateUserProfileRequestSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
});

export const UserDtoSchema = z.object({
  id: z.string().uuid(),
  workosUserId: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  role: z.enum(['owner', 'admin', 'member']).nullable().optional(),
});

export const UpdateUserProfileDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  updatedAt: z.string().datetime(),
});
