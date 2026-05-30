import type { ReactElement } from 'react';

/*
 * PassButton — the single most important pixel in the artifact-enforcement
 * argument. Two states:
 *
 *  - "blocked": lock icon, ~0.45 opacity, not-allowed cursor, aria-disabled.
 *    It must read INSTANTLY as blocked, NOT as loading. No spinner, no
 *    animation. The disabled state is a fact. An accessible, keyboard-reachable,
 *    crawlable tooltip (native title + aria-describedby) explains how to enable
 *    it — never a CSS pseudo-element. Minimum 44x44px touch target even when
 *    blocked (mobile).
 *  - "enabled": orange CTA fill, pointer cursor — clearly the same button, now
 *    active. The contrast between the two is the conversion moment.
 */
interface PassButtonProps {
  state: 'blocked' | 'enabled';
  /** Enabling-hint shown beneath the button + as the accessible tooltip (blocked only). */
  hint?: string;
  /** Label override (defaults to "Pass"). */
  label?: string;
  className?: string;
}

function LockGlyph(): ReactElement {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function PassButton({
  state,
  hint,
  label = 'Pass',
  className = '',
}: PassButtonProps): ReactElement {
  if (state === 'enabled') {
    return (
      <button
        type="button"
        className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white ${className}`}
        style={{ background: 'var(--color-primary)' }}
      >
        {label}
      </button>
    );
  }

  const hintId = 'pass-blocked-hint';
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <button
        type="button"
        aria-disabled="true"
        aria-describedby={hint ? hintId : undefined}
        title={hint}
        className="inline-flex min-h-[44px] min-w-[44px] cursor-not-allowed items-center justify-center gap-2
          rounded-md border border-[var(--border-strong)] bg-[var(--bg-input)] px-6 py-2.5
          text-sm font-medium text-[var(--text-secondary)] opacity-45"
      >
        <LockGlyph />
        {label}
      </button>
      {hint ? (
        <span id={hintId} className="text-[11px] text-[var(--text-muted)]">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
