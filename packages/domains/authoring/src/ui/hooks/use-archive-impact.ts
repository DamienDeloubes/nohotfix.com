import { useApiQuery } from '@releasepilot/api-client';
import { ArchiveImpactResponseSchema, type ArchiveImpactResponse } from '@releasepilot/shared';

interface UseArchiveImpactOptions {
  orgSlug: string;
  specId: string;
  queryKey: readonly unknown[];
  enabled?: boolean;
}

export function useArchiveImpact({ orgSlug, specId, queryKey, enabled = true }: UseArchiveImpactOptions) {
  return useApiQuery<ArchiveImpactResponse>({
    queryKey,
    path: `/api/orgs/${orgSlug}/specs/${specId}/archive-impact`,
    schema: ArchiveImpactResponseSchema,
    enabled,
  });
}
