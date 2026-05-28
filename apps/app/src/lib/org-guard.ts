import { ApiClient } from '@nohotfix/api-client';
import { redirect } from '@tanstack/react-router';

import { API_URL } from '../config.js';
import { tokenManager } from './session.js';

const apiClient = new ApiClient({ baseUrl: API_URL, tokenManager });

interface UserOrg {
  slug: string;
}

/**
 * Route guard for the authenticated index route (`/`).
 * Redirects to onboarding if the user has no orgs,
 * or to the first org's dashboard if they do.
 */
export async function guardAuthenticatedIndex(): Promise<void> {
  let orgs: UserOrg[];
  try {
    orgs = await apiClient.get<UserOrg[]>('/api/users/me/orgs');
  } catch {
    return;
  }

  if (orgs.length === 0) {
    throw redirect({ to: '/onboarding/create-org' });
  }

  throw redirect({ to: '/$orgSlug', params: { orgSlug: orgs[0]!.slug } });
}

/**
 * Route guard for the onboarding page.
 * Redirects to the first org's dashboard if the user already has orgs.
 */
export async function guardOnboarding(): Promise<void> {
  let orgs: UserOrg[];
  try {
    orgs = await apiClient.get<UserOrg[]>('/api/users/me/orgs');
  } catch {
    return;
  }

  if (orgs.length > 0) {
    throw redirect({ to: '/$orgSlug', params: { orgSlug: orgs[0]!.slug } });
  }
}
