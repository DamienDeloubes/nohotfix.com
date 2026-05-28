import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import type { AuthContext } from '../router.js';

export interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}
