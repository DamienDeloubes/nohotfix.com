import { useApiQuery } from '@nohotfix/api-client';

export interface PlaybookSpecSummary {
  id: string;
  specLibraryId: string | null;
  title: string;
  severity: string | null;
  systemUnderTest: string | null;
  position: number;
}

export interface PlaybookSectionWithSpecs {
  id: string;
  name: string;
  position: number;
  specs: PlaybookSpecSummary[];
}

export interface PlaybookDetailResponse {
  playbook: {
    id: string;
    name: string;
    description?: string;
    environmentId?: string;
    isArchived: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
  sections: PlaybookSectionWithSpecs[];
  ungroupedSpecs: PlaybookSpecSummary[];
}

interface UsePlaybookDetailOptions {
  orgSlug: string;
  playbookId: string;
  queryKey: readonly unknown[];
}

export function usePlaybookDetail({ orgSlug, playbookId, queryKey }: UsePlaybookDetailOptions) {
  return useApiQuery<PlaybookDetailResponse>({
    queryKey,
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}`,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!playbookId,
  });
}
