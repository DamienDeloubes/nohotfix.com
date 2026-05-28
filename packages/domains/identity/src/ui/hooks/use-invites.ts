import { useApiMutation, useApiQuery } from '@releasepilot/api-client';
import type { CreateInviteRequest, InviteResendDto, ListInvitesDto } from '@releasepilot/shared';

interface UseInvitesOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
  enabled?: boolean | undefined;
}

export function useInvites({ orgSlug, queryKey, enabled = true }: UseInvitesOptions) {
  return useApiQuery<ListInvitesDto>({
    queryKey,
    path: `/api/orgs/${orgSlug}/invites`,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: enabled && orgSlug.length > 0,
  });
}

interface UseCreateInviteOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useCreateInvite({ orgSlug, invalidateKeys }: UseCreateInviteOptions) {
  return useApiMutation<unknown, CreateInviteRequest>({
    method: 'POST',
    path: `/api/orgs/${orgSlug}/invites`,
    invalidateKeys,
  });
}

interface UseResendInviteOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useResendInvite({ orgSlug, invalidateKeys }: UseResendInviteOptions) {
  return useApiMutation<InviteResendDto, string>({
    method: 'POST',
    path: (inviteId) => `/api/orgs/${orgSlug}/invites/${inviteId}/resend`,
    body: () => undefined,
    invalidateKeys,
  });
}

interface UseRevokeInviteOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useRevokeInvite({ orgSlug, invalidateKeys }: UseRevokeInviteOptions) {
  return useApiMutation<void, string>({
    method: 'DELETE',
    path: (inviteId) => `/api/orgs/${orgSlug}/invites/${inviteId}`,
    invalidateKeys,
  });
}
