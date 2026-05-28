import type { z } from 'zod';

import { useApiQuery } from '@releasepilot/api-client';
import { PlaybookHistoryResponseSchema, type PlaybookHistoryResponse } from '@releasepilot/shared';

interface UsePlaybookHistoryOptions {
  orgSlug: string;
  playbookId: string;
  queryKey: readonly unknown[];
}

export function usePlaybookHistory({ orgSlug, playbookId, queryKey }: UsePlaybookHistoryOptions) {
  return useApiQuery<PlaybookHistoryResponse>({
    queryKey,
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}/history`,
    schema: PlaybookHistoryResponseSchema as unknown as z.ZodType<PlaybookHistoryResponse>,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!playbookId,
  });
}
