import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `connect-src 'self'${isDev ? ' ws://localhost:* http://localhost:*' : ''}`,
  "img-src 'self' data:",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  transpilePackages: ['@nohotfix/shared'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
