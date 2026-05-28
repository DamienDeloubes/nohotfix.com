import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useId, useRef } from 'react';

import { CheckboxArtifactForm, type CheckboxArtifactFormData } from './CheckboxArtifactForm.js';
import { FileArtifactForm, type FileArtifactFormData } from './FileArtifactForm.js';
import { MeasuredValueArtifactForm, type MeasuredValueArtifactFormData } from './MeasuredValueArtifactForm.js';
import { TableArtifactForm, type TableArtifactFormData } from './TableArtifactForm.js';
import { TextArtifactForm, type TextArtifactFormData } from './TextArtifactForm.js';
import { UrlArtifactForm, type UrlArtifactFormData } from './UrlArtifactForm.js';

const MAX_ARTIFACT_REQUIREMENTS = 10;
const MAX_LABEL_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;

export type ArtifactFormData = TextArtifactFormData | FileArtifactFormData | CheckboxArtifactFormData | UrlArtifactFormData | MeasuredValueArtifactFormData | TableArtifactFormData;

type ArtifactType = 'text' | 'file' | 'checkbox' | 'url' | 'measured_value' | 'table';

const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  text: 'Text',
  file: 'File',
  checkbox: 'Checkbox',
  url: 'URL',
  measured_value: 'Measured Value',
  table: 'Table',
};

interface ArtifactRequirementsListProps {
  items: ArtifactFormData[];
  onChange: (items: ArtifactFormData[]) => void;
  disabled?: boolean;
}

interface ArtifactErrors {
  label?: string;
  description?: string;
}

