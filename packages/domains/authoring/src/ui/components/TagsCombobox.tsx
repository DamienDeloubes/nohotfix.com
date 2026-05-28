import { useCallback, useRef, useState } from 'react';

import { toKebabCase } from '@nohotfix/shared';

const MAX_TAG_LENGTH = 30;

interface TagsComboboxProps {
  suggestions: string[];
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags: number;
  disabled?: boolean;
}

export function TagsCombobox({ suggestions, value, onChange, maxTags, disabled }: TagsComboboxProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const kebabInput = toKebabCase(input);
  const inputTooLong = kebabInput.length > MAX_TAG_LENGTH;
  const atMax = value.length >= maxTags;

  const filteredSuggestions = suggestions.filter((s) => s.includes(kebabInput) && !value.includes(s));

  const addTag = useCallback(
    (tag: string) => {
      const kebab = toKebabCase(tag);
      if (!kebab || kebab.length > MAX_TAG_LENGTH) return;
      if (value.includes(kebab)) return;
      if (value.length >= maxTags) return;
      onChange([...value, kebab]);
      setInput('');
      setShowSuggestions(false);
    },
    [value, onChange, maxTags],
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    },
    [value, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (kebabInput && !inputTooLong && !atMax) {
        addTag(input);
      }
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]!);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.375rem',
          padding: '0.375rem 0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          minHeight: '2.25rem',
          alignItems: 'center',
          backgroundColor: disabled ? '#f9fafb' : 'white',
        }}
      >
        {value.map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.125rem 0.5rem',
              backgroundColor: '#e0e7ff',
              color: '#3730a3',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.875rem',
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            )}
          </span>
        ))}
        {!atMax && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow suggestion click
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            placeholder={value.length === 0 ? 'Add tags...' : ''}
            disabled={disabled}
            style={{
              flex: 1,
              minWidth: '6rem',
              border: 'none',
              outline: 'none',
              fontSize: '0.8125rem',
              padding: '0.125rem 0',
              backgroundColor: 'transparent',
            }}
          />
        )}
      </div>

      {inputTooLong && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>Tag must not exceed {MAX_TAG_LENGTH} characters</div>}

      {atMax && <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Maximum of {maxTags} tags reached</div>}

      {showSuggestions && filteredSuggestions.length > 0 && kebabInput && !atMax && (
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            marginTop: '0.25rem',
            backgroundColor: 'white',
            maxHeight: '10rem',
            overflowY: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {filteredSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(s);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.375rem 0.75rem',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
