import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/components/features/shared/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'NoHotfix Go/No-Go — the release decision, made once and locked.';

export default function Image(): ReturnType<typeof renderOgCard> {
  return renderOgCard('Go/No-Go gate', 'The release decision, made once and locked.');
}
