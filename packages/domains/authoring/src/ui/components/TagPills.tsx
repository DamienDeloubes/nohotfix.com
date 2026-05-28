const MAX_VISIBLE = 3;

interface TagPillsProps {
  tags: string[];
}

export function TagPills({ tags }: TagPillsProps) {
  if (tags.length === 0) {
    return <span className="text-white/20 text-xs">&mdash;</span>;
  }

  const visible = tags.slice(0, MAX_VISIBLE);
  const overflow = tags.length - MAX_VISIBLE;

  return (
    <span className="inline-flex gap-1 flex-wrap items-center">
      {visible.map((tag) => (
        <span key={tag} className="inline-block px-1.5 py-px rounded-full text-[0.6875rem] leading-[1.125rem] bg-[var(--glass-8)] text-white/60 border border-[var(--glass-border)] whitespace-nowrap">
          {tag}
        </span>
      ))}
      {overflow > 0 && (
        <span className="inline-block px-1.5 py-px rounded-full text-[0.6875rem] leading-[1.125rem] bg-[var(--glass-12)] text-white/40 border border-[var(--glass-border)] whitespace-nowrap cursor-default" title={tags.slice(MAX_VISIBLE).join(', ')}>
          +{overflow} more
        </span>
      )}
    </span>
  );
}
