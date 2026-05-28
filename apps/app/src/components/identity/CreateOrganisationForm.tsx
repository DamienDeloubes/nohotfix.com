import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckSlug, useCreateOrganisation } from '@nohotfix/domain-identity/ui';
import * as shared from '@nohotfix/shared';
import type { CreateOrganisationRequest, OrganisationDto } from '@nohotfix/shared';
import { useForm } from 'react-hook-form';

import { orgKeys } from '../../api/query-keys.js';

const CreateOrganisationRequestSchema = shared.CreateOrganisationRequestSchema;

interface CreateOrganisationFormProps {
  onSuccess: (org: OrganisationDto) => void;
}

export function CreateOrganisationForm({ onSuccess }: CreateOrganisationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganisationRequest>({
    resolver: zodResolver(CreateOrganisationRequestSchema),
    defaultValues: { name: '', slug: '' },
  });

  const slugValue = watch('slug');

  const { data: slugCheck, isLoading: isCheckingSlug } = useCheckSlug(slugValue ?? '', {
    queryKeyFactory: orgKeys.checkSlug,
  });

  const createOrg = useCreateOrganisation({
    invalidateKeys: [orgKeys.userOrgs()],
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await createOrg.mutateAsync(data);
    onSuccess(result);
  });

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: '0 auto' }}>
      <h2>Create your organisation</h2>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="org-name" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Organisation name
        </label>
        <input id="org-name" type="text" {...register('name')} placeholder="My Company" style={{ width: '100%', padding: 8, boxSizing: 'border-box' }} maxLength={100} />
        {errors.name && <p style={{ color: 'red', margin: '4px 0 0', fontSize: 14 }}>{errors.name.message}</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="org-slug" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          URL slug
        </label>
        <input id="org-slug" type="text" {...register('slug')} placeholder="my-company" style={{ width: '100%', padding: 8, boxSizing: 'border-box' }} maxLength={50} />
        {errors.slug && <p style={{ color: 'red', margin: '4px 0 0', fontSize: 14 }}>{errors.slug.message}</p>}
        {!errors.slug && slugValue && slugValue.length >= 3 && (
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isCheckingSlug ? '#888' : slugCheck?.available ? 'green' : 'red' }}>
            {isCheckingSlug ? 'Checking...' : slugCheck?.available ? 'Available' : 'Already taken'}
          </p>
        )}
      </div>

      {createOrg.error && <p style={{ color: 'red', marginBottom: 12 }}>{createOrg.error.message}</p>}

      <button type="submit" disabled={isSubmitting || (slugCheck !== undefined && !slugCheck.available)} style={{ padding: '10px 24px', cursor: 'pointer' }}>
        {isSubmitting ? 'Creating...' : 'Create organisation'}
      </button>
    </form>
  );
}
