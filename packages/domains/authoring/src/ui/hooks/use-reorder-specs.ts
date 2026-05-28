import { useApiMutation } from '@releasepilot/api-client';
import type { ReorderSpecsRequest } from '@releasepilot/shared';

interface UseReorderSpecsOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useReorderSpecs({ orgSlug, playbookId, invalidateKeys }: UseReorderSpecsOptions) {
  return useApiMutation<{ success: boolean }, ReorderSpecsRequest>({
    method: 'POST',
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}/specs/reorder`,
    invalidateKeys,
  });
}
