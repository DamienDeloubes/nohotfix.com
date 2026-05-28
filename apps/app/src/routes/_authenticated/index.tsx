import { createFileRoute } from '@tanstack/react-router';

import { guardAuthenticatedIndex } from '../../lib/org-guard.js';

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: guardAuthenticatedIndex,
  component: () => null,
});
