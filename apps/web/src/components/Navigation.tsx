'use client';

import { useEffect, useState } from 'react';
import { NoHotfixLogo } from './NoHotfixLogo';

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[300ms] ease-premium ${
        scrolled ? 'glass-nav' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — adapts to theme */}
        <a href="/" className="flex items-center no-underline">
          <NoHotfixLogo variant={isDark ? 'dark' : 'light'} height={24} id="nav" />
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {['How It Works', 'Features', 'Pricing', 'Changelog'].map((item) => (
            <a
              key={item}
              href={item === 'Pricing' ? '/pricing' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium transition-colors duration-150 no-underline
                text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
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
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-[var(--text-primary)]" />
            <span className="block w-5 h-0.5 bg-[var(--text-primary)]" />
            <span className="block w-5 h-0.5 bg-[var(--text-primary)]" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-[var(--border-default)] px-6 py-6 flex flex-col gap-4
            backdrop-blur-xl"
          style={{ background: 'var(--nav-bg)' }}
        >
          {['How It Works', 'Features', 'Pricing', 'Changelog'].map((item) => (
            <a
              key={item}
              href={item === 'Pricing' ? '/pricing' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-base no-underline transition-colors duration-150"
            >
              {item}
            </a>
          ))}
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
