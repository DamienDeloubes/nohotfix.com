import { useApiMutation } from '@releasepilot/api-client';
import type { LibrarySpec } from '@releasepilot/shared';

interface UseUnarchiveSpecOptions {
  orgSlug: string;
  specId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useUnarchiveSpec({ orgSlug, specId, invalidateKeys }: UseUnarchiveSpecOptions) {
  return useApiMutation<LibrarySpec, void>({
    method: 'PATCH',
    path: `/api/orgs/${orgSlug}/specs/${specId}/unarchive`,
    invalidateKeys,
  });
}
