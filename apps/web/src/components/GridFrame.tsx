import type { ReactNode } from 'react';

type Edge = 'top' | 'bottom' | 'left' | 'right';

interface GridFrameProps {
  children: ReactNode;
  className?: string;
  /** Which framing hairlines to draw. Defaults to all four edges. */
  edges?: Edge[];
  /** Draw the four rounded corner markers. */
  corners?: boolean;
  /** Tint the top-left corner marker with the brand orange (single-accent use). */
  accent?: boolean;
}

/*
 * GridFrame — the technical "blueprint" frame motif (à la Scalora): fading
 * hairline guide lines on the chosen edges + small corner markers. The lines
 * are real elements (not CSS borders) so they bleed past the box and fade at
 * their ends. Decorative only (aria-hidden, pointer-events-none); pair with a
 * `gap-px bg-gridline` grid inside for borders *between* cards.
 */
const EDGE_CLASS: Record<Edge, string> = {
  top: 'grid-line grid-line--h top-0',
  bottom: 'grid-line grid-line--h bottom-0',
  left: 'grid-line grid-line--v left-0',
  right: 'grid-line grid-line--v right-0',
};

export function GridFrame({
  children,
  className = '',
  edges = ['top', 'bottom', 'left', 'right'],
  corners = true,
  accent = false,
}: GridFrameProps): React.ReactElement {
  return (
    <div className={`relative ${className}`}>
      {children}

      {edges.map((edge) => (
        <span key={edge} className={EDGE_CLASS[edge]} aria-hidden="true" />
      ))}

      {corners && (
        <>
          <span
            className={`grid-corner top-0 left-0 -translate-x-1/2 -translate-y-1/2 ${accent ? 'grid-corner--accent' : ''}`}
            aria-hidden="true"
          />
          <span
            className="grid-corner top-0 right-0 translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <span
            className="grid-corner bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          />
          <span
            className="grid-corner bottom-0 right-0 translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}
