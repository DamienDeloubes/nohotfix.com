import { useCallback, useEffect, useRef, useState } from 'react';

import { extractPlainTextLength, type CreateLibrarySpecRequest, type TestStep } from '@releasepilot/shared';

import { useTagsSuggestions } from '../hooks/use-tags-suggestions.js';
import { isEmptyRichText } from '../lib/rich-text.js';
import { ArtifactRequirementsList, hasArtifactErrors, type ArtifactFormData } from './ArtifactRequirementsList.js';
import { RichTextEditor } from './RichTextEditor.js';
import { SystemUnderTestCombobox } from './SystemUnderTestCombobox.js';
import { TagsCombobox } from './TagsCombobox.js';
import { TestStepList } from './TestStepList.js';

const SEVERITY_OPTIONS = ['critical', 'high', 'medium', 'low'] as const;
const MAX_TITLE_LENGTH = 200;
const MAX_PRECONDITIONS_LENGTH = 5000;
const MAX_DESCRIPTION_LENGTH = 10000;
const MAX_EXPECTED_RESULT_LENGTH = 5000;
const MAX_TESTER_NOTES_LENGTH = 2000;
const STORAGE_DEBOUNCE_MS = 500;

export interface SpecFormInitialValues {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  systemUnderTest: string;
  preconditions: unknown;
  description: unknown;
  expectedResult: unknown;
  testerNotes: string;
  testSteps: TestStep[];
  estimatedDurationMinutes: string;
  tags: string[];
  artifactRequirements: ArtifactFormData[];
}

export interface SpecFormProps {
  orgSlug: string;
  onSubmit: (payload: CreateLibrarySpecRequest) => Promise<unknown>;
  onCancel?: () => void;
  submitLabel: string;
  isSubmitting: boolean;
  initialValues?: SpecFormInitialValues;
  systemSuggestions?: string[];
  tagsQueryKey?: readonly unknown[];
  storageKey?: string;
  onDirtyChange?: (dirty: boolean) => void;
}

interface SavedFormState {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  systemUnderTest: string;
  preconditions: unknown;
  description: unknown;
  expectedResult: unknown;
  testerNotes: string;
  testSteps: TestStep[];
  estimatedDurationMinutes: string;
  tags: string[];
  artifactRequirements: ArtifactFormData[];
}

const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' } as const;
const sectionStyle = { marginBottom: '1rem' } as const;

function loadSavedState(key: string | undefined): SavedFormState | null {
  if (!key) return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as SavedFormState;
  } catch {
    return null;
  }
}

