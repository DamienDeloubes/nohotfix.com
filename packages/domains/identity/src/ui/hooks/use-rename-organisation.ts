import { useApiMutation } from '@releasepilot/api-client';
import type { OrganisationDto } from '@releasepilot/shared';

interface UseRenameOrganisationOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useRenameOrganisation({ orgSlug, invalidateKeys }: UseRenameOrganisationOptions) {
  return useApiMutation<OrganisationDto, string>({
    method: 'PATCH',
    path: `/api/orgs/${orgSlug}`,
    body: (newName) => ({ name: newName }),
    invalidateKeys,
  });
}
