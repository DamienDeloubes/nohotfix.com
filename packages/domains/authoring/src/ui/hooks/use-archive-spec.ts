import { useApiMutation } from '@nohotfix/api-client';
import type { LibrarySpec } from '@nohotfix/shared';

interface UseArchiveSpecOptions {
  orgSlug: string;
  specId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useArchiveSpec({ orgSlug, specId, invalidateKeys }: UseArchiveSpecOptions) {
  return useApiMutation<LibrarySpec, void>({
    method: 'PATCH',
    path: `/api/orgs/${orgSlug}/specs/${specId}/archive`,
    invalidateKeys,
  });
}
