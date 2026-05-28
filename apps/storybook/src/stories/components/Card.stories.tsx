import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Local Card primitive
// Cards are SOLID — no backdrop-filter. See glass model A rule.
// Light: #ffffff bg + rgba(0,0,0,0.08) border + shadow only.
// Dark: #1e1d1b solid + rgba(255,255,255,0.09) border + mandatory inset top highlight.
// ---------------------------------------------------------------------------

interface CardProps {
  elevated?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

function Card({ elevated = false, children, style }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: elevated ? 'var(--bg-card-elevated)' : 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: elevated ? 20 : 16, // --radius-xl for elevated, --radius-lg for standard
        boxShadow: elevated ? 'var(--shadow-modal)' : 'var(--shadow-card)',
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: '0 0 6px',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </p>
  );
}

function CardMeta({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: 'var(--text-muted)',
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta<CardProps> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Solid card component. Light mode: white bg + border + shadow. Dark mode: solid near-black + mandatory inset top-edge highlight. **No backdrop-filter on cards** — glass is reserved for nav and overlays only (Glass Model A).',
      },
    },
  },
  argTypes: {
    elevated: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: { elevated: false },
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <CardTitle>Release gate · PR #1847</CardTitle>
      <CardMeta>Passed 12 of 12 artifacts · 4m ago</CardMeta>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { elevated: true },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardTitle>Go / No-Go Decision</CardTitle>
      <CardMeta>Admin approval required before deployment</CardMeta>
    </Card>
  ),
};

export const BothVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <Card style={{ width: 280 }}>
        <CardTitle>Standard card</CardTitle>
        <CardMeta>--radius-lg (16px) · --shadow-card</CardMeta>
      </Card>
      <Card elevated style={{ width: 280 }}>
        <CardTitle>Elevated card</CardTitle>
        <CardMeta>--radius-xl (20px) · --shadow-modal</CardMeta>
      </Card>
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};
