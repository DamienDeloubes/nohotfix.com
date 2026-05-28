import { useEffect, useRef, useState } from 'react';

interface SystemUnderTestComboboxProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  disabled?: boolean;
}

export function SystemUnderTestCombobox({ value, onChange, suggestions, disabled }: SystemUnderTestComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const lower = value.toLowerCase();
      setFiltered(suggestions.filter((s) => s.toLowerCase().includes(lower)));
    } else {
      setFiltered(suggestions);
    }
  }, [value, suggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="e.g. Auth Service"
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {isOpen && filtered.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            margin: '0.25rem 0 0',
            padding: 0,
            listStyle: 'none',
            zIndex: 10,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
        >
          {filtered.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => {
                onChange(suggestion);
                setIsOpen(false);
              }}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: suggestion === value ? '#eff6ff' : 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = suggestion === value ? '#eff6ff' : 'transparent';
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
