import { spacing } from '@nohotfix/design-tokens';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function SpacingDoc() {
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
        Spacing
      </h1>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          color: 'var(--text-secondary)',
          marginBottom: 40,
        }}
      >
        4px base grid. Tokens map to <code style={{ fontFamily: "'Geist Mono', monospace" }}>--space-*</code> CSS
        custom properties.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {spacing.map((token) => {
          const px = parseInt(token.value);
          return (
            <div
              key={token.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
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
                --space-{token.name}
              </span>
              <div
                style={{
                  height: 20,
                  width: px,
                  backgroundColor: 'var(--color-orange-400)',
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                }}
              >
                {token.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Spacing',
  component: SpacingDoc,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '4px grid spacing scale from @nohotfix/design-tokens.' } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SpacingScale: Story = {};
