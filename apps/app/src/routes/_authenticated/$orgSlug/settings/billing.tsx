import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$orgSlug/settings/billing')({
  component: BillingSettingsPage,
});

function BillingSettingsPage() {
  return <div className="text-white/40">Placeholder — Billing Settings</div>;
}
