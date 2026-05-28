import { useApiMutation } from '@releasepilot/api-client';

interface UseRemoveMemberOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useRemoveMember({ orgSlug, invalidateKeys }: UseRemoveMemberOptions) {
  return useApiMutation<void, { memberId: string }>({
    method: 'DELETE',
    path: ({ memberId }) => `/api/orgs/${orgSlug}/members/${memberId}`,
    invalidateKeys,
  });
}
