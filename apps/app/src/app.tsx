import { ApiClient, ApiClientProvider } from '@nohotfix/api-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';

import { ThemeProvider } from './components/ui/ThemeProvider.js';
import { ToastProvider } from './components/ui/Toast.js';
import { API_URL } from './config.js';
import { tokenManager } from './lib/session.js';
import { router } from './router.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const apiClient = new ApiClient({ baseUrl: API_URL, tokenManager });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={apiClient}>
        <ThemeProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ThemeProvider>
      </ApiClientProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
