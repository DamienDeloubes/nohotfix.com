import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/components/features/shared/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'NoHotfix Audit Trail — the record is sealed when the call is made.';

export default function Image(): ReturnType<typeof renderOgCard> {
  return renderOgCard('Immutable record', 'The record is sealed when the call is made.');
}
