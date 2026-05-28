import { useApiMutation } from '@nohotfix/api-client';
import type { CreateLibrarySpecRequest, LibrarySpec } from '@nohotfix/shared';

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
