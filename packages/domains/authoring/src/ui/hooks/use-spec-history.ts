import type { z } from 'zod';

import { useApiQuery } from '@releasepilot/api-client';
import { SpecHistoryResponseSchema, type SpecHistoryResponse } from '@releasepilot/shared';

interface UseSpecHistoryOptions {
  orgSlug: string;
  specId: string;
  queryKey: readonly unknown[];
}

export function useSpecHistory({ orgSlug, specId, queryKey }: UseSpecHistoryOptions) {
  return useApiQuery<SpecHistoryResponse>({
    queryKey,
    path: `/api/orgs/${orgSlug}/specs/${specId}/history`,
    schema: SpecHistoryResponseSchema as unknown as z.ZodType<SpecHistoryResponse>,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!specId,
  });
}
