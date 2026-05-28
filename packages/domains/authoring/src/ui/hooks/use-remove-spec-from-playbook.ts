import { useApiMutation } from '@releasepilot/api-client';

interface UseRemoveSpecFromPlaybookOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useRemoveSpecFromPlaybook({ orgSlug, playbookId, invalidateKeys }: UseRemoveSpecFromPlaybookOptions) {
  return useApiMutation<void, { specId: string }>({
    method: 'DELETE',
    path: ({ specId }) => `/api/orgs/${orgSlug}/playbooks/${playbookId}/specs/${specId}`,
    invalidateKeys,
  });
}
