import type { ReactElement } from 'react';

/*
 * ArtifactRequirementPanel — the per-spec evidence panel a tester sees during
 * execution. Each requirement shows its completion state inline. Geist Mono on
 * values/thresholds. Faithful product DOM (crawlable labels, FR-004).
 */
export type ArtifactType = 'file' | 'text' | 'checkbox' | 'url' | 'measured' | 'table';

export interface ArtifactRequirement {
  type: ArtifactType;
  label: string;
  status: 'complete' | 'incomplete';
  /** Filled value for complete requirements (URL, measured number, etc.). */
  value?: string;
  /** Threshold annotation for measured-value requirements, e.g. "≤ 3000 ms". */
  threshold?: string;
}

function CheckGlyph(): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-go-600)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

function IncompleteGlyph(): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-slate-400)"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
    </svg>
  );
}

export function ArtifactRequirementPanel({
  requirements,
  className = '',
}: {
  requirements: ArtifactRequirement[];
  className?: string;
}): ReactElement {
  return (
    <ul className={`space-y-2 ${className}`}>
      {requirements.map((req, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-card-elevated)] px-3 py-2.5"
        >
          <span className="mt-0.5 shrink-0" aria-hidden="true">
            {req.status === 'complete' ? <CheckGlyph /> : <IncompleteGlyph />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[var(--text-secondary)]">{req.label}</p>
            {req.value ? (
              <p className="mt-1 truncate font-mono text-[11px] text-[var(--text-primary)]">
                {req.value}
                {req.threshold ? (
                  <span className="ml-2 text-[var(--text-muted)]">{req.threshold}</span>
                ) : null}
              </p>
            ) : (
              <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                {req.status === 'incomplete' ? 'Required — not yet provided' : ''}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
