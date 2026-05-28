import type { ArtifactRequirementResponse } from '@nohotfix/shared';

interface ArtifactRequirementsDisplayProps {
  requirements: ArtifactRequirementResponse[] | null;
}

export function ArtifactRequirementsDisplay({ requirements }: ArtifactRequirementsDisplayProps) {
  if (!requirements || requirements.length === 0) return null;

  const sorted = [...requirements].sort((a, b) => a.index - b.index);

  return (
    <div>
      {sorted.map((req) => (
        <div
          key={req.index}
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start',
            padding: '0.5rem 0',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', minWidth: '1.5rem' }}>{req.index + 1}.</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
              <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{req.label}</span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.0625rem 0.375rem',
                  borderRadius: '9999px',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor:
                    req.type === 'table'
                      ? '#f3e8ff'
                      : req.type === 'measured_value'
                        ? '#ffe4e6'
                        : req.type === 'checkbox'
                          ? '#dcfce7'
                          : req.type === 'file'
                            ? '#dbeafe'
                            : req.type === 'url'
                              ? '#fef3c7'
                              : '#e0e7ff',
                  color:
                    req.type === 'table'
                      ? '#7c3aed'
                      : req.type === 'measured_value'
                        ? '#e11d48'
                        : req.type === 'checkbox'
                          ? '#15803d'
                          : req.type === 'file'
                            ? '#1d4ed8'
                            : req.type === 'url'
                              ? '#92400e'
                              : '#3730a3',
                }}
              >
                {req.type === 'table'
                  ? 'Table'
                  : req.type === 'measured_value'
                    ? 'Measured Value'
                    : req.type === 'checkbox'
                      ? 'Checkbox'
                      : req.type === 'file'
                        ? 'File'
                        : req.type === 'url'
                          ? 'URL'
                          : 'Text'}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.0625rem 0.375rem',
                  borderRadius: '9999px',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor: req.required ? '#fee2e2' : '#f3f4f6',
                  color: req.required ? '#dc2626' : '#6b7280',
                }}
              >
                {req.required ? 'Required' : 'Optional'}
              </span>
            </div>
            {'description' in req && req.description && <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{req.description}</div>}
            {req.type === 'measured_value' && (
              <div style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 500, color: '#374151' }}>
                    Expected: {req.expectedValue} {req.unit}
                  </span>
                  {req.tolerancePercentage !== null && <span style={{ color: '#6b7280' }}>±{req.tolerancePercentage}%</span>}
                </div>
                {req.toleranceDescription && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.125rem' }}>{req.toleranceDescription}</div>}
              </div>
            )}
            {req.type === 'table' && (
              <div style={{ marginTop: '0.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr>
                      {req.columns.map((col, ci) => (
                        <th
                          key={ci}
                          style={{
                            padding: '0.375rem 0.5rem',
                            borderBottom: '2px solid #d1d5db',
                            textAlign: 'left',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: '#374151',
                            backgroundColor: '#f9fafb',
                          }}
                        >
                          {col.name}
                          <span style={{ fontSize: '0.5625rem', color: '#9ca3af', fontWeight: 400, marginLeft: '0.25rem' }}>
                            {col.type === 'measured_value' ? `(${col.unit})` : col.readOnly ? '(read-only)' : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {req.rows.map((row, ri) => (
                      <tr key={ri}>
                        {req.columns.map((col, ci) => {
                          const cell = row[ci];
                          return (
                            <td key={ci} style={{ padding: '0.375rem 0.5rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem' }}>
                              {col.type === 'boolean' ? (
                                <span style={{ color: '#9ca3af' }}>☐</span>
                              ) : col.type === 'measured_value' ? (
                                <span>
                                  <span style={{ color: '#374151' }}>
                                    expected: {cell !== null && typeof cell === 'object' && 'expectedValue' in cell ? (cell as { expectedValue: number }).expectedValue : '—'}{' '}
                                    {col.unit}
                                  </span>
                                  <span style={{ color: '#9ca3af', marginLeft: '0.25rem' }}>(measured: —)</span>
                                </span>
                              ) : col.readOnly && cell !== null ? (
                                <span style={{ color: '#374151' }}>{String(cell)}</span>
                              ) : (
                                <span style={{ color: '#d1d5db', fontStyle: 'italic' }}>—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
