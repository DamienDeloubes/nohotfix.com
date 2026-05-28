import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, type ReactNode } from 'react';
import type { z } from 'zod';

import type { ApiClient } from './client.js';
import type { ApiError } from './errors.js';

const ApiClientContext = createContext<ApiClient | null>(null);

export function ApiClientProvider({ client, children }: { client: ApiClient; children: ReactNode }) {
  return <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>;
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiClientContext);
  if (!client) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return client;
}

export interface UseApiQueryOptions<T> {
  queryKey: readonly unknown[];
  path: string;
  schema?: z.ZodType<T> | undefined;
  enabled?: boolean | undefined;
  staleTime?: number | undefined;
  retry?: boolean | number | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  placeholderData?: any;
}

export function useApiQuery<T>(options: UseApiQueryOptions<T>) {
  const client = useApiClient();

  return useQuery<T>({
    queryKey: options.queryKey,
    queryFn: async ({ signal }): Promise<T> => {
      const fetchOptions: { signal: AbortSignal; schema?: z.ZodType<T> } = { signal };
      if (options.schema) fetchOptions.schema = options.schema;
      return client.get<T>(options.path, fetchOptions);
    },
    ...(options.enabled !== undefined ? { enabled: options.enabled } : {}),
    ...(options.staleTime !== undefined ? { staleTime: options.staleTime } : {}),
    ...(options.retry !== undefined ? { retry: options.retry } : {}),
    ...(options.placeholderData !== undefined ? { placeholderData: options.placeholderData } : {}),
  });
}

export interface UseApiMutationOptions<TData, TVariables> {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string | ((variables: TVariables) => string);
  body?: ((variables: TVariables) => unknown) | undefined;
  schema?: z.ZodType<TData> | undefined;
  invalidateKeys?: readonly (readonly unknown[])[] | undefined;
  onSuccess?: ((data: TData) => void) | undefined;
  onError?: ((error: ApiError) => void) | undefined;
}

export function useApiMutation<TData, TVariables = void>(options: UseApiMutationOptions<TData, TVariables>) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const path = typeof options.path === 'function' ? options.path(variables) : options.path;
      const body = options.body ? options.body(variables) : variables;
      const schemaOpts: { schema?: z.ZodType<TData> } = {};
      if (options.schema) schemaOpts.schema = options.schema;

      switch (options.method) {
        case 'POST':
          return client.post<TData>(path, body, schemaOpts);
        case 'PUT':
          return client.put<TData>(path, body, schemaOpts);
        case 'PATCH':
          return client.patch<TData>(path, body, schemaOpts);
        case 'DELETE':
          return client.delete<TData>(path, schemaOpts);
      }
    },
    onSuccess: (data) => {
      if (options.invalidateKeys) {
        for (const key of options.invalidateKeys) {
          void queryClient.invalidateQueries({ queryKey: key as unknown[] });
        }
      }
      if (options.onSuccess) options.onSuccess(data);
    },
    ...(options.onError ? { onError: options.onError } : {}),
  });
}
