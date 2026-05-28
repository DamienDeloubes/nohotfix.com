const MAX_LABEL_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_COLUMNS = 5;
const MAX_ROWS = 50;
const MAX_COLUMN_NAME_LENGTH = 100;

const COLUMN_TYPES = ['text', 'number', 'boolean', 'measured_value'] as const;
type ColumnType = (typeof COLUMN_TYPES)[number];

const COLUMN_TYPE_LABELS: Record<ColumnType, string> = {
  text: 'Text',
  number: 'Number',
  boolean: 'Boolean',
  measured_value: 'Measured Value',
};

const VALID_UNITS = ['ms', 's', '%', 'MB', 'GB', 'req/s'] as const;

export interface TableColumnFormData {
  name: string;
  type: ColumnType;
  readOnly: boolean;
  unit: string;
  tolerancePercentage: string;
}

type CellValue = string | number | boolean | null | { expectedValue: number; measuredValue: number | null };

export interface TableArtifactFormData {
  type: 'table';
  label: string;
  description: string;
  required: boolean;
  columns: TableColumnFormData[];
  rows: CellValue[][];
}

interface TableArtifactFormProps {
  data: TableArtifactFormData;
  index: number;
  onChange: (data: TableArtifactFormData) => void;
  disabled?: boolean | undefined;
  errors?: { label?: string; description?: string } | undefined;
}

function getDefaultCellValue(col: TableColumnFormData): CellValue {
  if (col.type === 'boolean') return null;
  if (col.type === 'measured_value') return { expectedValue: 0, measuredValue: null };
  if (col.readOnly) return col.type === 'text' ? '' : 0;
  return null;
}

const inputStyle = {
  width: '100%',
  padding: '0.375rem 0.5rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  fontSize: '0.8125rem',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const smallButtonStyle = {
  padding: '0.25rem 0.5rem',
  fontSize: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  backgroundColor: 'white',
  cursor: 'pointer',
};

