const MAX_LABEL_LENGTH = 200;

export interface CheckboxArtifactFormData {
  type: 'checkbox';
  label: string;
  required: boolean;
}

interface CheckboxArtifactFormProps {
  data: CheckboxArtifactFormData;
  index: number;
  onChange: (data: CheckboxArtifactFormData) => void;
  disabled?: boolean | undefined;
  errors?: { label?: string } | undefined;
}

export function CheckboxArtifactForm({ data, index, onChange, disabled, errors }: CheckboxArtifactFormProps) {
  const labelTrimmed = data.label.trim();

  return (
    <div style={{ flex: 1 }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <label htmlFor={`artifact-label-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
          Label <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id={`artifact-label-${index}`}
          type="text"
          value={data.label}
          onChange={(e) => onChange({ ...data, label: e.target.value })}
          placeholder="e.g. I verified this in staging"
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

      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', cursor: disabled ? 'default' : 'pointer' }}>
          <input type="checkbox" checked={data.required} onChange={(e) => onChange({ ...data, required: e.target.checked })} disabled={disabled} />
          Required
        </label>
      </div>
    </div>
  );
}
