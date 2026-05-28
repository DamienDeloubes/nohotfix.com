import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';

function cspPlugin(): PluginOption {
  const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:3001';
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self' ${apiUrl}`,
    "img-src 'self' data:",
    "font-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  return {
    name: 'csp-meta-tag',
    transformIndexHtml(html) {
      return html.replace('</head>', `  <meta http-equiv="Content-Security-Policy" content="${csp}">\n  </head>`);
    },
  };
}

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tailwindcss(), cspPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@nohotfix/api-client': path.resolve(__dirname, '../../packages/api-client/src/index.ts'),
      '@nohotfix/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@nohotfix/domain-audit/ui': path.resolve(__dirname, '../../packages/domains/audit/src/ui/index.ts'),
      '@nohotfix/domain-audit': path.resolve(__dirname, '../../packages/domains/audit/src/index.ts'),
      '@nohotfix/domain-authoring/ui': path.resolve(__dirname, '../../packages/domains/authoring/src/ui/index.ts'),
      '@nohotfix/domain-authoring': path.resolve(__dirname, '../../packages/domains/authoring/src/index.ts'),
      '@nohotfix/domain-identity/ui': path.resolve(__dirname, '../../packages/domains/identity/src/ui/index.ts'),
      '@nohotfix/domain-identity': path.resolve(__dirname, '../../packages/domains/identity/src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