export function TableArtifactForm({ data, index, onChange, disabled, errors }: TableArtifactFormProps) {
  const labelTrimmed = data.label.trim();
  const descTrimmed = data.description.trim();

  const updateColumn = (colIndex: number, updates: Partial<TableColumnFormData>) => {
    const newColumns = data.columns.map((col, i) => (i === colIndex ? { ...col, ...updates } : col));
    onChange({ ...data, columns: newColumns });
  };

  const addColumn = () => {
    if (data.columns.length >= MAX_COLUMNS) return;
    const newCol: TableColumnFormData = { name: '', type: 'text', readOnly: false, unit: '', tolerancePercentage: '' };
    const newRows = data.rows.map((row) => [...row, null]);
    onChange({ ...data, columns: [...data.columns, newCol], rows: newRows });
  };

  const removeColumn = (colIndex: number) => {
    const newColumns = data.columns.filter((_, i) => i !== colIndex);
    const newRows = data.rows.map((row) => row.filter((_, i) => i !== colIndex));
    onChange({ ...data, columns: newColumns, rows: newRows });
  };

  const handleColumnTypeChange = (colIndex: number, newType: ColumnType) => {
    const newColumns = data.columns.map((col, i) => {
      if (i !== colIndex) return col;
      return {
        ...col,
        type: newType,
        readOnly: newType === 'text' || newType === 'number' ? col.readOnly : false,
        unit: newType === 'measured_value' ? col.unit || 'ms' : '',
        tolerancePercentage: newType === 'measured_value' ? col.tolerancePercentage : '',
      };
    });
    const newCol = newColumns[colIndex]!;
    const newRows = data.rows.map((row) => {
      const newRow = [...row];
      newRow[colIndex] = getDefaultCellValue(newCol);
      return newRow;
    });
    onChange({ ...data, columns: newColumns, rows: newRows });
  };

  const addRow = () => {
    if (data.rows.length >= MAX_ROWS) return;
    const newRow = data.columns.map((col) => getDefaultCellValue(col));
    onChange({ ...data, rows: [...data.rows, newRow] });
  };

  const removeRow = (rowIndex: number) => {
    onChange({ ...data, rows: data.rows.filter((_, i) => i !== rowIndex) });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: CellValue) => {
    const newRows = data.rows.map((row, ri) => {
      if (ri !== rowIndex) return row;
      const newRow = [...row];
      newRow[colIndex] = value;
      return newRow;
    });
    onChange({ ...data, rows: newRows });
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
          placeholder="e.g. API endpoint load times"
          disabled={disabled}
          maxLength={MAX_LABEL_LENGTH}
          style={{ ...inputStyle, border: `1px solid ${errors?.label ? '#ef4444' : '#d1d5db'}` }}
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
          placeholder="e.g. Measure response times for all critical endpoints"
          disabled={disabled}
          rows={2}
          style={{ ...inputStyle, border: `1px solid ${errors?.description ? '#ef4444' : '#d1d5db'}`, resize: 'vertical' as const }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.125rem' }}>
          <div style={{ fontSize: '0.675rem', color: '#ef4444' }}>{errors?.description ?? ''}</div>
          <div style={{ fontSize: '0.675rem', color: descTrimmed.length > MAX_DESCRIPTION_LENGTH ? '#ef4444' : '#6b7280' }}>
            {descTrimmed.length}/{MAX_DESCRIPTION_LENGTH}
          </div>
        </div>
      </div>

      {/* Required toggle */}
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', cursor: disabled ? 'default' : 'pointer' }}>
          <input type="checkbox" checked={data.required} onChange={(e) => onChange({ ...data, required: e.target.checked })} disabled={disabled} />
          Required
        </label>
      </div>

      {/* Columns */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
            Columns ({data.columns.length}/{MAX_COLUMNS})
          </span>
          <button
            type="button"
            onClick={addColumn}
            disabled={disabled || data.columns.length >= MAX_COLUMNS}
            style={{
              ...smallButtonStyle,
              color: data.columns.length >= MAX_COLUMNS ? '#9ca3af' : '#2563eb',
              borderColor: data.columns.length >= MAX_COLUMNS ? '#d1d5db' : '#93c5fd',
              cursor: data.columns.length >= MAX_COLUMNS || disabled ? 'not-allowed' : 'pointer',
            }}
          >
            + Column
          </button>
        </div>
        {data.columns.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{
              display: 'flex',
              gap: '0.375rem',
              alignItems: 'flex-start',
              marginBottom: '0.375rem',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              backgroundColor: '#f9fafb',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                type="text"
                value={col.name}
                onChange={(e) => updateColumn(colIdx, { name: e.target.value })}
                placeholder="Column name"
                disabled={disabled}
                maxLength={MAX_COLUMN_NAME_LENGTH}
                style={{ ...inputStyle, fontSize: '0.75rem', padding: '0.25rem 0.375rem', border: `1px solid ${!col.name.trim() ? '#ef4444' : '#d1d5db'}` }}
              />
              {!col.name.trim() && <div style={{ fontSize: '0.625rem', color: '#ef4444', marginTop: '0.125rem' }}>Name required</div>}
            </div>
            <select
              value={col.type}
              onChange={(e) => handleColumnTypeChange(colIdx, e.target.value as ColumnType)}
              disabled={disabled}
              style={{ padding: '0.25rem 0.375rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.75rem', backgroundColor: 'white' }}
            >
              {COLUMN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {COLUMN_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            {(col.type === 'text' || col.type === 'number') && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={col.readOnly} onChange={(e) => updateColumn(colIdx, { readOnly: e.target.checked })} disabled={disabled} />
                Read-only
              </label>
            )}
            {col.type === 'measured_value' && (
              <>
                <select
                  value={col.unit}
                  onChange={(e) => updateColumn(colIdx, { unit: e.target.value })}
                  disabled={disabled}
                  style={{
                    padding: '0.25rem 0.375rem',
                    border: `1px solid ${!col.unit ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="">Unit...</option>
                  {VALID_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={col.tolerancePercentage}
                  onChange={(e) => updateColumn(colIdx, { tolerancePercentage: e.target.value })}
                  placeholder="Tol %"
                  disabled={disabled}
                  min={0}
                  step="any"
                  style={{ width: '4.5rem', padding: '0.25rem 0.375rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.75rem', boxSizing: 'border-box' }}
                />
              </>
            )}
            <button type="button" onClick={() => removeColumn(colIdx)} disabled={disabled} style={{ ...smallButtonStyle, color: '#ef4444', borderColor: '#fca5a5' }}>
              ×
            </button>
          </div>
        ))}
        {data.columns.length === 0 && <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>At least one column is required.</div>}
      </div>

      {/* Rows / Table Editor */}
      {data.columns.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              Rows ({data.rows.length}/{MAX_ROWS})
            </span>
            <button
              type="button"
              onClick={addRow}
              disabled={disabled || data.rows.length >= MAX_ROWS}
              style={{
                ...smallButtonStyle,
                color: data.rows.length >= MAX_ROWS ? '#9ca3af' : '#2563eb',
                borderColor: data.rows.length >= MAX_ROWS ? '#d1d5db' : '#93c5fd',
                cursor: data.rows.length >= MAX_ROWS || disabled ? 'not-allowed' : 'pointer',
              }}
            >
              + Row
            </button>
          </div>
          {data.rows.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.25rem 0.375rem', borderBottom: '2px solid #d1d5db', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, color: '#374151' }}>
                      #
                    </th>
                    {data.columns.map((col, ci) => (
                      <th
                        key={ci}
                        style={{ padding: '0.25rem 0.375rem', borderBottom: '2px solid #d1d5db', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, color: '#374151' }}
                      >
                        {col.name || `Col ${ci + 1}`}
                        <span style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 400, marginLeft: '0.25rem' }}>
                          ({COLUMN_TYPE_LABELS[col.type]}
                          {col.readOnly ? ', RO' : ''})
                        </span>
                      </th>
                    ))}
                    <th style={{ padding: '0.25rem', borderBottom: '2px solid #d1d5db', width: '2rem' }} />
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, ri) => (
                    <tr key={ri}>
                      <td style={{ padding: '0.25rem 0.375rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.6875rem' }}>{ri + 1}</td>
                      {data.columns.map((col, ci) => (
                        <td key={ci} style={{ padding: '0.25rem 0.375rem', borderBottom: '1px solid #e5e7eb' }}>
                          {renderCellInput(col, row[ci]!, ri, ci, disabled, updateCell)}
                        </td>
                      ))}
                      <td style={{ padding: '0.25rem', borderBottom: '1px solid #e5e7eb' }}>
                        <button
                          type="button"
                          onClick={() => removeRow(ri)}
                          disabled={disabled}
                          style={{ ...smallButtonStyle, color: '#ef4444', borderColor: '#fca5a5', padding: '0.125rem 0.25rem' }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data.rows.length === 0 && <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>At least one row is required.</div>}
        </div>
      )}
    </div>
  );
}

function renderCellInput(
  col: TableColumnFormData,
  cell: CellValue,
  rowIndex: number,
  colIndex: number,
  disabled: boolean | undefined,
  updateCell: (rowIndex: number, colIndex: number, value: CellValue) => void,
) {
  const cellInputStyle = {
    width: '100%',
    padding: '0.25rem 0.375rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  switch (col.type) {
    case 'text':
      if (col.readOnly) {
        return (
          <input
            type="text"
            value={typeof cell === 'string' ? cell : ''}
            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
            disabled={disabled}
            placeholder="Value..."
            style={cellInputStyle}
          />
        );
      }
      return <span style={{ color: '#9ca3af', fontSize: '0.6875rem', fontStyle: 'italic' }}>Tester fills</span>;

    case 'number':
      if (col.readOnly) {
        return (
          <input
            type="number"
            value={typeof cell === 'number' ? cell : ''}
            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value === '' ? 0 : Number(e.target.value))}
            disabled={disabled}
            placeholder="0"
            step="any"
            style={cellInputStyle}
          />
        );
      }
      return <span style={{ color: '#9ca3af', fontSize: '0.6875rem', fontStyle: 'italic' }}>Tester fills</span>;

    case 'boolean':
      return <span style={{ color: '#9ca3af', fontSize: '0.6875rem', fontStyle: 'italic' }}>Tester fills</span>;

    case 'measured_value': {
      const mv = cell !== null && typeof cell === 'object' && 'expectedValue' in cell ? cell : { expectedValue: 0, measuredValue: null };
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <input
            type="number"
            value={mv.expectedValue}
            onChange={(e) => updateCell(rowIndex, colIndex, { expectedValue: e.target.value === '' ? 0 : Number(e.target.value), measuredValue: null })}
            disabled={disabled}
            placeholder="Expected"
            step="any"
            style={{ ...cellInputStyle, width: '5rem' }}
          />
          {col.unit && <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{col.unit}</span>}
        </div>
      );
    }
  }
}
