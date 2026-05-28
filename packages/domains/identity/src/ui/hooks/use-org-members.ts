import { useApiQuery } from '@releasepilot/api-client';
import type { ListOrgMembersDto } from '@releasepilot/shared';

interface UseOrgMembersOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
}

export function useOrgMembers({ orgSlug, queryKey }: UseOrgMembersOptions) {
  return useApiQuery<ListOrgMembersDto>({
    queryKey,
    path: `/api/orgs/${orgSlug}/members`,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!orgSlug,
  });
}
