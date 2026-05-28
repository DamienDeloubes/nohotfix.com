import { useEffect, useRef, useState } from 'react';

interface SpecSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export function SpecSearchBar({ value, onChange, isLoading }: SpecSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(newValue: string) {
    setLocalValue(newValue);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  }

  function handleClear() {
    setLocalValue('');
    clearTimeout(timerRef.current);
    onChange('');
  }

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="relative flex-1 min-w-[200px] max-w-[400px]">
      <input
        type="text"
        className="w-full bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm pl-3 pr-8 py-2 outline-none placeholder:text-white/30 focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)]"
        placeholder="Search by title or system under test..."
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
      />
      {isLoading && (
        <span className={`absolute top-1/2 -translate-y-1/2 text-xs text-white/30 ${localValue ? 'right-7' : 'right-2'}`}>
          ...
        </span>
      )}
      {localValue && (
        <button
          type="button"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base text-white/30 px-1 leading-none hover:text-white/60 transition-colors [transition-duration:var(--duration-fast)]"
          onClick={handleClear}
          title="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}
