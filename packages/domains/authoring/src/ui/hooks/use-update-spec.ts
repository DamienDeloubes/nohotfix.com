import { useApiMutation } from '@releasepilot/api-client';
import type { LibrarySpec, UpdateLibrarySpecRequest } from '@releasepilot/shared';

interface UseUpdateSpecOptions {
  orgSlug: string;
  specId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useUpdateSpec({ orgSlug, specId, invalidateKeys }: UseUpdateSpecOptions) {
  return useApiMutation<LibrarySpec, UpdateLibrarySpecRequest>({
    method: 'PUT',
    path: `/api/orgs/${orgSlug}/specs/${specId}`,
    invalidateKeys,
  });
}
