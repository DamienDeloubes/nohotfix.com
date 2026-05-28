import { useSpecLibrarySearch } from '../hooks/use-spec-library-search.js';

interface SpecLibraryPickerProps {
  orgSlug: string;
  queryKey: readonly unknown[];
  addedSpecLibraryIds: Set<string>;
  onAdd: (specLibraryId: string) => void;
  onClose: () => void;
}

export function SpecLibraryPicker({ orgSlug, queryKey, addedSpecLibraryIds, onAdd, onClose }: SpecLibraryPickerProps) {
  const { data, isLoading, searchTerm, setSearchTerm } = useSpecLibrarySearch({ orgSlug, queryKey });

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1rem', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Add from library</h3>
        <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>
          &times;
        </button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title or system under test..."
        autoFocus
        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', marginBottom: '0.5rem' }}
      />

      {isLoading && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Searching...</p>}

      {!isLoading && searchTerm && !data?.items?.length && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No specs found</p>}

      {!searchTerm && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Type to search the spec library</p>}

      {data?.items && data.items.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '20rem', overflowY: 'auto' }}>
          {data.items.map((spec) => {
            const isAdded = addedSpecLibraryIds.has(spec.id);
            return (
              <li
                key={spec.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  opacity: isAdded ? 0.5 : 1,
                  cursor: isAdded ? 'default' : 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <span style={{ flex: 1 }}>{spec.title}</span>
                {spec.severity && <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: '#e5e7eb' }}>{spec.severity}</span>}
                {spec.systemUnderTest && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{spec.systemUnderTest}</span>}
                {isAdded ? (
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Added</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAdd(spec.id)}
                    style={{ border: '1px solid #d1d5db', background: '#fff', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Add
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
