import { type ReactNode } from 'react';

import { Header } from './Header.js';
import { Subheader } from './Subheader.js';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen layout bg-[var(--bg-page)]">
      <Header />
      <Subheader />

      {children}
    </div>
  );
}
