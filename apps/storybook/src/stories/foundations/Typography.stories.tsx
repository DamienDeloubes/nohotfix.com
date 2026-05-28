import { typeScale, fontFamilies } from '@nohotfix/design-tokens';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const familyMap: Record<'display' | 'body' | 'mono', string> = {
  display: fontFamilies.display,
  body: fontFamilies.body,
  mono: fontFamilies.mono,
};

function TypeSpecimen() {
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
        Typography
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
        DM Sans for display/hero (H1, H2 — marketing only). Inter for all UI, body, labels,
        buttons. Geist Mono for code, artifact values, run IDs. Display scale always 600+ weight
        with tight tracking.
      </p>

      {typeScale.map((entry) => {
        const family = familyMap[entry.family];
        return (
          <div
            key={entry.style}
            style={{
              borderBottom: '1px solid var(--border-default)',
              paddingBottom: 24,
              marginBottom: 24,
              display: 'grid',
              gridTemplateColumns: '1fr 200px',
              gap: 24,
              alignItems: 'center',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: family,
                  fontSize: entry.sizePx,
                  fontWeight: entry.weight,
                  lineHeight: entry.lineHeight,
                  letterSpacing: entry.tracking,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {entry.style === 'Display' || entry.style === 'H1'
                  ? 'Ship it once.'
                  : entry.style === 'H2'
                    ? 'Caught before production'
                    : entry.style === 'H3' || entry.style === 'H4'
                      ? 'Every artifact required'
                      : entry.family === 'mono'
                        ? 'run_id: 7a3f9c2b-e4d1-4a8f-9b2c-3d7e6f8a1b4c'
                        : 'No surprises in prod.'}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  margin: '0 0 4px',
                }}
              >
                {entry.style}
              </p>
              <p
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 10,
                  color: 'var(--text-disabled)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {entry.sizePx}px · w{entry.weight} · lh{entry.lineHeight}
                <br />
                ls {entry.tracking}
                <br />
                {entry.family}
                <br />
                <span style={{ color: 'var(--text-muted)' }}>{entry.usage}</span>
              </p>
            </div>
          </div>
        );
      })}

      <section style={{ marginTop: 48 }}>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}
        >
          Font Families
        </h2>
        {Object.entries(familyMap).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'baseline',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 12,
                color: 'var(--text-muted)',
                minWidth: 80,
              }}
            >
              {key}
            </span>
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 11,
                color: 'var(--text-secondary)',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Typography',
  component: TypeSpecimen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Type scale rendered from @nohotfix/design-tokens typeScale. DM Sans / Inter / Geist Mono.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScale: Story = {};
