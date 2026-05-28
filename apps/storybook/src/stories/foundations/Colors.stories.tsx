import { colorScales, type Scale } from '@nohotfix/design-tokens';
import type { Meta, StoryObj } from '@storybook/react';

// ---------------------------------------------------------------------------
// Swatch helpers
// ---------------------------------------------------------------------------

function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(clean.substring(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrastRatio(hex: string): number {
  const lum = relativeLuminance(hex);
  const white = 1;
  return (white + 0.05) / (lum + 0.05);
}

function labelColor(hex: string): string {
  return contrastRatio(hex) >= 4.5 ? '#ffffff' : '#111110';
}

// ---------------------------------------------------------------------------
// Swatch
// ---------------------------------------------------------------------------

function Swatch({ name, value, notes }: { name: string; value: string; notes?: string | undefined }) {
  return (
    <div style={{ width: 160 }}>
      <div
        style={{
          backgroundColor: value,
          height: 64,
          borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '6px 8px',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            fontWeight: 500,
            color: labelColor(value),
            opacity: 0.9,
          }}
        >
          {value.toUpperCase()}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: '0 0 2px',
        }}
      >
        {name}
      </p>
      {notes && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          {notes}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scale section
// ---------------------------------------------------------------------------

const scaleNotes: Record<string, Record<string, string>> = {
  orange: {
    'orange-500': 'Dark primary CTA / FAIL on light text',
    'orange-600': 'Light primary CTA (AA 4.5:1)',
    'orange-700': 'Inline links, focus rings',
    'orange-800': 'Inline link AA fallback (#9A3F05)',
  },
  go: {
    'go-500': 'Dark mode go badge text',
    'go-700': 'Light mode go badge text (AA)',
  },
  nogo: {
    'nogo-500': 'Dark mode no-go badge text',
    'nogo-700': 'Light mode no-go badge text (AA)',
  },
  error: {
    'error-500': 'Dark mode error text',
    'error-600': 'Light mode error text',
  },
};

function ScaleGrid({ label, scale }: { label: string; scale: Scale }) {
  const notes = scaleNotes[label.toLowerCase()] ?? {};
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 16,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {scale.map((stop) => (
          <Swatch key={stop.name} name={stop.name} value={stop.value} notes={notes[stop.name]} />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Fire gradient panel
// ---------------------------------------------------------------------------

function FireGradient() {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}
      >
        Fire Gradient — Logo Only
      </h2>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}
      >
        Reserved exclusively for the fire glyph in the NoHotfix wordmark. Never use on UI elements,
        buttons, backgrounds, or decorative purposes.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              background: 'linear-gradient(180deg, #ff0000 0%, #ff8d28 100%)',
              border: '1px solid rgba(0,0,0,0.08)',
              marginBottom: 6,
            }}
          />
          <p
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            --gradient-fire
          </p>
        </div>
        <div>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              backgroundColor: '#ff0000',
              border: '1px solid rgba(0,0,0,0.08)',
              marginBottom: 6,
            }}
          />
          <p
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            #FF0000 (hot)
          </p>
        </div>
        <div>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              backgroundColor: '#ff8d28',
              border: '1px solid rgba(0,0,0,0.08)',
              marginBottom: 6,
            }}
          />
          <p
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            #FF8D28 (warm)
          </p>
        </div>
        <div>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              backgroundColor: '#e05c00',
              border: '1px solid rgba(0,0,0,0.08)',
              marginBottom: 6,
            }}
          />
          <p
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            #E05C00 (flat fallback)
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

function ColorsDoc() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
          letterSpacing: '-0.025em',
        }}
      >
        Color System
      </h1>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          color: 'var(--text-secondary)',
          marginBottom: 40,
          maxWidth: 640,
        }}
      >
        Orange-dominant palette. Light mode primary: Orange-600 (#EA6B04). Dark mode primary:
        Orange-500 (#F97316). Orange-500 is forbidden as text/link color on light surfaces — fails
        AA. Use Orange-700 or Orange-800 for inline links on light. The{' '}
        <strong>inline link AA note</strong>: #9A3F05 (Orange-800) gives ~7.3:1 on #FAFAFA.
      </p>
      {Object.entries(colorScales).map(([key, scale]) => (
        <ScaleGrid key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} scale={scale} />
      ))}
      <FireGradient />
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Colors',
  component: ColorsDoc,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'All color scales from @nohotfix/design-tokens.' } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllScales: Story = {};
