interface SeverityFilterDropdownProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function SeverityFilterDropdown({ value, onChange }: SeverityFilterDropdownProps) {
  return (
    <select
      className="bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none cursor-pointer focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)]"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    >
      <option value="">All severities</option>
      <option value="critical">Critical</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  );
}
