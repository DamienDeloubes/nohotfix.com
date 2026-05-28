import type { ArtifactRequirementResponse, LibrarySpec } from '@nohotfix/shared';

import { useUpdateSpec } from '../hooks/use-update-spec.js';
import type { ArtifactFormData } from './ArtifactRequirementsList.js';
import { SpecForm, type SpecFormInitialValues } from './SpecForm.js';

interface EditSpecFormProps {
  orgSlug: string;
  specId: string;
  spec: LibrarySpec;
  invalidateKeys: readonly (readonly unknown[])[];
  onSuccess: (spec: LibrarySpec) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  systemSuggestions?: string[];
  tagsQueryKey?: readonly unknown[];
}

function toArtifactFormData(artifacts: ArtifactRequirementResponse[] | null): ArtifactFormData[] {
  if (!artifacts) return [];
  return artifacts
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((a): ArtifactFormData => {
      switch (a.type) {
        case 'text':
        case 'file':
        case 'url':
          return { type: a.type, label: a.label, description: a.description ?? '', required: a.required };
        case 'checkbox':
          return { type: 'checkbox', label: a.label, required: a.required };
        case 'measured_value':
          return {
            type: 'measured_value',
            label: a.label,
            description: a.description ?? '',
            required: a.required,
            unit: a.unit,
            expectedValue: String(a.expectedValue),
            tolerancePercentage: a.tolerancePercentage != null ? String(a.tolerancePercentage) : '',
            toleranceDescription: a.toleranceDescription ?? '',
          };
        case 'table':
          return {
            type: 'table',
            label: a.label,
            description: a.description ?? '',
            required: a.required,
            columns: a.columns.map((c) => ({
              name: c.name,
              type: c.type,
              readOnly: c.readOnly ?? false,
              unit: c.unit ?? '',
              tolerancePercentage: c.tolerancePercentage != null ? String(c.tolerancePercentage) : '',
            })),
            rows: a.rows,
          };
      }
    });
}

function toInitialValues(spec: LibrarySpec): SpecFormInitialValues {
  return {
    title: spec.title,
    severity: spec.severity,
    systemUnderTest: spec.systemUnderTest ?? '',
    preconditions: spec.preconditions,
    description: spec.description,
    expectedResult: spec.expectedResult,
    testerNotes: spec.testerNotes ?? '',
    testSteps: spec.testSteps ?? [],
    estimatedDurationMinutes: spec.estimatedDurationMinutes != null ? String(spec.estimatedDurationMinutes) : '',
    tags: spec.tags,
    artifactRequirements: toArtifactFormData(spec.artifactRequirements),
  };
}

export function EditSpecForm({ orgSlug, specId, spec, invalidateKeys, onSuccess, onCancel, onDirtyChange, systemSuggestions, tagsQueryKey }: EditSpecFormProps) {
  const updateSpec = useUpdateSpec({ orgSlug, specId, invalidateKeys });

  return (
    <SpecForm
      orgSlug={orgSlug}
      submitLabel="Save"
      isSubmitting={updateSpec.isPending}
      initialValues={toInitialValues(spec)}
      onCancel={onCancel}
      {...(systemSuggestions !== undefined ? { systemSuggestions } : {})}
      {...(tagsQueryKey !== undefined ? { tagsQueryKey } : {})}
      {...(onDirtyChange !== undefined ? { onDirtyChange } : {})}
      onSubmit={async (payload) => {
        // PUT is full replacement — explicitly send empty/null for fields the form omits
        const fullPayload = {
          ...payload,
          systemUnderTest: payload.systemUnderTest ?? null,
          preconditions: payload.preconditions ?? null,
          description: payload.description ?? null,
          testSteps: payload.testSteps ?? [],
          expectedResult: payload.expectedResult ?? null,
          testerNotes: payload.testerNotes ?? null,
          estimatedDurationMinutes: payload.estimatedDurationMinutes ?? null,
          artifactRequirements: payload.artifactRequirements ?? [],
          tags: payload.tags ?? [],
        };
        const result = await updateSpec.mutateAsync(fullPayload);
        onSuccess(result);
      }}
    />
  );
}
