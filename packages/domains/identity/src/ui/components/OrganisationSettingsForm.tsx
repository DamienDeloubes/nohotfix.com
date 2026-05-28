import { useState } from 'react';

import { requireRole, type OrganisationDto } from '@nohotfix/shared';

interface OrganisationSettingsFormProps {
  organisation: OrganisationDto | undefined;
  isLoading: boolean;
  error: Error | null;
  role: string;
  onRename?: (newName: string) => Promise<void>;
  isRenaming?: boolean;
  renameError?: Error | null;
}

export function OrganisationSettingsForm({ organisation, isLoading, error, role, onRename, isRenaming, renameError }: OrganisationSettingsFormProps) {
  const canEdit = requireRole(role, { minimum: 'admin' });
  const [name, setName] = useState('');
  const [nameInitialised, setNameInitialised] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sync name state from fetched organisation (once)
  if (organisation && !nameInitialised) {
    setName(organisation.name);
    setNameInitialised(true);
  }

  const nameChanged = organisation ? name.trim() !== organisation.name : false;
  const nameValid = name.trim().length >= 1 && name.trim().length <= 100;

  const handleSave = async () => {
    if (!onRename || !nameValid || !nameChanged) return;
    setSuccessMessage('');
    try {
      await onRename(name.trim());
      setSuccessMessage('Organisation name updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error is surfaced via renameError prop
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-sm text-white/40">Loading organisation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm text-error-500">Failed to load organisation details: {error.message}</p>
      </div>
    );
  }

  if (!organisation) {
    return null;
  }

  const saveDisabled = isRenaming || !nameChanged || !nameValid;

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <label className="block text-sm font-semibold text-white/60 mb-1">Organisation Name</label>
        {canEdit ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="w-full bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none placeholder:text-white/40 focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)]"
          />
        ) : (
          <p className="py-2 text-sm text-white">{organisation.name}</p>
        )}
        {canEdit && !nameValid && name.length > 0 && (
          <p className="text-error-500 text-xs mt-1">Name must be between 1 and 100 characters.</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-white/60 mb-1">Slug</label>
        <p className="py-2 text-sm text-white/40">{organisation.slug}</p>
      </div>

      {canEdit && (
        <div>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saveDisabled}
            className={saveDisabled
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)]'
              : 'bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]'}
          >
            {isRenaming ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {successMessage && <p className="text-go-500 text-xs mt-2">{successMessage}</p>}

      {renameError && <p className="text-error-500 text-xs mt-2">Failed to update name: {renameError.message}</p>}
    </div>
  );
}
