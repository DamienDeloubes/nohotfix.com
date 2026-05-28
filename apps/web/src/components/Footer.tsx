import { NoHotfixLogo } from './NoHotfixLogo';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com';

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Artifact Enforcement', href: '/features/artifact-enforcement' },
    { label: 'Go/No-Go Gate', href: '/features/go-no-go' },
    { label: 'Audit Trail', href: '/features/audit-trail' },
  ],
  'Use Cases': [
    { label: 'For QA Teams', href: '/use-cases/qa-teams' },
    { label: 'For Compliance Teams', href: '/use-cases/compliance' },
    { label: 'For Engineering Managers', href: '/use-cases/engineering-managers' },
  ],
  Resources: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Blog', href: '/blog' },
    { label: 'Documentation', href: '/docs' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-page-shell)]">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              {/* Theme-aware via CSS (darkMode: 'class') — no JS, no flash. */}
              <span className="inline-block dark:hidden">
                <NoHotfixLogo variant="light" height={20} id="footer-light" />
              </span>
              <span className="hidden dark:inline-block">
                <NoHotfixLogo variant="dark" height={20} id="footer-dark" />
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">Ship it once.</p>
            <p className="text-xs text-[var(--text-muted)]">&copy; 2026 NoHotfix. All rights reserved.</p>
            <div className="flex gap-4 mt-3">
              <a
                href="/privacy"
                className="text-xs text-[var(--text-muted)] no-underline hover:text-[var(--text-primary)] hover:underline transition-colors duration-150"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-xs text-[var(--text-muted)] no-underline hover:text-[var(--text-primary)] hover:underline transition-colors duration-150"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] no-underline hover:text-[var(--text-primary)] hover:underline transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA mini section (desktop only) */}
        <div className="hidden lg:flex items-center justify-between mt-12 pt-8 border-t border-[var(--border-default)]">
          <div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">Get started today</span>
            <p className="text-xs text-[var(--text-muted)] mt-1">No credit card required.</p>
          </div>
          <a
            href={`${API_URL}/auth/login?screen_hint=sign-up`}
            className="inline-flex items-center px-5 py-2.5 text-white text-sm font-medium
              rounded-md no-underline shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]
              transition-all duration-150"
            style={{ background: 'var(--color-primary)' }}
          >
            Start free
          </a>
        </div>
      </div>
    </footer>
  );
}
