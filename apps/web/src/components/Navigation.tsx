'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.io';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[450ms] ease-premium ${
        scrolled ? 'bg-[rgba(13,9,32,0.80)] border-b border-[rgba(255,255,255,0.08)] backdrop-blur-[16px] backdrop-saturate-[180%]' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <LogoMark />
          <span className="text-[15px] tracking-[0.01em]">
            <span className="font-normal text-white">Release</span>
            <span className="font-bold text-white">Pilot</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {['How It Works', 'Features', 'Pricing', 'Changelog'].map((item) => (
            <a
              key={item}
              href={item === 'Pricing' ? '/pricing' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium transition-opacity duration-150 no-underline text-[rgba(255,255,255,0.70)] hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <a
            href={`${API_URL}/auth/login?screen_hint=sign-in`}
            className="hidden sm:inline text-sm font-medium transition-opacity duration-150 no-underline text-[rgba(255,255,255,0.70)] hover:text-white"
          >
            Log in
          </a>
          <a
            href={`${API_URL}/auth/login?screen_hint=sign-up`}
            className="inline-flex items-center px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-md no-underline
              shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] hover:bg-blue-400
              hover:shadow-[0_1px_0_rgba(255,255,255,0.24)_inset] transition-all duration-150"
          >
            Start free
          </a>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
            <span className="block w-5 h-0.5 bg-white" />
            <span className="block w-5 h-0.5 bg-white" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-base-900/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.08)] px-6 py-6 flex flex-col gap-4">
          {['How It Works', 'Features', 'Pricing', 'Changelog'].map((item) => (
            <a
              key={item}
              href={item === 'Pricing' ? '/pricing' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[rgba(255,255,255,0.70)] hover:text-white text-base no-underline"
            >
              {item}
            </a>
          ))}
          <a href={`${API_URL}/auth/login?screen_hint=sign-in`} className="text-[rgba(255,255,255,0.70)] hover:text-white text-base no-underline">
            Log in
          </a>
        </div>
      )}
    </nav>
  );
}

function LogoMark() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="1.25" y1="3" x2="18.75" y2="3" stroke="#0036FF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="1.25" y1="9" x2="13" y2="9" stroke="#0036FF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="1.25" y1="15" x2="8" y2="15" stroke="#0036FF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
