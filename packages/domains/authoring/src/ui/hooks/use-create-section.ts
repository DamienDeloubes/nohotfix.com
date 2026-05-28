import { useApiMutation } from '@releasepilot/api-client';

interface CreateSectionResponse {
  id: string;
  playbookId: string;
  name: string;
  position: number;
  createdAt: string;
}

interface UseCreateSectionOptions {
  orgSlug: string;
  playbookId: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useCreateSection({ orgSlug, playbookId, invalidateKeys }: UseCreateSectionOptions) {
  return useApiMutation<CreateSectionResponse, { name: string }>({
    method: 'POST',
    path: `/api/orgs/${orgSlug}/playbooks/${playbookId}/sections`,
    invalidateKeys,
  });
}
