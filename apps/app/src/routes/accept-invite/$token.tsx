import { useApiClient } from '@nohotfix/api-client';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/accept-invite/$token')({
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function accept() {
      try {
        const data = await apiClient.post<{ orgSlug: string }>(`/api/invites/${encodeURIComponent(token)}/accept`);
        if (!cancelled) {
          void navigate({ to: '/$orgSlug', params: { orgSlug: data.orgSlug }, replace: true });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
      }
    }

    void accept();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, apiClient]);

  if (error) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Could not accept invite</h1>
          <p style={{ color: '#6b7280' }}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6b7280' }}>Accepting invite...</p>
      </div>
    </main>
  );
}
