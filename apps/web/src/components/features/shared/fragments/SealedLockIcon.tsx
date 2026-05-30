import type { ReactElement } from 'react';

/*
 * SealedLockIcon — a static closed-padlock glyph used wherever a record is
 * sealed/locked.
 *
 * BRAND LAW (Phase 6, "sealed things don't move"): this icon NEVER animates —
 * no pulse, no glow, no idle motion — on any page, regardless of other motion.
 * It is evidence, not a motion event. An accessible tooltip is allowed.
 */
interface SealedLockIconProps {
  size?: number;
  /** 2px Linear-style stroke colour; defaults to the muted slate evidence tone. */
  color?: string;
  /** Accessible tooltip text, e.g. "This record is permanently sealed." */
  tooltip?: string;
  className?: string;
}

export function SealedLockIcon({
  size = 16,
  color = 'var(--color-slate-400)',
  tooltip,
  className = '',
}: SealedLockIconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label={tooltip ?? 'Sealed'}
    >
      {tooltip ? <title>{tooltip}</title> : null}
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
