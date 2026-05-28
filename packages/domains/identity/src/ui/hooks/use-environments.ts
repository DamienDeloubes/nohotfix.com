import { useApiMutation, useApiQuery } from '@nohotfix/api-client';
import type { CreateEnvironmentRequest, EnvironmentDto } from '@nohotfix/shared';

interface UseEnvironmentsOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
}

export function useEnvironments({ orgSlug, queryKey }: UseEnvironmentsOptions) {
  return useApiQuery<{ environments: EnvironmentDto[] }>({
    queryKey,
    path: `/api/orgs/${orgSlug}/environments`,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!orgSlug,
  });
}

interface UseCreateEnvironmentOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useCreateEnvironment({ orgSlug, invalidateKeys }: UseCreateEnvironmentOptions) {
  return useApiMutation<EnvironmentDto, CreateEnvironmentRequest>({
    method: 'POST',
    path: () => `/api/orgs/${orgSlug}/environments`,
    body: (data) => data,
    invalidateKeys,
  });
}

interface UseRenameEnvironmentOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useRenameEnvironment({ orgSlug, invalidateKeys }: UseRenameEnvironmentOptions) {
  return useApiMutation<EnvironmentDto, { environmentId: string; name: string }>({
    method: 'PATCH',
    path: ({ environmentId }) => `/api/orgs/${orgSlug}/environments/${environmentId}`,
    body: ({ name }) => ({ name }),
    invalidateKeys,
  });
}

interface UseReorderEnvironmentsOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useReorderEnvironments({ orgSlug, invalidateKeys }: UseReorderEnvironmentsOptions) {
  return useApiMutation<{ environments: EnvironmentDto[] }, { environmentIds: string[] }>({
    method: 'POST',
    path: () => `/api/orgs/${orgSlug}/environments/reorder`,
    body: (data) => data,
    invalidateKeys,
  });
}

interface UseDeleteEnvironmentOptions {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
}

export function useDeleteEnvironment({ orgSlug, invalidateKeys }: UseDeleteEnvironmentOptions) {
  return useApiMutation<void, { environmentId: string }>({
    method: 'DELETE',
    path: ({ environmentId }) => `/api/orgs/${orgSlug}/environments/${environmentId}`,
    invalidateKeys,
  });
}
