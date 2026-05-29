'use client';

import { useEffect, useState } from 'react';

import { DesktopNav } from './nav/DesktopNav';
import { guarantees, platformItems } from './nav/nav-content';
import { NoHotfixLogo } from './NoHotfixLogo';
import { ThemeToggle } from './ThemeToggle';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

export function Navigation(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Track dark mode for logo variant selection
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Sync dark state with the <html> class (set by pre-paint script)
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[300ms] ease-premium ${scrolled ? 'glass-nav' : 'bg-transparent border-b border-transparent'}`}>
      {/* Inset to match the framed hero. Horizontal: section gutter (p-3/sm:p-4 =
          12/16px) + panel padding (px-6 = 24px) = 36/40px, so the logo and CTA align
          with the hero's content edge. Vertical: pt-3/sm:pt-4 (12/16px) mirrors the
          hero's top gutter, so the nav content lines up with the panel's top edge. */}
      {/* Mobile: simple flex row. lg+: three-column grid with symmetric 1fr
          side columns so the center link group sits at true screen center,
          independent of the logo/right-action widths. */}
      <div className="px-9 sm:px-10 pt-3 pb-3 sm:pt-8 sm:pb-8 flex items-center justify-between
        lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-3">
        {/* Logo — adapts to theme */}
        <a href="/" className="flex items-center no-underline">
          <NoHotfixLogo variant={isDark ? 'dark' : 'light'} height={24} id="nav" />
        </a>

        {/* Desktop nav — center column. Radix mega-menu (Features/Platform open
            panels; the rest are plain links). */}
        <DesktopNav className="hidden lg:block justify-self-center" />

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-4 lg:justify-self-end">
          <ThemeToggle />
          <a
            href={`${API_URL}/auth/login?screen_hint=sign-in`}
            className="hidden sm:inline text-sm font-medium transition-colors duration-150 no-underline
              text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Log in
          </a>
          <a
            href={`${API_URL}/auth/login?screen_hint=sign-up`}
            className="inline-flex items-center px-5 py-2 text-white text-sm font-medium rounded-md no-underline
              shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]
              transition-all duration-150"
            style={{
              background: 'var(--color-primary)',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-primary-hover)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-primary)')}
          >
            Start free
          </a>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
            <span className="block w-5 h-0.5 bg-[var(--text-primary)]" />
            <span className="block w-5 h-0.5 bg-[var(--text-primary)]" />
            <span className="block w-5 h-0.5 bg-[var(--text-primary)]" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-[var(--border-default)] px-9 sm:px-10 py-6 flex flex-col gap-4
            backdrop-blur-xl"
          style={{ background: 'var(--nav-bg)' }}
        >
          <a
            href="/how-it-works"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-base no-underline transition-colors duration-150"
          >
            How It Works
          </a>

          {/* Features group — sourced from the same nav-content as the desktop panel */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">Features</span>
            {guarantees.map((g) => (
              <a
                key={g.link.href}
                href={g.link.href}
                className="pl-3 text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors duration-150"
              >
                {g.eyebrow}
              </a>
            ))}
          </div>

          {/* Platform group */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">Platform</span>
            {platformItems.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="pl-3 text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors duration-150"
              >
                {p.heading}
              </a>
            ))}
          </div>

          <a
            href="/pricing"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-base no-underline transition-colors duration-150"
          >
            Pricing
          </a>
          <a
            href="/changelog"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-base no-underline transition-colors duration-150"
          >
            Changelog
          </a>
          <a
            href={`${API_URL}/auth/login?screen_hint=sign-in`}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-base no-underline transition-colors duration-150"
          >
            Log in
          </a>
        </div>
      )}
    </nav>
  );
}
