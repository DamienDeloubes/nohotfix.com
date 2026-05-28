import { z } from 'zod';

export const CreateInviteRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(['admin', 'member']),
});

export const InviteDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
  status: z.literal('pending'),
  invitedBy: z.object({
    id: z.string().uuid(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  }),
  lastSentAt: z.string().datetime(),
  tokenExpiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const ListInvitesDtoSchema = z.object({
  invites: z.array(InviteDtoSchema),
});

export const InviteResendDtoSchema = z.object({
  id: z.string().uuid(),
  lastSentAt: z.string().datetime(),
  tokenExpiresAt: z.string().datetime(),
});

export const AcceptInviteResultDtoSchema = z.object({
  orgSlug: z.string(),
  orgName: z.string(),
});

export const ValidateInviteTokenDtoSchema = z.object({
  status: z.enum(['valid', 'expired', 'revoked', 'accepted', 'not_found']),
  email: z.string().email().optional(),
  orgSlug: z.string().optional(),
  orgName: z.string().optional(),
});
