import { useApiQuery } from '@releasepilot/api-client';

export interface PlaybookListItem {
  id: string;
  name: string;
  description?: string;
  environmentName?: string;
  isArchived: boolean;
  createdBy: string;
  specCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PlaybookListResponse {
  playbooks: PlaybookListItem[];
}

interface UsePlaybookListOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
  isArchived?: boolean;
}

export function usePlaybookList({ orgSlug, queryKey, isArchived }: UsePlaybookListOptions) {
  const params = isArchived !== undefined ? `?isArchived=${isArchived}` : '';
  return useApiQuery<PlaybookListResponse>({
    queryKey,
    path: `/api/orgs/${orgSlug}/playbooks${params}`,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
