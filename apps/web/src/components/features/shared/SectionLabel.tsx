import type { ReactElement } from 'react';

/*
 * SectionLabel — the all-caps section pill used at the top of every content
 * band. Inter 500, 13px, uppercase, tracking.
 *
 * Tones (brand spec):
 *  - orange (default): Orange-600 text / 10% bg / 20% border (light); Orange-500
 *    on dark. Counts as ONE orange element toward the ≤2-per-viewport rule.
 *  - slate: neutral authority — used on the Audit Trail page's compliance
 *    register where orange is reserved even more sparingly.
 *
 * Static — no entrance animation of its own (the section wrapper reveals it).
 */
interface SectionLabelProps {
  children: string;
  tone?: 'orange' | 'slate';
  /** Render as <h2> when this label IS the section heading; defaults to a span. */
  as?: 'span' | 'div';
  id?: string;
  className?: string;
}

export function SectionLabel({
  children,
  tone = 'orange',
  as = 'span',
  id,
  className = '',
}: SectionLabelProps): ReactElement {
  const tones =
    tone === 'orange'
      ? 'text-[var(--color-orange-600)] dark:text-[var(--color-orange-500)] bg-[rgba(234,107,4,0.10)] dark:bg-[rgba(249,115,22,0.10)] border-[rgba(234,107,4,0.20)] dark:border-[rgba(249,115,22,0.20)]'
      : 'text-[var(--color-slate-500)] dark:text-[var(--color-slate-400)] bg-[var(--color-slate-100)] dark:bg-[var(--glass-8)] border-[var(--border-default)]';

  const Tag = as;
  return (
    <Tag
      id={id}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-medium uppercase tracking-[0.08em] ${tones} ${className}`}
    >
      {children}
    </Tag>
  );
}
