import type { Metadata } from 'next';
import { DM_Sans, Inter, Geist_Mono } from 'next/font/google';

import { SmoothScroll } from '@/components/SmoothScroll';

import '@nohotfix/design-tokens/tokens.css';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoHotfix — The release gate that holds.',
  description:
    'Specs don’t pass until the evidence does. The go/no-go call is permanent. The record writes itself. Start free — full enforcement on every plan.',
  openGraph: {
    title: 'NoHotfix — The release gate that holds.',
    description:
      'The release gate that enforces evidence, gates the go/no-go decision, and seals the record. Built for QA and engineering teams.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} ${geistMono.variable}`}>
      <head>
        {/*
         * Pre-paint theme script — sets/removes `dark` class before first paint
         * to eliminate FOUC. Reads localStorage `theme-preference`, falls back
         * to OS prefers-color-scheme. Light = no class (light-first).
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var stored = localStorage.getItem('theme-preference');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (stored !== 'light' && prefersDark);
    if (dark) document.documentElement.classList.add('dark');

    // Runtime listener: auto-switch on OS change (only when no manual override)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      var override = localStorage.getItem('theme-preference');
      if (!override) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  } catch(e) {}
})();`,
          }}
        />
      </head>
      <body className="font-body antialiased bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
