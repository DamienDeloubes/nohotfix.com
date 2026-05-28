import { useEffect, useState } from 'react';

import { useApiQuery } from '@releasepilot/api-client';

interface SpecSearchResult {
  id: string;
  title: string;
  severity: string | null;
  systemUnderTest: string | null;
}

interface SpecSearchResponse {
  items: SpecSearchResult[];
  total: number;
}

interface UseSpecLibrarySearchOptions {
  orgSlug: string;
  queryKey: readonly unknown[];
  enabled?: boolean;
}

export function useSpecLibrarySearch({ orgSlug, queryKey, enabled = true }: UseSpecLibrarySearchOptions) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const query = useApiQuery<SpecSearchResponse>({
    queryKey: [...queryKey, 'search', debouncedTerm],
    path: `/api/orgs/${orgSlug}/specs?tab=active${debouncedTerm ? `&q=${encodeURIComponent(debouncedTerm)}` : ''}`,
    staleTime: 30 * 1000,
    retry: false,
    enabled: enabled && debouncedTerm.length > 0,
  });

  return {
    ...query,
    searchTerm,
    setSearchTerm,
  };
}