export function SpecForm({
  orgSlug,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting,
  initialValues,
  systemSuggestions = [],
  tagsQueryKey,
  storageKey,
  onDirtyChange,
}: SpecFormProps) {
  const saved = useRef(loadSavedState(storageKey));
  const defaults = saved.current ?? initialValues;

  const [title, setTitle] = useState(defaults?.title ?? '');
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>(defaults?.severity ?? 'medium');
  const [systemUnderTest, setSystemUnderTest] = useState(defaults?.systemUnderTest ?? '');
  const [preconditions, setPreconditions] = useState<unknown>(defaults?.preconditions ?? null);
  const [description, setDescription] = useState<unknown>(defaults?.description ?? null);
  const [expectedResult, setExpectedResult] = useState<unknown>(defaults?.expectedResult ?? null);
  const [testerNotes, setTesterNotes] = useState(defaults?.testerNotes ?? '');
  const [testSteps, setTestSteps] = useState<TestStep[]>(defaults?.testSteps ?? []);
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState(defaults?.estimatedDurationMinutes ?? '');
  const [tags, setTags] = useState<string[]>(defaults?.tags ?? []);
  const [artifactRequirements, setArtifactRequirements] = useState<ArtifactFormData[]>(defaults?.artifactRequirements ?? []);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const submittedRef = useRef(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToStorage = useCallback(() => {
    if (!storageKey) return;
    const state: SavedFormState = {
      title,
      severity,
      systemUnderTest,
      preconditions,
      description,
      expectedResult,
      testerNotes,
      testSteps,
      estimatedDurationMinutes,
      tags,
      artifactRequirements,
    };
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* quota exceeded — ignore */
    }
  }, [storageKey, title, severity, systemUnderTest, preconditions, description, expectedResult, testerNotes, testSteps, estimatedDurationMinutes, tags, artifactRequirements]);

  useEffect(() => {
    if (!storageKey) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveToStorage, STORAGE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [storageKey, saveToStorage]);

  // Mark form as dirty when any field changes (skip on mount)
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setIsDirty(true);
    onDirtyChange?.(true);
  }, [title, severity, systemUnderTest, preconditions, description, expectedResult, testerNotes, testSteps, estimatedDurationMinutes, tags, artifactRequirements]);

  // Warn on browser tab close if form is dirty
  useEffect(() => {
    if (!isDirty || submittedRef.current) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const { tags: tagSuggestions } = useTagsSuggestions({
    orgSlug,
    queryKey: tagsQueryKey ?? ['specs', orgSlug, 'tags'],
  });

  const titleTrimmed = title.trim();
  const preconditionsLength = extractPlainTextLength(preconditions);
  const descriptionLength = extractPlainTextLength(description);
  const expectedResultLength = extractPlainTextLength(expectedResult);
  const testerNotesLength = testerNotes.trim().length;
  const hasInvalidSteps = testSteps.some((s) => !s.instruction.trim() && (s.expectedOutcome ?? '').trim().length > 0);

  const parsedDuration = estimatedDurationMinutes ? Number(estimatedDurationMinutes) : null;
  const hasDurationError = parsedDuration !== null && (!Number.isInteger(parsedDuration) || parsedDuration < 1 || parsedDuration > 999);

  const hasArtifactValidationErrors = hasArtifactErrors(artifactRequirements);

  const hasFieldErrors =
    titleTrimmed.length === 0 ||
    titleTrimmed.length > MAX_TITLE_LENGTH ||
    preconditionsLength > MAX_PRECONDITIONS_LENGTH ||
    descriptionLength > MAX_DESCRIPTION_LENGTH ||
    expectedResultLength > MAX_EXPECTED_RESULT_LENGTH ||
    testerNotesLength > MAX_TESTER_NOTES_LENGTH ||
    hasInvalidSteps ||
    hasDurationError ||
    hasArtifactValidationErrors;

  const canSubmit = !hasFieldErrors && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    try {
      const validSteps = testSteps
        .filter((s) => s.instruction.trim())
        .map((s) => ({
          instruction: s.instruction.trim(),
          ...(s.expectedOutcome?.trim() && { expectedOutcome: s.expectedOutcome.trim() }),
        }));
      const payload: CreateLibrarySpecRequest = {
        title: titleTrimmed,
        severity,
        ...(systemUnderTest.trim() && { systemUnderTest: systemUnderTest.trim() }),
        ...(!isEmptyRichText(preconditions) && { preconditions }),
        ...(!isEmptyRichText(description) && { description }),
        ...(validSteps.length > 0 && { testSteps: validSteps }),
        ...(!isEmptyRichText(expectedResult) && { expectedResult }),
        ...(testerNotes.trim() && { testerNotes: testerNotes.trim() }),
        ...(parsedDuration !== null && !hasDurationError && { estimatedDurationMinutes: parsedDuration }),
        ...(tags.length > 0 && { tags }),
        ...(artifactRequirements.length > 0 && {
          artifactRequirements: artifactRequirements.map((a) => {
            if (a.type === 'table') {
              return {
                type: 'table' as const,
                label: a.label.trim(),
                required: a.required,
                ...(a.description.trim() && { description: a.description.trim() }),
                columns: a.columns.map((col) => ({
                  name: col.name.trim(),
                  type: col.type,
                  ...(col.readOnly && (col.type === 'text' || col.type === 'number') && { readOnly: true as boolean }),
                  ...(col.type === 'measured_value' && col.unit && { unit: col.unit as 'ms' | 's' | '%' | 'MB' | 'GB' | 'req/s' }),
                  ...(col.type === 'measured_value' && col.tolerancePercentage && { tolerancePercentage: Number(col.tolerancePercentage) }),
                })),
                rows: a.rows,
              };
            }
            if (a.type === 'measured_value') {
              return {
                type: 'measured_value' as const,
                label: a.label.trim(),
                required: a.required,
                unit: a.unit as 'ms' | 's' | '%' | 'MB' | 'GB' | 'req/s',
                expectedValue: Number(a.expectedValue),
                ...(a.description.trim() && { description: a.description.trim() }),
                ...(a.tolerancePercentage && { tolerancePercentage: Number(a.tolerancePercentage) }),
                ...(a.tolerancePercentage && a.toleranceDescription.trim() && { toleranceDescription: a.toleranceDescription.trim() }),
              };
            }
            if (a.type === 'checkbox') {
              return { type: 'checkbox' as const, label: a.label.trim(), required: a.required };
            }
            return {
              type: a.type as 'text' | 'file' | 'url',
              label: a.label.trim(),
              required: a.required,
              ...(a.description.trim() && { description: a.description.trim() }),
            };
          }),
        }),
      };
      submittedRef.current = true;
      await onSubmit(payload);
    } catch (err) {
      submittedRef.current = false;
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} style={{ maxWidth: '700px' }}>
      {/* Title */}
      <div style={sectionStyle}>
        <label htmlFor="spec-title" style={labelStyle}>
          Title <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="spec-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          placeholder="e.g. Smoke test — login page"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: `1px solid ${titleTrimmed.length > MAX_TITLE_LENGTH ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: '0.75rem', color: titleTrimmed.length > MAX_TITLE_LENGTH ? '#ef4444' : '#6b7280', marginTop: '0.25rem', textAlign: 'right' }}>
          {titleTrimmed.length}/{MAX_TITLE_LENGTH}
        </div>
        {titleTrimmed.length > MAX_TITLE_LENGTH && (
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.125rem' }}>Title must not exceed {MAX_TITLE_LENGTH} characters</div>
        )}
      </div>

      {/* System Under Test + Severity */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="spec-system" style={labelStyle}>
            System Under Test
          </label>
          <SystemUnderTestCombobox value={systemUnderTest} onChange={setSystemUnderTest} suggestions={systemSuggestions} disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="spec-severity" style={labelStyle}>
            Severity
          </label>
          <select
            id="spec-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as typeof severity)}
            disabled={isSubmitting}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
            }}
          >
            {SEVERITY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preconditions */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Preconditions</label>
        <RichTextEditor content={preconditions} onChange={setPreconditions} disabled={isSubmitting} placeholder="Enter preconditions..." />
        <div style={{ fontSize: '0.75rem', color: preconditionsLength > MAX_PRECONDITIONS_LENGTH ? '#ef4444' : '#6b7280', marginTop: '0.25rem', textAlign: 'right' }}>
          {preconditionsLength}/{MAX_PRECONDITIONS_LENGTH}
        </div>
        {preconditionsLength > MAX_PRECONDITIONS_LENGTH && (
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.125rem' }}>Preconditions must not exceed {MAX_PRECONDITIONS_LENGTH.toLocaleString()} characters</div>
        )}
      </div>

      {/* Description */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Description</label>
        <RichTextEditor content={description} onChange={setDescription} disabled={isSubmitting} placeholder="Describe the test..." />
        <div style={{ fontSize: '0.75rem', color: descriptionLength > MAX_DESCRIPTION_LENGTH ? '#ef4444' : '#6b7280', marginTop: '0.25rem', textAlign: 'right' }}>
          {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
        </div>
        {descriptionLength > MAX_DESCRIPTION_LENGTH && (
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.125rem' }}>Description must not exceed {MAX_DESCRIPTION_LENGTH.toLocaleString()} characters</div>
        )}
      </div>

      {/* Test Steps */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Test Steps</label>
        <TestStepList steps={testSteps} onChange={setTestSteps} disabled={isSubmitting} />
      </div>

      {/* Artifact Requirements */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Artifact Requirements</label>
        <ArtifactRequirementsList items={artifactRequirements} onChange={setArtifactRequirements} disabled={isSubmitting} />
      </div>

      {/* Expected Result */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Expected Result</label>
        <RichTextEditor content={expectedResult} onChange={setExpectedResult} disabled={isSubmitting} placeholder="What should happen..." />
        <div style={{ fontSize: '0.75rem', color: expectedResultLength > MAX_EXPECTED_RESULT_LENGTH ? '#ef4444' : '#6b7280', marginTop: '0.25rem', textAlign: 'right' }}>
          {expectedResultLength}/{MAX_EXPECTED_RESULT_LENGTH}
        </div>
        {expectedResultLength > MAX_EXPECTED_RESULT_LENGTH && (
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.125rem' }}>
            Expected result must not exceed {MAX_EXPECTED_RESULT_LENGTH.toLocaleString()} characters
          </div>
        )}
      </div>

      {/* Tester Notes */}
      <div style={sectionStyle}>
        <label htmlFor="spec-notes" style={labelStyle}>
          Tester Notes
        </label>
        <textarea
          id="spec-notes"
          value={testerNotes}
          onChange={(e) => setTesterNotes(e.target.value)}
          placeholder="Additional notes for the tester..."
          disabled={isSubmitting}
          rows={3}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: `1px solid ${testerNotesLength > MAX_TESTER_NOTES_LENGTH ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
        <div style={{ fontSize: '0.75rem', color: testerNotesLength > MAX_TESTER_NOTES_LENGTH ? '#ef4444' : '#6b7280', marginTop: '0.25rem', textAlign: 'right' }}>
          {testerNotesLength}/{MAX_TESTER_NOTES_LENGTH}
        </div>
        {testerNotesLength > MAX_TESTER_NOTES_LENGTH && (
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.125rem' }}>Tester notes must not exceed {MAX_TESTER_NOTES_LENGTH.toLocaleString()} characters</div>
        )}
      </div>

      {/* Tags */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Tags</label>
        <TagsCombobox suggestions={tagSuggestions} value={tags} onChange={setTags} maxTags={10} disabled={isSubmitting} />
      </div>

      {/* Estimated Duration */}
      <div style={sectionStyle}>
        <label htmlFor="spec-duration" style={labelStyle}>
          Estimated Duration (minutes)
        </label>
        <input
          id="spec-duration"
          type="number"
          value={estimatedDurationMinutes}
          onChange={(e) => setEstimatedDurationMinutes(e.target.value)}
          placeholder="e.g. 30"
          disabled={isSubmitting}
          min={1}
          max={999}
          step={1}
          style={{
            width: '8rem',
            padding: '0.5rem 0.75rem',
            border: `1px solid ${hasDurationError ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {hasDurationError && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>Duration must be a whole number between 1 and 999</div>}
      </div>

      {error && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.75rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: canSubmit ? '#2563eb' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {isSubmitting ? `${submitLabel.replace(/^[A-Z]/, (c) => c)}...` : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
