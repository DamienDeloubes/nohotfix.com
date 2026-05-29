import { GridFrame } from './GridFrame';
import { NoHotfixLogo } from './NoHotfixLogo';
import { PixelBackdrop } from './PixelBackdrop';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Artifact Enforcement', href: '/features/artifact-enforcement' },
    { label: 'Go/No-Go Gate', href: '/features/go-no-go' },
    { label: 'Audit Trail', href: '/features/audit-trail' },
    { label: 'Platform', href: '/platform' },
  ],
  'Use Cases': [
    { label: 'For QA Teams', href: '/use-cases/qa-teams' },
    { label: 'For Compliance Teams', href: '/use-cases/compliance' },
    { label: 'For Engineering Managers', href: '/use-cases/engineering-managers' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

const socials = [
  { label: 'X', href: 'https://x.com/nohotfix', icon: XIcon },
  { label: 'GitHub', href: 'https://github.com/nohotfix', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nohotfix', icon: LinkedInIcon },
];

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Security', href: '/security' },
];

export function Footer(): React.ReactElement {
  return (
    // overflow-hidden clips the oversized wordmark that bleeds off the bottom edge.
    <footer className="relative overflow-hidden border-t border-[var(--border-default)] bg-[var(--bg-page)]">
      <div className="max-w-[1100px] mx-auto px-6 pt-16 sm:pt-20 pb-10">
        {/* Framed link grid — GridFrame draws the fading guide-lines + corner
            markers; the inner gap-px over bg-gridline draws crisp hairline
            dividers between columns (each cell sits on bg-page so the gap reads
            as a 1px line). */}
        <GridFrame className="grid grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)] gap-px bg-gridline">
          {/* Brand cell — PixelBlast backdrop (same animation as the hero) behind
              the logo + socials; overflow-hidden clips it to the cell, content at z-10. */}
          <div className="relative overflow-hidden col-span-2 lg:col-span-1 bg-[var(--bg-page)] flex flex-col">
            <PixelBackdrop />
            {/* pointer-events-none lets clicks on empty areas reach the canvas
                behind (ripple); interactive children re-enable pointer-events. */}
            <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-8 pointer-events-none">
              <div className="mb-4">
                {/* Theme-aware via CSS (darkMode: 'class') — no JS, no flash. */}
                <span className="inline-block dark:hidden">
                  <NoHotfixLogo variant="light" height={22} id="footer-light" />
                </span>
                <span className="hidden dark:inline-block">
                  <NoHotfixLogo variant="dark" height={22} id="footer-dark" />
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] max-w-[26ch]">The release gate that holds. Ship it once.</p>

              {/* Social row */}
              <div className="mt-auto flex items-center gap-2 pt-8">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-default)]
                      bg-[var(--bg-page)] text-[var(--text-muted)] no-underline transition-colors duration-150
                      hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="bg-[var(--bg-page)] p-6 sm:p-8">
              <h4 className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-[var(--text-secondary)] no-underline transition-colors duration-150 hover:text-[var(--text-primary)]">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </GridFrame>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)] order-2 sm:order-1">&copy; 2026 NoHotfix. All rights reserved.</p>
          <div className="flex items-center gap-6 order-1 sm:order-2">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-xs text-[var(--text-muted)] no-underline transition-colors duration-150 hover:text-[var(--text-primary)]">
                {link.label}
              </a>
            ))}
            <a
              href={`${API_URL}/auth/login?screen_hint=sign-up`}
              className="inline-flex items-center px-4 py-2 text-white text-xs font-medium
                rounded-md no-underline shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]
                transition-colors duration-150"
              style={{ background: 'var(--color-primary)' }}
            >
              Start free
            </a>
          </div>
        </div>
      </div>

      {/* Oversized wordmark — the signature Scalora footer finale. Full-bleed and
          translated down so its lower third clips past the footer's bottom edge.
          Decorative only (aria-hidden); low opacity so it reads as a watermark,
          not a second logo. */}
      <div className="pointer-events-none select-none -mt-4 sm:-mt-8 -mb-[6%] px-6 opacity-[0.03] dark:opacity-[0.09]" aria-hidden="true">
        <span className="block dark:hidden">
          <NoHotfixLogo variant="light" height={200} className="h-auto w-full" id="footer-watermark-light" />
        </span>
        <span className="hidden dark:block">
          <NoHotfixLogo variant="dark" height={200} className="h-auto w-full" id="footer-watermark-dark" />
        </span>
      </div>
    </footer>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
