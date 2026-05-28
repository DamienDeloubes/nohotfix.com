import type { z } from 'zod';

import { useApiQuery } from '@releasepilot/api-client';
import { LibrarySpecSchema, type LibrarySpec } from '@releasepilot/shared';

interface UseSpecDetailOptions {
  orgSlug: string;
  specId: string;
  queryKey: readonly unknown[];
}

export function useSpecDetail({ orgSlug, specId, queryKey }: UseSpecDetailOptions) {
  return useApiQuery<LibrarySpec>({
    queryKey,
    path: `/api/orgs/${orgSlug}/specs/${specId}`,
    schema: LibrarySpecSchema as unknown as z.ZodType<LibrarySpec>,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!specId,
  });
}
