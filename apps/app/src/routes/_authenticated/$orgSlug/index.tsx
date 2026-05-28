import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$orgSlug/')({
  component: DashboardPage,
});

function DashboardPage() {
  return <div>Dashboard</div>;
}
