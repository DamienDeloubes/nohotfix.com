const MAX_LABEL_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;

export interface FileArtifactFormData {
  type: 'file';
  label: string;
  description: string;
  required: boolean;
}

interface FileArtifactFormProps {
  data: FileArtifactFormData;
  index: number;
  onChange: (data: FileArtifactFormData) => void;
  disabled?: boolean | undefined;
  errors?: { label?: string; description?: string } | undefined;
}

export function FileArtifactForm({ data, index, onChange, disabled, errors }: FileArtifactFormProps) {
  const labelTrimmed = data.label.trim();
  const descTrimmed = data.description.trim();

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
          placeholder="e.g. Screenshot of the confirmation page"
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
        <label htmlFor={`artifact-desc-${index}`} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.125rem' }}>
          Description
        </label>
        <textarea
          id={`artifact-desc-${index}`}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Optional guidance for the tester (e.g. Upload a PNG screenshot)"
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

      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', cursor: disabled ? 'default' : 'pointer' }}>
          <input type="checkbox" checked={data.required} onChange={(e) => onChange({ ...data, required: e.target.checked })} disabled={disabled} />
          Required
        </label>
      </div>

      <div
        style={{
          padding: '0.375rem 0.5rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          color: '#0369a1',
        }}
      >
        Files are limited to 10 MB. Only certain file types are accepted.
      </div>
    </div>
  );
}
