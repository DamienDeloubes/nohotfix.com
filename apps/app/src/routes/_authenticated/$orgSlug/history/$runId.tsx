import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$orgSlug/history/$runId')({
  component: HistoryRunDetailPage,
});

function HistoryRunDetailPage() {
  const { runId } = Route.useParams();
  return <div>Placeholder — History Run Detail {runId}</div>;
}
