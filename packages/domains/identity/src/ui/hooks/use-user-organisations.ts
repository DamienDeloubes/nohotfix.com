import { useApiQuery } from '@nohotfix/api-client';
import type { UserOrganisationDto } from '@nohotfix/shared';

interface UseUserOrganisationsOptions {
  queryKey: readonly unknown[];
}

export function useUserOrganisations({ queryKey }: UseUserOrganisationsOptions) {
  return useApiQuery<UserOrganisationDto[]>({
    queryKey,
    path: '/api/users/me/orgs',
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
