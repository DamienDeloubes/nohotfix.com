import { useApiMutation } from '@nohotfix/api-client';
import type { LibrarySpec, UpdateLibrarySpecRequest } from '@nohotfix/shared';

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
