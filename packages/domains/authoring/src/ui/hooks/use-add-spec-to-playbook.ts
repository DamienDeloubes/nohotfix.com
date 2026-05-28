import { useApiMutation } from '@releasepilot/api-client';
import type { AddSpecFromLibraryRequest } from '@releasepilot/shared';

interface AddSpecResponse {
  id: string;
  sectionId: string | null;
  specLibraryId: string | null;
  title: string;
  severity: string | null;
  systemUnderTest: string | null;
  position: number;
}

interface UseAddSpecToPlaybookOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useAddSpecToPlaybook({ orgSlug, playbookId, invalidateKeys }: UseAddSpecToPlaybookOptions) {
  return useApiMutation<AddSpecResponse, AddSpecFromLibraryRequest>({
    method: 'POST',
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}/specs`,
    invalidateKeys,
  });
}
