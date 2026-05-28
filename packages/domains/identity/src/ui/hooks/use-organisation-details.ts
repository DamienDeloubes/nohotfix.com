import { useApiQuery } from '@nohotfix/api-client';
import type { OrganisationDto } from '@nohotfix/shared';

interface UseOrganisationDetailsOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
}

export function useOrganisationDetails({ orgSlug, queryKey }: UseOrganisationDetailsOptions) {
  return useApiQuery<OrganisationDto>({
    queryKey,
    path: `/api/orgs/${orgSlug}`,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!orgSlug,
  });
}
