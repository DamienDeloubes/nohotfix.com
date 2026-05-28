import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoHotfix — Release with proof.',
  description: 'Release readiness, enforced. Artifact-gated specs, formal go/no-go decisions, and immutable run records. Start free.',
  openGraph: {
    title: 'NoHotfix — Release with proof.',
    description: 'Artifact-gated specs, formal go/no-go decisions, and immutable run records for engineering teams.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Aeonik Pro — replace with your licensed font files */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-display: 'Inter', -apple-system, sans-serif;
                --font-geist-mono: 'Courier New', monospace;
              }
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
