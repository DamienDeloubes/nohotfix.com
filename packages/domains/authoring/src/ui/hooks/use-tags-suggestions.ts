import { useApiQuery } from '@nohotfix/api-client';

interface UseTagsSuggestionsParams {
  orgSlug: string;
  queryKey: readonly unknown[];
}

export function useTagsSuggestions({ orgSlug, queryKey }: UseTagsSuggestionsParams) {
  const { data, isLoading } = useApiQuery<{ tags: string[] }>({
    queryKey: [...queryKey],
    path: `/api/orgs/${orgSlug}/specs/tags`,
  });

  return {
    tags: data?.tags ?? [],
    isLoading,
  };
}
