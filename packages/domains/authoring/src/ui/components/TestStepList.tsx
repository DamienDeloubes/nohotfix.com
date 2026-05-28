import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useId, useRef } from 'react';

import type { TestStep } from '@releasepilot/shared';

const MAX_TEST_STEPS = 50;
const MAX_INSTRUCTION_LENGTH = 500;
const MAX_EXPECTED_OUTCOME_LENGTH = 500;

interface TestStepListProps {
  steps: TestStep[];
  onChange: (steps: TestStep[]) => void;
  disabled?: boolean;
}

interface SortableStepProps {
  id: string;
  index: number;
  step: TestStep;
  onStepChange: (index: number, field: keyof TestStep, value: string) => void;
  onRemove: (index: number) => void;
  disabled?: boolean | undefined;
}

function SortableStep({ id, index, step, onStepChange, onRemove, disabled }: SortableStepProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={{ ...style, display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
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
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', minWidth: '1.5rem', paddingTop: '0.5rem' }}>{index + 1}.</span>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={step.instruction}
          onChange={(e) => onStepChange(index, 'instruction', e.target.value)}
          placeholder="Instruction"
          disabled={disabled}
          style={{
            width: '100%',
            padding: '0.375rem 0.5rem',
            border: `1px solid ${step.instruction.trim().length > MAX_INSTRUCTION_LENGTH ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '0.125rem',
          }}
        />
        <div style={{ fontSize: '0.675rem', color: step.instruction.trim().length > MAX_INSTRUCTION_LENGTH ? '#ef4444' : '#6b7280', textAlign: 'right', marginBottom: '0.25rem' }}>
          {step.instruction.trim().length}/{MAX_INSTRUCTION_LENGTH}
        </div>
        <input
          type="text"
          value={step.expectedOutcome ?? ''}
          onChange={(e) => onStepChange(index, 'expectedOutcome', e.target.value)}
          placeholder="Expected outcome (optional)"
          disabled={disabled}
          style={{
            width: '100%',
            padding: '0.375rem 0.5rem',
            border: `1px solid ${(step.expectedOutcome ?? '').trim().length > MAX_EXPECTED_OUTCOME_LENGTH ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '0.125rem',
          }}
        />
        {(step.expectedOutcome ?? '').trim().length > 0 && (
          <div style={{ fontSize: '0.675rem', color: (step.expectedOutcome ?? '').trim().length > MAX_EXPECTED_OUTCOME_LENGTH ? '#ef4444' : '#6b7280', textAlign: 'right' }}>
            {(step.expectedOutcome ?? '').trim().length}/{MAX_EXPECTED_OUTCOME_LENGTH}
          </div>
        )}
      </div>
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
        }}
      >
        Remove
      </button>
    </div>
  );
}

export function TestStepList({ steps, onChange, disabled }: TestStepListProps) {
  const dndId = useId();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // Stable IDs: each step gets a unique ID that survives reordering.
  const nextId = useRef(steps.length);
  const idMapRef = useRef<Map<number, string>>(new Map(steps.map((_, i) => [i, `step-${i}`])));

  // Keep idMap in sync: same length as steps, reuse existing IDs by position.
  // On reorder, IDs follow the step objects because we rebuild from the map.
  const getStepIds = (): string[] => {
    const map = idMapRef.current;
    // Trim excess entries
    for (const key of map.keys()) {
      if (key >= steps.length) map.delete(key);
    }
    // Ensure every index has an ID
    for (let i = 0; i < steps.length; i++) {
      if (!map.has(i)) {
        map.set(i, `step-${nextId.current++}`);
      }
    }
    return steps.map((_, i) => map.get(i)!);
  };

  const stepIds = getStepIds();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stepIds.indexOf(active.id as string);
      const newIndex = stepIds.indexOf(over.id as string);
      // Reorder both steps and the ID map together
      const newSteps = arrayMove(steps, oldIndex, newIndex);
      const newIds = arrayMove(stepIds, oldIndex, newIndex);
      const newMap = new Map<number, string>();
      newIds.forEach((id, i) => newMap.set(i, id));
      idMapRef.current = newMap;
      onChange(newSteps);
    }
  };

  const handleStepChange = (index: number, field: keyof TestStep, value: string) => {
    onChange(steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleRemove = (index: number) => {
    // Remove the ID at this index and re-key remaining entries
    const newIds = stepIds.filter((_, i) => i !== index);
    const newMap = new Map<number, string>();
    newIds.forEach((id, i) => newMap.set(i, id));
    idMapRef.current = newMap;
    onChange(steps.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (steps.length >= MAX_TEST_STEPS) return;
    const newId = `step-${nextId.current++}`;
    idMapRef.current.set(steps.length, newId);
    onChange([...steps, { instruction: '' }]);
  };

  return (
    <div>
      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={stepIds} strategy={verticalListSortingStrategy}>
          {steps.map((step, i) => (
            <SortableStep key={stepIds[i]} id={stepIds[i]!} index={i} step={step} onStepChange={handleStepChange} onRemove={handleRemove} disabled={disabled} />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled || steps.length >= MAX_TEST_STEPS}
        style={{
          padding: '0.375rem 0.75rem',
          fontSize: '0.8125rem',
          color: steps.length >= MAX_TEST_STEPS ? '#9ca3af' : '#2563eb',
          border: `1px solid ${steps.length >= MAX_TEST_STEPS ? '#d1d5db' : '#93c5fd'}`,
          borderRadius: '0.375rem',
          backgroundColor: 'white',
          cursor: steps.length >= MAX_TEST_STEPS ? 'not-allowed' : 'pointer',
        }}
      >
        + Add step {steps.length > 0 && `(${steps.length}/${MAX_TEST_STEPS})`}
      </button>
      {steps.length >= MAX_TEST_STEPS && <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Maximum of {MAX_TEST_STEPS} steps reached</div>}
    </div>
  );
}
