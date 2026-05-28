import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$orgSlug/runs/start')({
  component: StartRunPage,
});

function StartRunPage() {
  return <div>Placeholder — Start Run</div>;
}
