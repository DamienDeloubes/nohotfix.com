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
    <footer className="border-t border-[rgba(0,0,0,0.06)] bg-white">
      <div className="max-w-[1100px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1.25" y1="3" x2="18.75" y2="3" stroke="#0036FF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="1.25" y1="9" x2="13" y2="9" stroke="#0036FF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="1.25" y1="15" x2="8" y2="15" stroke="#0036FF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-[15px] tracking-[0.01em]">
                <span className="text-slate-900 font-normal">Release</span>
                <span className="text-slate-900 font-bold">Pilot</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">Release with proof.</p>
            <p className="text-xs text-slate-300">&copy; 2026 NoHotfix. All rights reserved.</p>
            <div className="flex gap-4 mt-3">
              <a href="/privacy" className="text-xs text-slate-400 no-underline hover:text-slate-700 hover:underline transition-colors duration-150">
                Privacy Policy
              </a>
              <a href="/terms" className="text-xs text-slate-400 no-underline hover:text-slate-700 hover:underline transition-colors duration-150">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-slate-700 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-slate-400 no-underline hover:text-slate-700 hover:underline transition-colors duration-150">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA mini section (desktop only) */}
        <div className="hidden lg:flex items-center justify-between mt-12 pt-8 border-t border-[rgba(0,0,0,0.06)]">
          <div>
            <span className="text-sm font-medium text-slate-700">Get started today</span>
            <p className="text-xs text-slate-400 mt-1">No credit card required.</p>
          </div>
          <a
            href={`${API_URL}/auth/login?screen_hint=sign-up`}
            className="inline-flex items-center px-5 py-2.5 bg-blue-500 text-white text-sm font-medium
              rounded-md no-underline shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]
              hover:bg-blue-400 transition-all duration-150"
          >
            Start free
          </a>
        </div>
      </div>
    </footer>
  );
}
