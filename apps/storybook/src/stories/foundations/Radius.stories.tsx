import { radius } from '@nohotfix/design-tokens';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function RadiusDoc() {
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
        Border Radius
      </h1>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          color: 'var(--text-secondary)',
          marginBottom: 40,
        }}
      >
        Tokens map to <code style={{ fontFamily: "'Geist Mono', monospace" }}>--radius-*</code> CSS
        custom properties.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {radius.map((token) => {
          const usageMap: Record<string, string> = {
            sm: 'Badges, chips',
            md: 'Inputs, buttons',
            lg: 'Standard cards',
            xl: 'Modals, elevated cards',
            '2xl': 'Marketing hero cards',
            full: 'Status pills, avatars',
          };
          return (
            <div key={token.name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'var(--color-orange-100)',
                  border: '1px solid var(--color-orange-300)',
                  borderRadius: token.value,
                  marginBottom: 8,
                }}
              />
              <p
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 2px',
                }}
              >
                --radius-{token.name}
              </p>
              <p
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  margin: '0 0 2px',
                }}
              >
                {token.value}
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: 'var(--text-disabled)',
                  margin: 0,
                }}
              >
                {usageMap[token.name]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Radius',
  component: RadiusDoc,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Border radius scale from @nohotfix/design-tokens.' } },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RadiusScale: Story = {};
