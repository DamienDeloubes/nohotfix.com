const MAX_LABEL_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_TOLERANCE_DESCRIPTION_LENGTH = 1000;

const UNIT_OPTIONS = [
  { value: 'ms', label: 'ms' },
  { value: 's', label: 's' },
  { value: '%', label: '%' },
  { value: 'MB', label: 'MB' },
  { value: 'GB', label: 'GB' },
  { value: 'req/s', label: 'req/s' },
] as const;

export interface MeasuredValueArtifactFormData {
  type: 'measured_value';
  label: string;
  description: string;
  required: boolean;
  unit: string;
  expectedValue: string;
  tolerancePercentage: string;
  toleranceDescription: string;
}

interface MeasuredValueArtifactFormProps {
  data: MeasuredValueArtifactFormData;
  index: number;
  onChange: (data: MeasuredValueArtifactFormData) => void;
  disabled?: boolean | undefined;
  errors?: { label?: string; description?: string } | undefined;
}

export function MeasuredValueArtifactForm({ data, index, onChange, disabled, errors }: MeasuredValueArtifactFormProps) {
  const labelTrimmed = data.label.trim();
  const descTrimmed = data.description.trim();
  const tolDescTrimmed = data.toleranceDescription.trim();
  const hasTolerance = data.tolerancePercentage !== '';

  const expectedValueNum = data.expectedValue !== '' ? Number(data.expectedValue) : null;
  const expectedValueError = data.expectedValue !== '' && (expectedValueNum === null || !Number.isFinite(expectedValueNum)) ? 'Must be a valid number' : undefined;

  const toleranceNum = data.tolerancePercentage !== '' ? Number(data.tolerancePercentage) : null;
  const toleranceError =
    data.tolerancePercentage !== '' && (toleranceNum === null || !Number.isFinite(toleranceNum) || toleranceNum <= 0) ? 'Must be a positive number greater than zero' : undefined;

  const unitError = data.unit === '' ? 'Unit is required' : undefined;

  const handleToleranceChange = (value: string) => {
    if (value === '') {
      onChange({ ...data, tolerancePercentage: '', toleranceDescription: '' });
    } else {
      onChange({ ...data, tolerancePercentage: value });
    }
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Label */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor={`artifact-label-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
          Label <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id={`artifact-label-${index}`}
          type="text"
          value={data.label}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          placeholder="e.g. Homepage API response time"
          disabled={disabled}
          maxLength={MAX_LABEL_LENGTH}
          style={{
            width: '100%',
            padding: '0.375rem 0.5rem',
            border: `1px solid ${errors?.label ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.125rem' }}>
          <div style={{ fontSize: '0.675rem', color: '#ef4444' }}>{errors?.label ?? ''}</div>
          <div style={{ fontSize: '0.675rem', color: labelTrimmed.length > MAX_LABEL_LENGTH ? '#ef4444' : '#6b7280' }}>
            {labelTrimmed.length}/{MAX_LABEL_LENGTH}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor={`artifact-desc-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
          Description
        </label>
        <textarea
          id={`artifact-desc-${index}`}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="e.g. Measure the P95 response time under normal load"
          disabled={disabled}
          rows={2}
          style={{
            width: '100%',
            padding: '0.375rem 0.5rem',
            border: `1px solid ${errors?.description ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.125rem' }}>
          <div style={{ fontSize: '0.675rem', color: '#ef4444' }}>{errors?.description ?? ''}</div>
          <div style={{ fontSize: '0.675rem', color: descTrimmed.length > MAX_DESCRIPTION_LENGTH ? '#ef4444' : '#6b7280' }}>
            {descTrimmed.length}/{MAX_DESCRIPTION_LENGTH}
          </div>
        </div>
      </div>

      {/* Required toggle */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', cursor: disabled ? 'default' : 'pointer' }}>
          <input type="checkbox" checked={data.required} onChange={(e) => onChange({ ...data, required: e.target.checked })} disabled={disabled} />
          Required
        </label>
      </div>

      {/* Unit + Expected Value row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ flex: '0 0 7rem' }}>
          <label htmlFor={`artifact-unit-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
            Unit <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id={`artifact-unit-${index}`}
            value={data.unit}
            onChange={(e) => onChange({ ...data, unit: e.target.value })}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '0.375rem 0.5rem',
              border: `1px solid ${unitError ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.375rem',
              fontSize: '0.8125rem',
              backgroundColor: 'white',
            }}
          >
            <option value="">Select...</option>
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {unitError && <div style={{ fontSize: '0.675rem', color: '#ef4444', marginTop: '0.125rem' }}>{unitError}</div>}
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor={`artifact-expected-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
            Expected Value <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id={`artifact-expected-${index}`}
            type="number"
            value={data.expectedValue}
            onChange={(e) => onChange({ ...data, expectedValue: e.target.value })}
            placeholder="e.g. 200"
            disabled={disabled}
            step="any"
            style={{
              width: '100%',
              padding: '0.375rem 0.5rem',
              border: `1px solid ${expectedValueError ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.375rem',
              fontSize: '0.8125rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {expectedValueError && <div style={{ fontSize: '0.675rem', color: '#ef4444', marginTop: '0.125rem' }}>{expectedValueError}</div>}
        </div>
      </div>

      {/* Tolerance Percentage */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor={`artifact-tolerance-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
          Tolerance Percentage
        </label>
        <input
          id={`artifact-tolerance-${index}`}
          type="number"
          value={data.tolerancePercentage}
          onChange={(e) => handleToleranceChange(e.target.value)}
          placeholder="e.g. 10 (optional)"
          disabled={disabled}
          step="any"
          min="0"
          style={{
            width: '10rem',
            padding: '0.375rem 0.5rem',
            border: `1px solid ${toleranceError ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {toleranceError && <div style={{ fontSize: '0.675rem', color: '#ef4444', marginTop: '0.125rem' }}>{toleranceError}</div>}
      </div>

      {/* Tolerance Description (conditional) */}
      {hasTolerance && (
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor={`artifact-tol-desc-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
            Tolerance Description
          </label>
          <textarea
            id={`artifact-tol-desc-${index}`}
            value={data.toleranceDescription}
            onChange={(e) => onChange({ ...data, toleranceDescription: e.target.value })}
            placeholder="e.g. Based on last quarter's P95 average"
            disabled={disabled}
            rows={2}
            style={{
              width: '100%',
              padding: '0.375rem 0.5rem',
              border: `1px solid ${tolDescTrimmed.length > MAX_TOLERANCE_DESCRIPTION_LENGTH ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.375rem',
              fontSize: '0.8125rem',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.125rem' }}>
            <div style={{ fontSize: '0.675rem', color: tolDescTrimmed.length > MAX_TOLERANCE_DESCRIPTION_LENGTH ? '#ef4444' : '#6b7280' }}>
              {tolDescTrimmed.length}/{MAX_TOLERANCE_DESCRIPTION_LENGTH}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
