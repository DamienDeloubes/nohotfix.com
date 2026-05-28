import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Local Input primitive — token-driven, four states
// ---------------------------------------------------------------------------

type InputState = 'default' | 'focus' | 'error' | 'disabled';

interface InputProps {
  state?: InputState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({
  state = 'default',
  label,
  placeholder = 'Enter value',
  helperText,
  errorText,
  value,
  onChange,
}: InputProps) {
  const [internalFocused, setFocused] = React.useState(false);
  const isFocused = state === 'focus' || internalFocused;
  const isError = state === 'error';
  const isDisabled = state === 'disabled';

  const borderColor = isError
    ? 'var(--error-border)'
    : isFocused
      ? 'var(--border-focus)'
      : 'var(--border-default)';

  const focusRingColor = isError ? 'var(--color-error-500)' : 'var(--border-focus)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <label
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: isDisabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
          }}
        >
          {label}
        </label>
      )}
      <input
        disabled={isDisabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: isDisabled ? 'var(--text-disabled)' : 'var(--text-primary)',
          backgroundColor: isDisabled ? 'var(--bg-section-alt)' : 'var(--bg-input)',
          border: `1px solid ${borderColor}`,
          borderRadius: 10, // --radius-md
          padding: '9px 12px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: isFocused ? `0 0 0 3px ${focusRingColor}33` : 'none',
          transition: 'border-color 150ms, box-shadow 150ms',
          cursor: isDisabled ? 'not-allowed' : 'text',
        }}
      />
      {isError && errorText && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: 'var(--error-text)',
            margin: 0,
          }}
        >
          {errorText}
        </p>
      )}
      {!isError && helperText && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta<InputProps> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text input with four states: default, focus (orange focus ring), error (crimson border + ring), disabled. Focus ring color matches --border-focus which maps to --color-primary per theme.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'focus', 'error', 'disabled'],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: 'default',
    label: 'Spec title',
    placeholder: 'Enter spec title',
    helperText: 'Will appear in the artifact requirement list.',
  },
};

export const Focus: Story = {
  args: {
    state: 'focus',
    label: 'Spec title',
    placeholder: 'Enter spec title',
    helperText: 'Orange focus ring from --border-focus.',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    label: 'Spec title',
    placeholder: 'Enter spec title',
    errorText: 'Title is required before the gate can pass.',
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
    label: 'Spec title',
    placeholder: 'Enter spec title',
    helperText: 'Locked after gate decision.',
    value: 'Q4 Release — Production',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
      <Input state="default" label="Default" placeholder="Type here" helperText="Helper text" />
      <Input state="focus" label="Focus" placeholder="Active input" helperText="Orange ring" />
      <Input
        state="error"
        label="Error"
        placeholder="Invalid value"
        errorText="This field is required."
      />
      <Input
        state="disabled"
        label="Disabled"
        value="Locked value"
        helperText="Cannot be edited."
      />
    </div>
  ),
};
