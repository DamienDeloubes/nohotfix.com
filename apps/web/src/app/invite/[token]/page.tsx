import type { ReactElement } from 'react';

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.nohotfix.com';

interface ValidateResponse {
  status: 'valid' | 'expired' | 'revoked' | 'accepted' | 'not_found';
  email?: string;
  orgSlug?: string;
  orgName?: string;
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<ReactElement> {
  const { token } = await params;

  let result: ValidateResponse;
  try {
    const res = await fetch(`${API_URL}/api/invites/${encodeURIComponent(token)}/validate`, { cache: 'no-store' });
    result = (await res.json()) as ValidateResponse;
  } catch {
    result = { status: 'not_found' };
  }

  // Valid invite — redirect to auth with login_hint and invite state
  if (result.status === 'valid' && result.email) {
    const authUrl = new URL(`${API_URL}/auth/login`);
    authUrl.searchParams.set('screen_hint', 'sign-up');
    authUrl.searchParams.set('login_hint', result.email);
    authUrl.searchParams.set('state', `invite:${token}`);
    redirect(authUrl.toString());
  }

  // Already accepted — redirect to org dashboard
  if (result.status === 'accepted' && result.orgSlug) {
    redirect(`${APP_URL}/${result.orgSlug}`);
  }

  // Error states
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
        {result.status === 'expired' && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Invite expired</h1>
            <p style={{ color: '#6b7280' }}>This invite link has expired. Please contact your organisation admin to request a new invitation.</p>
          </>
        )}
        {(result.status === 'revoked' || result.status === 'not_found') && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Invite no longer valid</h1>
            <p style={{ color: '#6b7280' }}>This invite link is no longer valid. It may have been revoked or the link is incorrect.</p>
          </>
        )}
        <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--text-link)', textDecoration: 'underline' }}>
          Go to NoHotfix
        </a>
      </div>
    </main>
  );
}
