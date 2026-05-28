import { keepPreviousData } from '@tanstack/react-query';

import { useApiQuery } from '@releasepilot/api-client';
import { SpecListResultSchema, type SpecListResult } from '@releasepilot/shared';

interface UseSpecListOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
  params: {
    tab?: string | undefined;
    q?: string | undefined;
    severity?: string | undefined;
    sort?: string | undefined;
    order?: string | undefined;
    page?: number | undefined;
  };
}

export function useSpecList({ orgSlug, queryKey, params }: UseSpecListOptions) {
  const searchParams = new URLSearchParams();
  if (params.tab) searchParams.set('tab', params.tab);
  if (params.q) searchParams.set('q', params.q);
  if (params.severity) searchParams.set('severity', params.severity);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.order) searchParams.set('order', params.order);
  if (params.page) searchParams.set('page', String(params.page));

  const qs = searchParams.toString();
  const path = `/api/orgs/${orgSlug}/specs${qs ? `?${qs}` : ''}`;

  return useApiQuery<SpecListResult>({
    queryKey,
    path,
    schema: SpecListResultSchema,
    staleTime: 30_000,
    retry: 1,
    enabled: !!orgSlug,
    placeholderData: keepPreviousData as unknown as SpecListResult,
  });
}
