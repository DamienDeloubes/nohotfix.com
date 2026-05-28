import { createContext, useContext } from 'react';

export interface OrgContextValue {
  orgId: string;
  orgSlug: string;
  orgName: string;
  role: string;
}

export const OrgContext = createContext<OrgContextValue | null>(null);

export function useOrgContext(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) {
    throw new Error('useOrgContext must be used within an OrgContext.Provider');
  }
  return ctx;
}
