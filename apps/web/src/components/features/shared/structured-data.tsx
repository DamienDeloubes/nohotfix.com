import type { ReactElement } from 'react';

import { BREADCRUMB_BASE, SITE_ORIGIN } from './constants';

/*
 * structured-data — emits SoftwareApplication + ItemPage + BreadcrumbList
 * JSON-LD for a feature page (contracts/json-ld.md). Rendered as inline
 * <script type="application/ld+json"> in the server page component.
 *
 * Honesty constraints: no aggregateRating/review/testimonial markup (no real
 * proof yet); descriptions market only shipped capability; the Offer reflects
 * the permanent Free tier.
 */
export interface FeaturePageMeta {
  /** URL segment under /features/ */
  slug: 'artifact-enforcement' | 'go-no-go' | 'audit-trail';
  /** The single <h1> pillar headline (ItemPage name). */
  pillarHeadline: string;
  /** Breadcrumb leaf + ItemPage label, e.g. "Artifact Enforcement". */
  pageName: string;
  /** Mechanic-led description for the SoftwareApplication node. */
  description: string;
}

export function FeatureJsonLd({ meta }: { meta: FeaturePageMeta }): ReactElement {
  const url = `${SITE_ORIGIN}/features/${meta.slug}`;
  const ogImage = `${url}/opengraph-image`;

  const softwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NoHotfix',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: meta.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url,
  };

  const itemPage = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: meta.pillarHeadline,
    url,
    isPartOf: { '@type': 'WebSite', name: 'NoHotfix', url: `${SITE_ORIGIN}/` },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImage },
  };

  const breadcrumbs = [...BREADCRUMB_BASE, { name: meta.pageName, url }];
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  return (
    <>
      {[softwareApplication, itemPage, breadcrumbList].map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to inline; no user input is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
