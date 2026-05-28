import { useApiMutation } from '@releasepilot/api-client';
import type { CreateLibrarySpecRequest, LibrarySpec } from '@releasepilot/shared';

interface UseCreateSpecOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useCreateSpec({ orgSlug, invalidateKeys }: UseCreateSpecOptions) {
  return useApiMutation<LibrarySpec, CreateLibrarySpecRequest>({
    method: 'POST',
    path: `/api/orgs/${orgSlug}/specs`,
    invalidateKeys,
  });
}
