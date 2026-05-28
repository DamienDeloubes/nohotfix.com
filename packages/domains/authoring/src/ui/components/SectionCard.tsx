import { useCallback, useState } from 'react';

import type { PlaybookSectionWithSpecs } from '../hooks/use-playbook-detail.js';
import { SpecRow } from './SpecRow.js';

interface SectionCardProps {
  section: PlaybookSectionWithSpecs;
  onRename?: (sectionId: string, name: string) => void;
  onDelete?: (sectionId: string) => void;
  onAddSpec?: (sectionId: string) => void;
  onRemoveSpec?: (specId: string) => void;
}

export function SectionCard({ section, onRename, onDelete, onAddSpec, onRemoveSpec }: SectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== section.name && onRename) {
      onRename(section.id, trimmed);
    }
    setIsEditing(false);
  }, [editName, section.id, section.name, onRename]);

  const handleDelete = useCallback(() => {
    if (section.specs.length > 0 && !showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    if (onDelete) {
      onDelete(section.id);
    }
    setShowDeleteConfirm(false);
  }, [section.id, section.specs.length, showDeleteConfirm, onDelete]);

  return (
    <div data-section-id={section.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ cursor: 'grab', userSelect: 'none' }} aria-label="Drag to reorder section">
          ⠿
        </span>
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setEditName(section.name);
                setIsEditing(false);
              }
            }}
            autoFocus
            style={{ flex: 1, fontWeight: 600 }}
          />
        ) : (
          <h3
            style={{ flex: 1, margin: 0, cursor: onRename ? 'pointer' : 'default', fontWeight: 600 }}
            onClick={() => {
              if (onRename) {
                setEditName(section.name);
                setIsEditing(true);
              }
            }}
          >
            {section.name}
          </h3>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.875rem' }}
            aria-label={`Delete section ${section.name}`}
          >
            Delete
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <div style={{ padding: '0.5rem', background: '#fef2f2', borderRadius: '0.25rem', marginBottom: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Delete this section? All {section.specs.length} specs will be removed.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                fontSize: '0.75rem',
                color: '#ef4444',
                border: '1px solid #ef4444',
                background: '#fff',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
              }}
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              style={{ fontSize: '0.75rem', border: '1px solid #d1d5db', background: '#fff', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {section.specs.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No specs in this section</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {section.specs.map((spec) => (
            <SpecRow key={spec.id} spec={spec} {...(onRemoveSpec != null ? { onRemove: onRemoveSpec } : {})} />
          ))}
        </ul>
      )}

      {onAddSpec && (
        <button type="button" onClick={() => onAddSpec(section.id)} style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Add from library
        </button>
      )}
    </div>
  );
}
