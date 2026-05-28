import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Local Button primitive — styled with design token CSS variables
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: 13 },
  md: { padding: '9px 18px', fontSize: 14 },
  lg: { padding: '12px 24px', fontSize: 15 },
};

function Button({ variant = 'primary', size = 'md', disabled = false, children, onClick }: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const base: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    borderRadius: 10, // --radius-md
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'background-color 150ms, box-shadow 150ms, color 150ms, border-color 150ms',
    outline: 'none',
    textDecoration: 'none',
    lineHeight: 1.4,
    opacity: disabled ? 0.45 : 1,
    ...sizeStyles[size],
  };

  const focusRing: React.CSSProperties = focused
    ? { boxShadow: '0 0 0 3px var(--border-focus)', outline: '2px solid transparent' }
    : {};

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: active
        ? 'var(--color-primary-active)'
        : hovered
          ? 'var(--color-primary-hover)'
          : 'var(--color-primary)',
      color: 'var(--color-primary-text)',
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: hovered ? 'var(--bg-hover)' : 'var(--bg-card)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-default)',
    },
    ghost: {
      backgroundColor: hovered ? 'var(--bg-hover)' : 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: active
        ? 'var(--color-error-700)'
        : hovered
          ? 'var(--color-error-600)'
          : 'var(--color-error-500)',
      color: '#ffffff',
      borderColor: 'transparent',
    },
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{ ...base, ...variantStyles[variant], ...focusRing }}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button primitive styled with design token CSS variables. Four variants × three sizes × disabled/focus states. Focus ring uses --border-focus (matches --color-primary per theme).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Approve run' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'View details' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Cancel' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Reject' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Approve run', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {(['primary', 'secondary', 'ghost', 'danger'] as ButtonVariant[]).map((v) => (
          <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {(['sm', 'md', 'lg'] as ButtonSize[]).map((s) => (
          <Button key={s} variant="primary" size={s}>Size {s}</Button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {(['primary', 'secondary', 'ghost', 'danger'] as ButtonVariant[]).map((v) => (
          <Button key={v} variant={v} disabled>{v} disabled</Button>
        ))}
      </div>
    </div>
  ),
};
