import { useCallback, useState } from 'react';

import type { Playbook } from '@releasepilot/shared';

import { useCreatePlaybook } from '../hooks/use-create-playbook.js';

interface EnvironmentOption {
  id: string;
  name: string;
}

interface CreatePlaybookFormProps {
  orgSlug: string;
  invalidateKeys: readonly (readonly unknown[])[];
  onSuccess: (playbook: Playbook) => void;
  onCancel?: () => void;
  environments?: EnvironmentOption[];
}

export function CreatePlaybookForm({ orgSlug, invalidateKeys, onSuccess, onCancel, environments }: CreatePlaybookFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [environmentId, setEnvironmentId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createPlaybook = useCreatePlaybook({ orgSlug, invalidateKeys });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmed = name.trim();
      if (!trimmed) {
        setError('Name is required');
        return;
      }
      if (trimmed.length > 255) {
        setError('Name cannot exceed 255 characters');
        return;
      }

      try {
        const result = await createPlaybook.mutateAsync({
          name: trimmed,
          ...(description.trim() && { description: description.trim() }),
          ...(environmentId && { environmentId }),
        });
        onSuccess(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create playbook');
      }
    },
    [name, description, environmentId, createPlaybook, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="playbook-name">Name</label>
        <input
          id="playbook-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={255}
          required
          autoFocus
          placeholder="e.g. Sprint Release Checklist"
        />
      </div>

      <div>
        <label htmlFor="playbook-description">Description (optional)</label>
        <textarea
          id="playbook-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Brief description of this playbook"
        />
      </div>

      {environments && environments.length > 0 && (
        <div>
          <label htmlFor="playbook-environment">Environment (optional)</label>
          <select id="playbook-environment" value={environmentId} onChange={(e) => setEnvironmentId(e.target.value)}>
            <option value="">No environment</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p role="alert">{error}</p>}

      <div>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={createPlaybook.isPending}>
          {createPlaybook.isPending ? 'Creating...' : 'Create playbook'}
        </button>
      </div>
    </form>
  );
}
