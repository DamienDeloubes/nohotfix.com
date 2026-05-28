import { useApiMutation } from '@nohotfix/api-client';
import type { UpdateUserProfileDto, UpdateUserProfileRequest } from '@nohotfix/shared';

interface UseUpdateUserProfileOptions {
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useUpdateUserProfile({ invalidateKeys }: UseUpdateUserProfileOptions) {
  return useApiMutation<UpdateUserProfileDto, UpdateUserProfileRequest>({
    method: 'PATCH',
    path: '/api/users/me',
    invalidateKeys,
  });
}
