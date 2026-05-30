import { ImageResponse } from 'next/og';

/*
 * Shared Open Graph card renderer for the feature pages. Used by each route's
 * opengraph-image.tsx via Next's file convention (auto-wires metadata.openGraph.images).
 *
 * Note: ImageResponse supports only a flexbox CSS subset and no Tailwind/tokens,
 * so this is an on-brand SIMPLIFICATION of the hero (headline + eyebrow + mark on
 * the light canvas), not a pixel-perfect DOM crop of the product fragment.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const BG = '#FAFAFA';
const INK = '#111110';
const ORANGE = '#EA6B04';
const MUTED = '#78776F';

export function renderOgCard(eyebrow: string, headline: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: ORANGE }} />
          <div style={{ fontSize: 30, fontWeight: 700, color: INK }}>NoHotfix</div>
        </div>

        {/* Eyebrow + headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: ORANGE,
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: INK, maxWidth: 980 }}>
            {headline}
          </div>
        </div>

        {/* Footer line */}
        <div style={{ fontSize: 26, fontWeight: 600, color: MUTED }}>Ship it once.</div>
      </div>
    ),
    OG_SIZE,
  );
}
