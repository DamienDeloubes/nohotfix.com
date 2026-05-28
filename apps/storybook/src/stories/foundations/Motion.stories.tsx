import { motion } from '@nohotfix/design-tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

function EasingDemo({ name, value }: { name: string; value: string }) {
  const [active, setActive] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
      <div
        style={{
          height: 48,
          backgroundColor: 'var(--bg-section-alt)',
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => setActive((a) => !a)}
      >
        <div
          style={{
            position: 'absolute',
            top: 8,
            bottom: 8,
            width: 32,
            borderRadius: 6,
            backgroundColor: 'var(--color-primary)',
            left: active ? 'calc(100% - 40px)' : 8,
            transition: `left 400ms ${value}`,
          }}
        />
      </div>
      <p
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        --{name}
      </p>
      <p
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 10,
          color: 'var(--text-muted)',
          margin: 0,
          wordBreak: 'break-all',
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: 'var(--text-disabled)',
          margin: 0,
        }}
      >
        Click to animate
      </p>
    </div>
  );
}

function MotionDoc() {
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
        Motion
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
        Named easing curves and duration tokens. Respect{' '}
        <code style={{ fontFamily: "'Geist Mono', monospace" }}>prefers-reduced-motion</code> —
        wrap all animated elements. Do not animate lock icons, immutability indicators, pass/fail
        badges at rest, or the fire glyph in nav/header.
      </p>

      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 20,
        }}
      >
        Easing Curves
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
        {motion.eases.map((ease) => (
          <EasingDemo key={ease.name} name={ease.name} value={ease.value} />
        ))}
      </div>

      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 16,
        }}
      >
        Duration Tokens
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {motion.durations.map((dur) => {
          const usageMap: Record<string, string> = {
            fast: 'Hover color/opacity shifts',
            standard: 'Nav scroll-transform, card hover',
            deliberate: 'Section entrances',
            slow: 'Page transitions, feature reveals',
          };
          return (
            <div
              key={dur.name}
              style={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  minWidth: 160,
                }}
              >
                --duration-{dur.name}
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  minWidth: 60,
                }}
              >
                {dur.value}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
              >
                {usageMap[dur.name]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Motion',
  component: MotionDoc,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Easing curves and duration tokens. Click the easing demos to see each curve in action.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MotionTokens: Story = {};
