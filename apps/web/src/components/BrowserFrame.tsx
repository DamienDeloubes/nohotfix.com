import type { ReactNode } from 'react';

/*
 * Reusable browser-chrome frame (traffic lights + mono URL bar). Hosts a video,
 * a screenshot, or a scripted product demo. Theme-aware via brand tokens.
 */
export function BrowserFrame({
  url,
  children,
  className = '',
}: {
  url: string;
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-[20px] bg-[var(--bg-card)]
        border border-[var(--border-default)] shadow-[var(--shadow-card)] ${className}`}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-[var(--border-default)] bg-[var(--bg-section-alt)] px-4 py-3">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
          <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="max-w-full truncate rounded-full bg-[var(--border-default)] px-4 py-1 font-mono text-[12px] text-[var(--text-muted)]">
            {url}
          </div>
        </div>
        <div className="w-[52px]" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}
