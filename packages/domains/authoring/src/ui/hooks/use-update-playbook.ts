import { useApiMutation } from '@nohotfix/api-client';
import type { Playbook, UpdatePlaybookRequest } from '@nohotfix/shared';

interface UseUpdatePlaybookOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useUpdatePlaybook({ orgSlug, playbookId, invalidateKeys }: UseUpdatePlaybookOptions) {
  return useApiMutation<Playbook, UpdatePlaybookRequest>({
    method: 'PATCH',
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}`,
    invalidateKeys,
  });
}
