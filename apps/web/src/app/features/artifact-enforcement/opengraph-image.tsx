import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/components/features/shared/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'NoHotfix Artifact Enforcement — No artifact, no pass.';

export default function Image(): ReturnType<typeof renderOgCard> {
  return renderOgCard('Artifact enforcement', 'No artifact, no pass. Full stop.');
}
