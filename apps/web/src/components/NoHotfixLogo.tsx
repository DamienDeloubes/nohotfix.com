/**
 * NoHotfix wordmark — fire-in-the-"o" variant
 *
 * The lowercase "o" in "Hotfix" is replaced by the brand flame glyph.
 * Two variants:
 *   dark  — white letterforms on dark surface (nav default)
 *   light — #111110 (near-black, v5 Dark-900) on light surface (footer, light pages)
 *
 * Usage:
 *   <NoHotfixLogo variant="dark"  height={24} />
 *   <NoHotfixLogo variant="light" height={20} />
 *
 * The SVG scales proportionally via height prop.
 * Base canvas: 240×48. Aspect ratio: 5:1.
 * Fire gradient always rendered — never replaced with flat color in UI contexts.
 */

interface NoHotfixLogoProps {
  variant?: 'dark' | 'light';
  /** Height in px. Width scales proportionally (ratio 5:1). Default: 24 */
  height?: number;
  className?: string;
  id?: string;
}

export function NoHotfixLogo({
  variant = 'dark',
  height = 24,
  className,
  id,
}: NoHotfixLogoProps) {
  // #111110 = Dark-900 (v5 near-black, replaces retired violet #0D0920)
  const letterColor = variant === 'dark' ? '#FFFFFF' : '#111110';
  // Unique gradient ID per instance to avoid conflicts when multiple logos are on the page
  const gradientId = id ? `nhfg-${id}` : `nhfg-${variant}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 48"
      height={height}
      width={height * 5}
      fill="none"
      aria-label="NoHotfix"
      role="img"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#FF8D28" />
          <stop offset="100%" stopColor="#FF0000" />
        </linearGradient>
      </defs>

      {/* "NoH" — the first three characters */}
      <text
        x="4"
        y="36"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="700"
        fontSize="32"
        letterSpacing="0.32"
        fill={letterColor}
      >
        NoH
      </text>

      {/*
       * Fire glyph — replaces the "o" in "Hotfix" (4th char of NoHotfix)
       * Canonical path on 20×24 local canvas.
       * translate(68, 12): aligns after "NoH" block, y=12 so glyph spans
       * y=12..36 (24px = matches cap-height region at 32px Inter 700).
       * Shape: asymmetric teardrop, tip at x≈11 (slight rightward lean),
       * left-side concavity reads as flame silhouette.
       */}
      <g transform="translate(68, 12)">
        <path
          d="M10,24 C2,24 0,18 0,13.5 C0,8 5,3 11,0.5 C16,2 20,8 20,13.5 C20,19 16,24 10,24Z"
          fill={`url(#${gradientId})`}
        />
      </g>

      {/* "tfix" — resumes after fire glyph */}
      <text
        x="90"
        y="36"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="700"
        fontSize="32"
        letterSpacing="0.32"
        fill={letterColor}
      >
        tfix
      </text>
    </svg>
  );
}
