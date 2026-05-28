import { useApiMutation } from '@nohotfix/api-client';

interface UpdateSectionResponse {
  id: string;
  playbookId: string;
  name: string;
  position: number;
  createdAt: string;
}

interface UseUpdateSectionOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useUpdateSection({ orgSlug, playbookId, invalidateKeys }: UseUpdateSectionOptions) {
  return useApiMutation<UpdateSectionResponse, { sectionId: string; name: string }>({
    method: 'PATCH',
    path: ({ sectionId }) => `/api/orgs/${orgSlug}/playbooks/${playbookId}/sections/${sectionId}`,
    body: ({ name }) => ({ name }),
    invalidateKeys,
  });
}
