import { useApiQuery } from '@releasepilot/api-client';
import { SystemsUnderTestResponseSchema } from '@releasepilot/shared';

interface UseSystemsUnderTestOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
}

interface SystemsUnderTestResponse {
  systems: string[];
}

export function useSystemsUnderTest({ orgSlug, queryKey }: UseSystemsUnderTestOptions) {
  const query = useApiQuery<SystemsUnderTestResponse>({
    queryKey,
    path: `/api/orgs/${orgSlug}/specs/systems-under-test`,
    schema: SystemsUnderTestResponseSchema,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!orgSlug,
  });

  return {
    ...query,
    data: query.data?.systems,
  };
}