function validateArtifact(item: ArtifactFormData): ArtifactErrors {
  const errors: ArtifactErrors = {};
  const labelTrimmed = item.label.trim();
  if (labelTrimmed.length === 0) {
    errors.label = 'Label is required';
  } else if (labelTrimmed.length > MAX_LABEL_LENGTH) {
    errors.label = `Label must not exceed ${MAX_LABEL_LENGTH} characters`;
  }
  if (item.type !== 'checkbox') {
    const descTrimmed = item.description.trim();
    if (descTrimmed.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Description must not exceed ${MAX_DESCRIPTION_LENGTH.toLocaleString()} characters`;
    }
  }
  return errors;
}

function hasMeasuredValueErrors(item: ArtifactFormData): boolean {
  if (item.type !== 'measured_value') return false;
  if (item.unit === '') return true;
  if (item.expectedValue === '') return true;
  const ev = Number(item.expectedValue);
  if (!Number.isFinite(ev)) return true;
  if (item.tolerancePercentage !== '') {
    const tp = Number(item.tolerancePercentage);
    if (!Number.isFinite(tp) || tp <= 0) return true;
  }
  if (item.toleranceDescription.trim().length > MAX_DESCRIPTION_LENGTH) return true;
  return false;
}

function hasTableErrors(item: ArtifactFormData): boolean {
  if (item.type !== 'table') return false;
  if (item.columns.length === 0) return true;
  if (item.rows.length === 0) return true;
  if (item.columns.some((col) => !col.name.trim())) return true;
  if (item.columns.some((col) => col.type === 'measured_value' && !col.unit)) return true;
  for (const row of item.rows) {
    for (let ci = 0; ci < item.columns.length; ci++) {
      const col = item.columns[ci]!;
      const cell = row[ci];
      if (col.type === 'text' && col.readOnly && (typeof cell !== 'string' || cell.length === 0)) return true;
      if (col.type === 'number' && col.readOnly && typeof cell !== 'number') return true;
      if (col.type === 'measured_value') {
        const mv = cell as { expectedValue?: number } | null;
        if (!mv || typeof mv.expectedValue !== 'number') return true;
      }
    }
  }
  return false;
}

export function hasArtifactErrors(items: ArtifactFormData[]): boolean {
  return items.some((item) => {
    const errors = validateArtifact(item);
    return errors.label !== undefined || errors.description !== undefined || hasMeasuredValueErrors(item) || hasTableErrors(item);
  });
}

interface SortableArtifactProps {
  id: string;
  index: number;
  item: ArtifactFormData;
  onItemChange: (index: number, data: ArtifactFormData) => void;
  onRemove: (index: number) => void;
  disabled?: boolean | undefined;
  errors: ArtifactErrors;
}

function SortableArtifact({ id, index, item, onItemChange, onRemove, disabled, errors }: SortableArtifactProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        padding: '0.75rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        backgroundColor: '#fafafa',
        alignItems: 'flex-start',
      }}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        style={{
          cursor: disabled ? 'default' : 'grab',
          padding: '0.25rem',
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          fontSize: '1rem',
          lineHeight: 1,
          marginTop: '0.25rem',
        }}
        tabIndex={-1}
        disabled={disabled}
      >
        &#x2630;
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem', minWidth: '2rem', paddingTop: '0.375rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>{index + 1}.</span>
        <span style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 500 }}>{ARTIFACT_TYPE_LABELS[item.type as ArtifactType] ?? item.type}</span>
      </div>
      {item.type === 'checkbox' ? (
        <CheckboxArtifactForm data={item} index={index} onChange={(data) => onItemChange(index, data)} disabled={disabled} errors={errors} />
      ) : item.type === 'file' ? (
        <FileArtifactForm data={item} index={index} onChange={(data) => onItemChange(index, data)} disabled={disabled} errors={errors} />
      ) : item.type === 'url' ? (
        <UrlArtifactForm data={item} index={index} onChange={(data) => onItemChange(index, data)} disabled={disabled} errors={errors} />
      ) : item.type === 'measured_value' ? (
        <MeasuredValueArtifactForm data={item} index={index} onChange={(data) => onItemChange(index, data)} disabled={disabled} errors={errors} />
      ) : item.type === 'table' ? (
        <TableArtifactForm data={item} index={index} onChange={(data) => onItemChange(index, data)} disabled={disabled} errors={errors} />
      ) : (
        <TextArtifactForm data={item} index={index} onChange={(data) => onItemChange(index, data)} disabled={disabled} errors={errors} />
      )}
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={disabled}
        style={{
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
          color: '#ef4444',
          border: '1px solid #fca5a5',
          borderRadius: '0.375rem',
          backgroundColor: 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          marginTop: '0.25rem',
          whiteSpace: 'nowrap',
        }}
      >
        Remove
      </button>
    </div>
  );
}

export function ArtifactRequirementsList({ items, onChange, disabled }: ArtifactRequirementsListProps) {
  const dndId = useId();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const nextId = useRef(items.length);
  const idMapRef = useRef<Map<number, string>>(new Map(items.map((_, i) => [i, `artifact-${i}`])));

  const getItemIds = (): string[] => {
    const map = idMapRef.current;
    for (const key of map.keys()) {
      if (key >= items.length) map.delete(key);
    }
    for (let i = 0; i < items.length; i++) {
      if (!map.has(i)) {
        map.set(i, `artifact-${nextId.current++}`);
      }
    }
    return items.map((_, i) => map.get(i)!);
  };

  const itemIds = getItemIds();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(active.id as string);
      const newIndex = itemIds.indexOf(over.id as string);
      const newItems = arrayMove(items, oldIndex, newIndex);
      const newIds = arrayMove(itemIds, oldIndex, newIndex);
      const newMap = new Map<number, string>();
      newIds.forEach((id, i) => newMap.set(i, id));
      idMapRef.current = newMap;
      onChange(newItems);
    }
  };

  const handleItemChange = (index: number, data: ArtifactFormData) => {
    onChange(items.map((item, i) => (i === index ? data : item)));
  };

  const handleRemove = (index: number) => {
    const newIds = itemIds.filter((_, i) => i !== index);
    const newMap = new Map<number, string>();
    newIds.forEach((id, i) => newMap.set(i, id));
    idMapRef.current = newMap;
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAdd = (type: ArtifactType) => {
    if (items.length >= MAX_ARTIFACT_REQUIREMENTS) return;
    const newId = `artifact-${nextId.current++}`;
    idMapRef.current.set(items.length, newId);
    const newItem: ArtifactFormData =
      type === 'checkbox'
        ? { type: 'checkbox', label: '', required: false }
        : type === 'measured_value'
          ? { type: 'measured_value', label: '', description: '', required: false, unit: '', expectedValue: '', tolerancePercentage: '', toleranceDescription: '' }
          : type === 'table'
            ? { type: 'table', label: '', description: '', required: false, columns: [], rows: [] }
            : ({ type, label: '', description: '', required: false } as ArtifactFormData);
    onChange([...items, newItem]);
  };

  const atMax = items.length >= MAX_ARTIFACT_REQUIREMENTS;

  return (
    <div>
      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.map((item, i) => (
            <SortableArtifact
              key={itemIds[i]}
              id={itemIds[i]!}
              index={i}
              item={item}
              onItemChange={handleItemChange}
              onRemove={handleRemove}
              disabled={disabled}
              errors={validateArtifact(item)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => handleAdd('text')}
          disabled={disabled || atMax}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            color: atMax ? '#9ca3af' : '#2563eb',
            border: `1px solid ${atMax ? '#d1d5db' : '#93c5fd'}`,
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: atMax ? 'not-allowed' : 'pointer',
          }}
        >
          + Text
        </button>
        <button
          type="button"
          onClick={() => handleAdd('file')}
          disabled={disabled || atMax}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            color: atMax ? '#9ca3af' : '#2563eb',
            border: `1px solid ${atMax ? '#d1d5db' : '#93c5fd'}`,
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: atMax ? 'not-allowed' : 'pointer',
          }}
        >
          + File
        </button>
        <button
          type="button"
          onClick={() => handleAdd('checkbox')}
          disabled={disabled || atMax}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            color: atMax ? '#9ca3af' : '#2563eb',
            border: `1px solid ${atMax ? '#d1d5db' : '#93c5fd'}`,
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: atMax ? 'not-allowed' : 'pointer',
          }}
        >
          + Checkbox
        </button>
        <button
          type="button"
          onClick={() => handleAdd('url')}
          disabled={disabled || atMax}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            color: atMax ? '#9ca3af' : '#2563eb',
            border: `1px solid ${atMax ? '#d1d5db' : '#93c5fd'}`,
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: atMax ? 'not-allowed' : 'pointer',
          }}
        >
          + URL
        </button>
        <button
          type="button"
          onClick={() => handleAdd('measured_value')}
          disabled={disabled || atMax}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            color: atMax ? '#9ca3af' : '#2563eb',
            border: `1px solid ${atMax ? '#d1d5db' : '#93c5fd'}`,
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: atMax ? 'not-allowed' : 'pointer',
          }}
        >
          + Measured Value
        </button>
        <button
          type="button"
          onClick={() => handleAdd('table')}
          disabled={disabled || atMax}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            color: atMax ? '#9ca3af' : '#2563eb',
            border: `1px solid ${atMax ? '#d1d5db' : '#93c5fd'}`,
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: atMax ? 'not-allowed' : 'pointer',
          }}
        >
          + Table
        </button>
        {items.length > 0 && (
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {items.length}/{MAX_ARTIFACT_REQUIREMENTS}
          </span>
        )}
      </div>
      {atMax && <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Maximum of {MAX_ARTIFACT_REQUIREMENTS} artifact requirements reached</div>}
    </div>
  );
}
