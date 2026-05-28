import { useEffect, useState } from 'react';

import { useApiQuery } from '@releasepilot/api-client';
import type { CheckSlugDto } from '@releasepilot/shared';

interface UseCheckSlugOptions {
  queryKeyFactory: (slug: string) => readonly unknown[];
}

export function useCheckSlug(slug: string, { queryKeyFactory }: UseCheckSlugOptions) {
  const [debouncedSlug, setDebouncedSlug] = useState(slug);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSlug(slug), 300);
    return () => clearTimeout(timer);
  }, [slug]);

  return useApiQuery<CheckSlugDto>({
    queryKey: queryKeyFactory(debouncedSlug),
    path: `/api/orgs/check-slug?slug=${encodeURIComponent(debouncedSlug)}`,
    enabled: debouncedSlug.length >= 3,
    staleTime: 10_000,
  });
}
