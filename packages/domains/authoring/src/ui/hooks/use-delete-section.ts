import { useApiMutation } from '@releasepilot/api-client';

interface UseDeleteSectionOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useDeleteSection({ orgSlug, playbookId, invalidateKeys }: UseDeleteSectionOptions) {
  return useApiMutation<void, { sectionId: string }>({
    method: 'DELETE',
    path: ({ sectionId }) => `/api/orgs/${orgSlug}/playbooks/${playbookId}/sections/${sectionId}`,
    invalidateKeys,
  });
}
