/*
 * FeatureIcon — single source of truth for the inline outline icons used by both
 * the homepage ThreeGuarantees bento and the navigation mega-menu panels.
 *
 * All icons share the marketing site's convention: 24×24 viewBox, no fill,
 * stroke=currentColor (or an explicit color), strokeWidth 2, round caps/joins.
 * Pass `color` to tint (e.g. a brand CSS var); defaults to currentColor.
 */
export type FeatureIconType =
  // Features (the three guarantees)
  | 'lock'
  | 'flag'
  | 'shield'
  // Platform pillars
  | 'check-circle'
  | 'clipboard'
  | 'link'
  | 'layers';

interface FeatureIconProps {
  type: FeatureIconType;
  /** Stroke color — pass a brand CSS var. Defaults to currentColor. */
  color?: string;
  size?: number;
}

export function FeatureIcon({ type, color = 'currentColor', size = 24 }: FeatureIconProps): React.ReactElement {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (type) {
    case 'lock':
      return (
        <svg {...common}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'flag':
      return (
        <svg {...common}>
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'check-circle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12l2.5 2.5 4.5-5" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case 'link':
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...common}>
          <path d="M12 2 2 7l10 5 10-5z" />
          <path d="M2 12l10 5 10-5" />
          <path d="M2 17l10 5 10-5" />
        </svg>
      );
  }
}
