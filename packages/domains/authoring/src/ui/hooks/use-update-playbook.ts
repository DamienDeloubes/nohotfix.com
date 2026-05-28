import { useApiMutation } from '@releasepilot/api-client';
import type { Playbook, UpdatePlaybookRequest } from '@releasepilot/shared';

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
