import { useApiMutation } from '@nohotfix/api-client';
import type { ArchivePlaybookResponse } from '@nohotfix/shared';

interface UseUnarchivePlaybookOptions {
  orgSlug: string;
  playbookId?: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

interface UnarchivePlaybookVariables {
  playbookId?: string;
}

export function useUnarchivePlaybook({ orgSlug, playbookId: fixedPlaybookId, invalidateKeys }: UseUnarchivePlaybookOptions) {
  return useApiMutation<ArchivePlaybookResponse, UnarchivePlaybookVariables | void>({
    method: 'PATCH',
    path: (vars) => {
      const id = (vars as UnarchivePlaybookVariables | undefined)?.playbookId ?? fixedPlaybookId;
      return `/api/orgs/${orgSlug}/playbooks/${id}/unarchive`;
    },
    body: () => undefined,
    invalidateKeys,
  });
}
