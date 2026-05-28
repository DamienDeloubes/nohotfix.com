import { useEffect, useRef } from 'react';

import { LordiconIcon, type LordiconIconHandle } from '../ui/LordiconIcon.js';
import { useTheme } from '../ui/ThemeProvider.js';
import { useSubheader } from './SubheaderContext.js';

export function Subheader() {
  const { subheader } = useSubheader();
  const iconRef = useRef<LordiconIconHandle>(null);
  const { resolvedTheme } = useTheme();
  const iconColor = resolvedTheme === 'dark' ? '#ffffff' : '#0f172a';

  useEffect(() => {
    if (!subheader?.icon) return;
    // Small delay to ensure the Player is mounted before playing
    const timer = setTimeout(() => iconRef.current?.play(), 100);
    return () => clearTimeout(timer);
  }, [subheader?.icon]);

  if (!subheader) return null;

  return (
    <div className="layout-area-subheader subheader">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {subheader.icon && (
              <div className="mt-0.5">
                <LordiconIcon ref={iconRef} icon={subheader.icon} size={24} colors={iconColor} />
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold">{subheader.title}</h1>
              {subheader.description && <p className="mt-1 text-sm text-slate-700">{subheader.description}</p>}
            </div>
          </div>
          {subheader.actions && <div className="flex items-center gap-3">{subheader.actions}</div>}
        </div>
      </div>
    </div>
  );
}
