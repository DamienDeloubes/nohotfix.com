import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$orgSlug/history/')({
  component: HistoryPage,
});

function HistoryPage() {
  return <div>Placeholder — Run History</div>;
}
