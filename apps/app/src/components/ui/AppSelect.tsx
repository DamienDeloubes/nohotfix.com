import { Label, ListBox, Select } from '@heroui/react';

interface AppSelectOption {
  key: string;
  label: string;
}

interface AppSelectProps {
  'aria-label': string;
  options: AppSelectOption[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function AppSelect({ 'aria-label': ariaLabel, options, value, onChange, placeholder, className, label }: AppSelectProps) {
  return (
    <Select
      className={className ?? ''}
      value={value ?? null}
      onChange={(val) => onChange?.(val as string | null)}
      {...(placeholder !== undefined ? { placeholder } : {})}
    >
      {label ? <Label>{label}</Label> : null}
      <Select.Trigger className="bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] h-10 min-h-10 hover:bg-[var(--glass-8)] data-[focus-visible=true]:border-[var(--border-focus)] data-[open=true]:border-[var(--border-focus)] transition-colors [transition-duration:var(--duration-fast)] px-3">
        <Select.Value className="text-sm text-white" />
        <Select.Indicator className="text-white/30" />
      </Select.Trigger>
      <Select.Popover className="bg-[var(--bg-card-elevated)] border border-[var(--border-default)] [box-shadow:var(--shadow-card)] p-1.5 rounded-[var(--radius-sm)]">
        <ListBox aria-label={ariaLabel} className="text-sm outline-none">
          {options.map((opt) => (
            <ListBox.Item
              key={opt.key}
              id={opt.key}
              className="text-white/60 data-[hovered]:bg-[var(--glass-8)] data-[hovered]:text-white data-[focused]:bg-[var(--glass-8)] data-[focused]:text-white data-[selected]:text-white rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)] px-2.5 py-1.5 cursor-pointer outline-none"
            >
              <Label>{opt.label}</Label>
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
