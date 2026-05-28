const SEVERITY_CLASSES: Record<string, string> = {
  critical: 'bg-error-500/15 text-error-500 border border-error-500/30',
  high: 'bg-nogo-500/15 text-nogo-400 border border-nogo-500/30',
  medium: 'bg-nogo-500/10 text-nogo-500 border border-nogo-500/20',
  low: 'bg-[var(--glass-8)] text-white/50 border border-[var(--glass-border)]',
};

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | null;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  if (!severity) {
    return <span className="text-white/20 text-xs">&mdash;</span>;
  }

  const colorClass = SEVERITY_CLASSES[severity] ?? SEVERITY_CLASSES.low;

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium leading-5 capitalize ${colorClass}`}>
      {severity}
    </span>
  );
}
