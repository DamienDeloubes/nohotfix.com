import { useCallback, useState } from 'react';

interface PlaybookEditorHeaderProps {
  name: string;
  description?: string;
  environmentId?: string;
  environments?: { id: string; name: string }[];
  onUpdate?: (fields: { name?: string; description?: string; environmentId?: string | null }) => void;
}

export function PlaybookEditorHeader({ name, description, environmentId, environments, onUpdate }: PlaybookEditorHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(name);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(description ?? '');

  const handleSaveName = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== name && onUpdate) {
      onUpdate({ name: trimmed });
    }
    setIsEditingName(false);
  }, [editName, name, onUpdate]);

  const handleSaveDesc = useCallback(() => {
    const trimmed = editDesc.trim();
    if (trimmed !== (description ?? '') && onUpdate) {
      onUpdate({ description: trimmed });
    }
    setIsEditingDesc(false);
  }, [editDesc, description, onUpdate]);

  const handleEnvironmentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!onUpdate) return;
      const value = e.target.value;
      onUpdate({ environmentId: value || null });
    },
    [onUpdate],
  );

  return (
    <header style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {isEditingName ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveName();
              if (e.key === 'Escape') {
                setEditName(name);
                setIsEditingName(false);
              }
            }}
            autoFocus
            style={{ fontSize: '1.5rem', fontWeight: 700, flex: 1, border: '1px solid #d1d5db', borderRadius: '0.25rem', padding: '0.25rem 0.5rem' }}
          />
        ) : (
          <h1
            style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, cursor: onUpdate ? 'pointer' : 'default', flex: 1 }}
            onClick={() => {
              if (onUpdate) {
                setEditName(name);
                setIsEditingName(true);
              }
            }}
          >
            {name}
          </h1>
        )}
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        {isEditingDesc ? (
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            onBlur={handleSaveDesc}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setEditDesc(description ?? '');
                setIsEditingDesc(false);
              }
            }}
            autoFocus
            rows={2}
            placeholder="Add a description..."
            style={{ width: '100%', fontSize: '0.875rem', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '0.25rem', padding: '0.5rem', resize: 'vertical' }}
          />
        ) : (
          <p
            style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', cursor: onUpdate ? 'pointer' : 'default' }}
            onClick={() => {
              if (onUpdate) {
                setEditDesc(description ?? '');
                setIsEditingDesc(true);
              }
            }}
          >
            {description || (onUpdate ? 'Click to add a description...' : 'No description')}
          </p>
        )}
      </div>

      {environments && environments.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="playbook-env" style={{ fontSize: '0.875rem', color: '#374151' }}>
            Environment:
          </label>
          <select
            id="playbook-env"
            value={environmentId ?? ''}
            onChange={handleEnvironmentChange}
            disabled={!onUpdate}
            style={{ fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', padding: '0.25rem 0.5rem' }}
          >
            <option value="">None</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
}
