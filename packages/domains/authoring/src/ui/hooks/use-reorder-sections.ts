import { useApiMutation } from '@releasepilot/api-client';
import type { ReorderSectionsRequest } from '@releasepilot/shared';

interface UseReorderSectionsOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useReorderSections({ orgSlug, playbookId, invalidateKeys }: UseReorderSectionsOptions) {
  return useApiMutation<{ success: boolean }, ReorderSectionsRequest>({
    method: 'POST',
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}/sections/reorder`,
    invalidateKeys,
  });
}
