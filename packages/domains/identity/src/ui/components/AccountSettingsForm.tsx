import { useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role?: string | null | undefined;
}

interface AccountSettingsFormProps {
  user: UserProfile | undefined;
  isLoading: boolean;
  error: Error | null;
  onSave?: (data: { firstName: string; lastName: string }) => Promise<void>;
  isSaving?: boolean;
  saveError?: Error | null;
  guideUrl?: string;
}

export function AccountSettingsForm({ user, isLoading, error, onSave, isSaving, saveError, guideUrl }: AccountSettingsFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [initialised, setInitialised] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (user && !initialised) {
    setFirstName(user.firstName ?? '');
    setLastName(user.lastName ?? '');
    setInitialised(true);
  }

  const firstNameTrimmed = firstName.trim();
  const lastNameTrimmed = lastName.trim();
  const firstNameValid = firstNameTrimmed.length >= 1 && firstNameTrimmed.length <= 50;
  const lastNameValid = lastNameTrimmed.length >= 1 && lastNameTrimmed.length <= 50;

  const hasChanges = user ? firstNameTrimmed !== (user.firstName ?? '') || lastNameTrimmed !== (user.lastName ?? '') : false;

  const canSave = firstNameValid && lastNameValid && hasChanges && !isSaving;

  const handleSave = async () => {
    if (!onSave || !canSave) return;
    setSuccessMessage('');
    try {
      await onSave({ firstName: firstNameTrimmed, lastName: lastNameTrimmed });
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error surfaced via saveError prop
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-sm text-white/40">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm text-error-500">Failed to load profile: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-white/60 mb-1">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={50}
          className="w-full bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none placeholder:text-white/40 focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)]"
        />
        {!firstNameValid && firstName.length > 0 && (
          <p className="text-error-500 text-xs mt-1">First name must be between 1 and 50 characters.</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-white/60 mb-1">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          maxLength={50}
          className="w-full bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none placeholder:text-white/40 focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)]"
        />
        {!lastNameValid && lastName.length > 0 && (
          <p className="text-error-500 text-xs mt-1">Last name must be between 1 and 50 characters.</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-white/60 mb-1">Email</label>
        <p className="py-2 text-sm text-white/40">{user.email}</p>
      </div>

      {user.role && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-white/60 mb-1">Role</label>
          <p className="py-2 text-sm text-white/40">{user.role}</p>
        </div>
      )}

      <div className="mb-8">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={!canSave}
          className={canSave
            ? 'bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)]'}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {successMessage && <p className="text-go-500 text-xs mt-2">{successMessage}</p>}
      {saveError && <p className="text-error-500 text-xs mt-2">Failed to update profile: {saveError.message}</p>}

      {guideUrl && (
        <div className="mt-8 pt-6 border-t border-[var(--glass-border)]">
          <h2 className="text-xl font-semibold text-white mb-2">Email & Password</h2>
          <p className="text-sm text-white/40 mb-4">Learn how to update your email address or password.</p>
          <a
            href={guideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 hover:text-white hover:bg-[var(--glass-12)] text-sm px-4 py-2 rounded-[var(--radius-sm)] no-underline transition-colors [transition-duration:var(--duration-fast)]"
          >
            View guide
          </a>
        </div>
      )}
    </div>
  );
}
