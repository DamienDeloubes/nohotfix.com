import { useMemo, useState } from 'react';

import type { PlaybookDetailResponse } from '../hooks/use-playbook-detail.js';
import { PlaybookEditorHeader } from './PlaybookEditorHeader.js';
import { SectionCard } from './SectionCard.js';
import { SpecLibraryPicker } from './SpecLibraryPicker.js';
import { SpecRow } from './SpecRow.js';

interface PlaybookEditorProps {
  data: PlaybookDetailResponse;
  orgSlug?: string;
  specSearchQueryKey?: readonly unknown[];
  environments?: { id: string; name: string }[];
  onUpdatePlaybook?: (fields: { name?: string; description?: string; environmentId?: string | null }) => void;
  onAddSpec?: (specLibraryId: string, sectionId: string | null) => void;
  onRemoveSpec?: (specId: string) => void;
  onAddSection?: (name: string) => void;
  onRenameSection?: (sectionId: string, name: string) => void;
  onDeleteSection?: (sectionId: string) => void;
}

export function PlaybookEditor({
  data,
  orgSlug,
  specSearchQueryKey,
  environments,
  onUpdatePlaybook,
  onAddSpec,
  onRemoveSpec,
  onAddSection,
  onRenameSection,
  onDeleteSection,
}: PlaybookEditorProps) {
  const { playbook, sections, ungroupedSpecs } = data;
  const [pickerTarget, setPickerTarget] = useState<string | null | false>(false);

  const addedSpecLibraryIds = useMemo(() => {
    const ids = new Set<string>();
    const allSpecs = [...ungroupedSpecs, ...sections.flatMap((s) => s.specs)];
    for (const spec of allSpecs) {
      if (spec.specLibraryId) ids.add(spec.specLibraryId);
    }
    return ids;
  }, [ungroupedSpecs, sections]);

  const handleOpenPicker = (sectionId: string | null) => {
    setPickerTarget(sectionId);
  };

  const handleAdd = (specLibraryId: string) => {
    if (onAddSpec && pickerTarget !== false) {
      onAddSpec(specLibraryId, pickerTarget);
    }
  };

  return (
    <div>
      <PlaybookEditorHeader
        name={playbook.name}
        {...(playbook.description != null ? { description: playbook.description } : {})}
        {...(playbook.environmentId != null ? { environmentId: playbook.environmentId } : {})}
        {...(environments != null ? { environments } : {})}
        {...(onUpdatePlaybook != null ? { onUpdate: onUpdatePlaybook } : {})}
      />

      <section>
        <h2>Ungrouped specs</h2>
        {ungroupedSpecs.length === 0 ? (
          <p>No ungrouped specs yet. Add specs from the library to get started.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {ungroupedSpecs.map((spec) => (
              <SpecRow key={spec.id} spec={spec} {...(onRemoveSpec != null ? { onRemove: onRemoveSpec } : {})} />
            ))}
          </ul>
        )}
        {onAddSpec && (
          <button type="button" onClick={() => handleOpenPicker(null)}>
            Add from library
          </button>
        )}
      </section>

      <section>
        <h2>Sections</h2>
        {sections.map((sec) => (
          <SectionCard
            key={sec.id}
            section={sec}
            {...(onRenameSection != null ? { onRename: onRenameSection } : {})}
            {...(onDeleteSection != null ? { onDelete: onDeleteSection } : {})}
            {...(onAddSpec != null ? { onAddSpec: (sectionId: string) => handleOpenPicker(sectionId) } : {})}
            {...(onRemoveSpec != null ? { onRemoveSpec } : {})}
          />
        ))}
        {onAddSection && (
          <button type="button" onClick={() => onAddSection('New Section')}>
            Add section
          </button>
        )}
      </section>

      {pickerTarget !== false && orgSlug && specSearchQueryKey && (
        <SpecLibraryPicker orgSlug={orgSlug} queryKey={specSearchQueryKey} addedSpecLibraryIds={addedSpecLibraryIds} onAdd={handleAdd} onClose={() => setPickerTarget(false)} />
      )}
    </div>
  );
}
