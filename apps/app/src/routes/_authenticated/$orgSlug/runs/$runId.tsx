import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$orgSlug/runs/$runId')({
  component: RunDetailPage,
});

function RunDetailPage() {
  const { runId } = Route.useParams();
  return <div>Placeholder — Run {runId}</div>;
}
