import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Shadow levels sourced from tokens.css (read from CSS vars at runtime to reflect theme)
const shadowLevels = [
  {
    name: 'shadow-card',
    var: '--shadow-card',
    label: 'Card at rest',
  },
  {
    name: 'shadow-card-hover',
    var: '--shadow-card-hover',
    label: 'Card hover lift',
  },
  {
    name: 'shadow-modal',
    var: '--shadow-modal',
    label: 'Modal / dropdown',
  },
  {
    name: 'shadow-overlay',
    var: '--shadow-overlay',
    label: 'Command palette / decision overlay',
  },
];

function ShadowCard({ name, label }: { name: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      <div
        style={{
          width: 180,
          height: 100,
          backgroundColor: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border-default)',
          boxShadow: `var(${name === 'shadow-card' ? '--shadow-card' : name === 'shadow-card-hover' ? '--shadow-card-hover' : name === 'shadow-modal' ? '--shadow-modal' : '--shadow-overlay'})`,
        }}
      />
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
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function ElevationDoc() {
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
        Elevation / Shadows
      </h1>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          color: 'var(--text-secondary)',
          marginBottom: 8,
          maxWidth: 640,
        }}
      >
        Light mode: shadow + 1px border only. No backdrop-filter on cards. Dark mode: solid fill +
        mandatory inset top-edge highlight + shadow. The inset highlight is what makes dark surfaces
        feel lit, not flat.
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 40,
          maxWidth: 640,
          padding: '10px 12px',
          backgroundColor: 'var(--bg-section-alt)',
          borderRadius: 8,
          border: '1px solid var(--border-default)',
        }}
      >
        Glass (<code style={{ fontFamily: "'Geist Mono', monospace" }}>backdrop-filter: blur</code>)
        applies ONLY to sticky nav, dropdown menus, and overlays/modals — never on cards.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
        {shadowLevels.map((level) => (
          <ShadowCard key={level.name} name={level.name} label={level.label} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Elevation',
  component: ElevationDoc,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shadow scale — light uses box-shadow + border, dark adds mandatory inset top highlight. Toggle theme to compare.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ShadowScale: Story = {};
