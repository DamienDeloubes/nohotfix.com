import { useApiMutation } from '@nohotfix/api-client';
import type { ArchivePlaybookResponse } from '@nohotfix/shared';

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
