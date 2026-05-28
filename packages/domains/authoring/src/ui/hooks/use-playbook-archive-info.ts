import { useApiQuery } from '@releasepilot/api-client';
import { PlaybookArchiveInfoResponseSchema, type PlaybookArchiveInfoResponse } from '@releasepilot/shared';

interface UsePlaybookArchiveInfoOptions {
  orgSlug: string;
  playbookId: string;
  queryKey: readonly unknown[];
  enabled?: boolean;
}

export function usePlaybookArchiveInfo({ orgSlug, playbookId, queryKey, enabled = true }: UsePlaybookArchiveInfoOptions) {
  return useApiQuery<PlaybookArchiveInfoResponse>({
    queryKey,
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}/archive-info`,
    schema: PlaybookArchiveInfoResponseSchema,
    enabled,
  });
}
