import { createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen.js';

export interface AuthContext {
  userId: string | null;
  orgId: string | null;
  role: 'owner' | 'admin' | 'member' | null;
  email: string | null;
  isAuthenticated: boolean;
}

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      userId: null,
      orgId: null,
      role: null,
      email: null,
      isAuthenticated: false,
    } satisfies AuthContext,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
