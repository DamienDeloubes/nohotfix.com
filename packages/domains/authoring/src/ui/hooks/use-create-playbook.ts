import { useApiMutation } from '@nohotfix/api-client';
import type { CreatePlaybookRequest, Playbook } from '@nohotfix/shared';

interface UseCreatePlaybookOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useCreatePlaybook({ orgSlug, invalidateKeys }: UseCreatePlaybookOptions) {
  return useApiMutation<Playbook, CreatePlaybookRequest>({
    method: 'POST',
    path: `/api/orgs/${orgSlug}/playbooks`,
    invalidateKeys,
  });
}
