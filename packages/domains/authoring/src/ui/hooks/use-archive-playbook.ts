import { useApiMutation } from '@releasepilot/api-client';
import type { ArchivePlaybookResponse } from '@releasepilot/shared';

interface UseArchivePlaybookOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useArchivePlaybook({ orgSlug, playbookId, invalidateKeys }: UseArchivePlaybookOptions) {
  return useApiMutation<ArchivePlaybookResponse, void>({
    method: 'PATCH',
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}/archive`,
    invalidateKeys,
  });
}
