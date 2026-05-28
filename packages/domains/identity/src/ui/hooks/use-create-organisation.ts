import { useApiMutation } from '@nohotfix/api-client';
import type { CreateOrganisationRequest, OrganisationDto } from '@nohotfix/shared';

interface UseCreateOrganisationOptions {
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useCreateOrganisation({ invalidateKeys }: UseCreateOrganisationOptions) {
  return useApiMutation<OrganisationDto, CreateOrganisationRequest>({
    method: 'POST',
    path: '/api/orgs',
    invalidateKeys,
  });
}
