import type { LibrarySpec } from '@nohotfix/shared';

import { useCreateSpec } from '../hooks/use-create-spec.js';
import { SpecForm } from './SpecForm.js';

interface CreateSpecFormProps {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
  onSuccess: (spec: LibrarySpec) => void;
  systemSuggestions?: string[];
  tagsQueryKey?: readonly unknown[];
  storageKey?: string;
}

export function CreateSpecForm({ orgSlug, invalidateKeys, onSuccess, systemSuggestions, tagsQueryKey, storageKey }: CreateSpecFormProps) {
  const createSpec = useCreateSpec({ orgSlug, invalidateKeys });

  return (
    <SpecForm
      orgSlug={orgSlug}
      submitLabel="Create spec"
      isSubmitting={createSpec.isPending}
      {...(systemSuggestions !== undefined ? { systemSuggestions } : {})}
      {...(tagsQueryKey !== undefined ? { tagsQueryKey } : {})}
      {...(storageKey !== undefined ? { storageKey } : {})}
      onSubmit={async (payload) => {
        const result = await createSpec.mutateAsync(payload);
        if (storageKey) {
          try {
            sessionStorage.removeItem(storageKey);
          } catch {
            /* ignore */
          }
        }
        onSuccess(result);
      }}
    />
  );
}
