import type { OrganisationDto } from '@nohotfix/shared';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { CreateOrganisationForm } from '../../components/identity/CreateOrganisationForm.js';
import { guardOnboarding } from '../../lib/org-guard.js';

export const Route = createFileRoute('/onboarding/create-org')({
  beforeLoad: guardOnboarding,
  component: CreateOrgPage,
});

function CreateOrgPage() {
  const navigate = useNavigate();

  const handleSuccess = (org: OrganisationDto) => {
    void navigate({ to: '/$orgSlug', params: { orgSlug: org.slug } });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CreateOrganisationForm onSuccess={handleSuccess} />
    </div>
  );
}
