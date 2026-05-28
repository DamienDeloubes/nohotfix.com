import { useApiQuery } from '@releasepilot/api-client';
import type { UserDto } from '@releasepilot/shared';

interface UseCurrentUserOptions {
  queryKey: readonly unknown[];
  orgSlug: string;
}

export function useCurrentUser({ queryKey, orgSlug }: UseCurrentUserOptions) {
  return useApiQuery<UserDto>({
    queryKey,
    path: `/api/orgs/${encodeURIComponent(orgSlug)}/me`,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
