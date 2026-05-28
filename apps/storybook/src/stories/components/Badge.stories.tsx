import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Status Badge primitive — spec from brand-identity.md "Status Badge System"
// All badges: border-radius 9999px, padding 2px 10px, Inter 500 12px
// Light and dark values set via CSS variables (theme-aware).
// ---------------------------------------------------------------------------

type BadgeStatus = 'go' | 'nogo' | 'in-progress' | 'pending' | 'skipped';

interface BadgeProps {
  status: BadgeStatus;
}

const badgeStyles: Record<BadgeStatus, React.CSSProperties> = {
  go: {
    backgroundColor: 'var(--go-surface)',
    color: 'var(--go-text)',
    borderColor: 'var(--go-border)',
  },
  nogo: {
    backgroundColor: 'var(--nogo-surface)',
    color: 'var(--nogo-text)',
    borderColor: 'var(--nogo-border)',
  },
  'in-progress': {
    // Slate: #f1f5f9 bg / #475569 text (light); rgba(100,116,139,0.14) bg / #94a3b8 text (dark)
    // These are not in the semantic token set but match the status badge spec exactly.
    backgroundColor: 'var(--bg-section-alt)',
    color: 'var(--text-secondary)',
    borderColor: 'rgba(100, 116, 139, 0.30)',
  },
  pending: {
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-disabled)',
    borderColor: 'var(--border-default)',
  },
  skipped: {
    backgroundColor: 'var(--bg-section-alt)',
    color: 'var(--text-muted)',
    borderColor: 'var(--border-default)',
  },
};

const badgeLabels: Record<BadgeStatus, string> = {
  go: 'Go',
  nogo: 'No-Go',
  'in-progress': 'In Progress',
  pending: 'Pending',
  skipped: 'Skipped',
};

function Badge({ status }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999, // --radius-full
        padding: '2px 10px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        fontSize: 12,
        lineHeight: 1.5,
        border: '1px solid',
        ...badgeStyles[status],
      }}
    >
      {badgeLabels[status]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta<BadgeProps> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Status badge system. Five states: go (green), nogo (yellow), in-progress (slate — blue is retired), pending, skipped. Toggle theme to see light/dark behavior. All values from the brand-identity.md Status Badge System spec.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['go', 'nogo', 'in-progress', 'pending', 'skipped'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Go: Story = { args: { status: 'go' } };
export const NoGo: Story = { args: { status: 'nogo' } };
export const InProgress: Story = { args: { status: 'in-progress' } };
export const Pending: Story = { args: { status: 'pending' } };
export const Skipped: Story = { args: { status: 'skipped' } };

export const AllStatuses: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {(['go', 'nogo', 'in-progress', 'pending', 'skipped'] as BadgeStatus[]).map((s) => (
        <Badge key={s} status={s} />
      ))}
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 340,
        padding: 20,
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {[
        { label: 'Spec document uploaded', status: 'go' as BadgeStatus },
        { label: 'QA sign-off', status: 'nogo' as BadgeStatus },
        { label: 'Load test results', status: 'in-progress' as BadgeStatus },
        { label: 'Security review', status: 'pending' as BadgeStatus },
        { label: 'Marketing copy review', status: 'skipped' as BadgeStatus },
      ].map(({ label, status }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: 'var(--text-primary)',
            }}
          >
            {label}
          </span>
          <Badge status={status} />
        </div>
      ))}
    </div>
  ),
};
