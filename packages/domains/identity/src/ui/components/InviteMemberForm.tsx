import { useState } from 'react';

import { EMAIL_REGEX } from '@releasepilot/shared';

interface InviteMemberFormProps {
  onSubmit: (data: { email: string; role: 'admin' | 'member' }) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export function InviteMemberForm({ onSubmit, isPending, error }: InviteMemberFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    try {
      await onSubmit({ email: email.trim().toLowerCase(), role });
      setEmail('');
      setRole('member');
      setEmailError('');
      setSuccessMessage('Invite sent successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error is handled via the error prop
    }
  };

  const submitDisabled = isPending || !email.trim();

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="border border-[var(--glass-border)] rounded-[var(--radius-md)] p-4 mb-6"
    >
      <div className="text-sm font-semibold text-white mb-3">Invite new member</div>
      <div className="flex gap-3 items-start flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            disabled={isPending}
            className={`w-full bg-[var(--glass-4)] border rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none placeholder:text-white/40 focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)] ${emailError ? 'border-error-500' : 'border-[var(--glass-border)]'}`}
          />
          {emailError && <div className="text-error-500 text-xs mt-1">{emailError}</div>}
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
          disabled={isPending}
          className="appearance-none bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)]"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={submitDisabled}
          className={submitDisabled
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)]'
            : 'bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]'}
        >
          {isPending ? 'Sending...' : 'Send invite'}
        </button>
      </div>
      {error && <div className="text-error-500 text-xs mt-2">{error.message}</div>}
      {successMessage && <div className="text-go-500 text-xs mt-2">{successMessage}</div>}
    </form>
  );
}
