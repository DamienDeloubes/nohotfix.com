import { useApiMutation } from '@releasepilot/api-client';
import type { ChangeMemberRoleRequest } from '@releasepilot/shared';

interface UseChangeMemberRoleOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useChangeMemberRole({ orgSlug, invalidateKeys }: UseChangeMemberRoleOptions) {
  return useApiMutation<unknown, { memberId: string; role: ChangeMemberRoleRequest['role'] }>({
    method: 'PATCH',
    path: ({ memberId }) => `/api/orgs/${orgSlug}/members/${memberId}/role`,
    body: ({ role }) => ({ role }),
    invalidateKeys,
  });
}
