import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$orgSlug/runs/')({
  component: RunsPage,
});

function RunsPage() {
  return <div>Placeholder — Active Runs</div>;
}
