import type { ReactElement } from 'react';

const callout = {
  base: {
    padding: '1rem 1.25rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    lineHeight: 1.7,
    marginBottom: '1.5rem',
  } as const,
  warning: {
    backgroundColor: 'var(--nogo-surface)',
    border: '1px solid var(--nogo-border)',
    color: 'var(--nogo-text)',
  } as const,
  note: {
    backgroundColor: 'var(--bg-section-alt)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
  } as const,
};

export default function EmailPasswordGuidePage(): ReactElement {
  return (
    <main style={{ maxWidth: '40rem', margin: '3rem auto', padding: '0 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Changing your email or password</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        NoHotfix uses WorkOS to handle all authentication. This means that changing your email address or password is not possible directly from the NoHotfix UI.
      </p>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Changing your email address</h2>
        <p style={{ marginBottom: '1rem' }}>
          Changing your email address is not supported directly. Your email is your unique identifier in NoHotfix, so changing it is equivalent to creating a new user. To switch to
          a different email address, follow these steps:
        </p>
        <ol style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
          <li>
            Go to your organisation&apos;s <strong>Settings &gt; Members</strong> page.
          </li>
          <li>Invite a new user with your desired email address.</li>
          <li>Open the invite link from your inbox and complete the signup with the new email.</li>
          <li>Ask an organisation admin to assign the appropriate role to your new account.</li>
          <li>Once confirmed, remove (or ask an admin to remove) the old user from the organisation.</li>
        </ol>
        <div style={{ ...callout.base, ...callout.warning }}>
          <strong>Warning:</strong> If you are the sole owner of an organisation, you must first transfer ownership to another admin before the old account can be removed. An
          organisation must always have at least one owner. If you need help, contact us at{' '}
          <a href="mailto:support@nohotfix.com" style={{ color: 'var(--nogo-text)', textDecoration: 'underline' }}>
            support@nohotfix.com
          </a>
          .
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Changing your password</h2>
        <div style={{ ...callout.base, ...callout.warning }}>
          <strong>Warning:</strong> Changing your password is only available if you signed up with an email and password. If you signed up using a social login provider (e.g.
          Google or GitHub), you do not have a NoHotfix password — your authentication is managed entirely by that provider.
        </div>
        <p style={{ marginBottom: '1rem' }}>If you signed up with an email and password, follow these steps to reset it:</p>
        <ol style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
          <li>Log out of your current session.</li>
          <li>Go to the NoHotfix login page.</li>
          <li>
            Enter your email address and click <strong>Log in</strong>.
          </li>
          <li>
            Click the <strong>Forgot password?</strong> link.
          </li>
          <li>Follow the instructions in the password reset email.</li>
        </ol>
        <div style={{ ...callout.base, ...callout.note }}>
          <strong>Note:</strong> If you originally signed up via Google or GitHub, the password reset email will not arrive since no password exists for your account. If you are
          locked out, contact us at{' '}
          <a href="mailto:support@nohotfix.com" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>
            support@nohotfix.com
          </a>{' '}
          for assistance.
        </div>
      </section>
    </main>
  );
}
