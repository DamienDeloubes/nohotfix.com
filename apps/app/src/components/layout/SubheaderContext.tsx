import { createContext, useContext, useState, type ReactNode } from 'react';

interface SubheaderConfig {
  title: string;
  description?: string;
  icon?: object;
  actions?: ReactNode;
}

interface SubheaderContextValue {
  subheader: SubheaderConfig | null;
  setSubheader: (config: SubheaderConfig | null) => void;
}

const SubheaderContext = createContext<SubheaderContextValue | null>(null);

export function SubheaderProvider({ children }: { children: ReactNode }) {
  const [subheader, setSubheader] = useState<SubheaderConfig | null>(null);
  return <SubheaderContext.Provider value={{ subheader, setSubheader }}>{children}</SubheaderContext.Provider>;
}

export function useSubheader() {
  const ctx = useContext(SubheaderContext);
  if (!ctx) throw new Error('useSubheader must be used within SubheaderProvider');
  return ctx;
}
