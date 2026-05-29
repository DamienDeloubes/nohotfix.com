# Contract: Structured Data (JSON-LD)

Each feature page emits three JSON-LD blocks as inline `<script type="application/ld+json">` in the
server component. Must validate with zero errors (SC-004).

## 1. `SoftwareApplication`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NoHotfix",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "<page-specific mechanic description>",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://nohotfix.com/features/<slug>"
}
```

> `offers` reflects the permanent Free tier (full enforcement, one seat). Do not invent ratings or
> review counts (no fabricated proof — FR-070).

## 2. `ItemPage`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemPage",
  "name": "<pillar headline>",
  "url": "https://nohotfix.com/features/<slug>",
  "isPartOf": { "@type": "WebSite", "name": "NoHotfix", "url": "https://nohotfix.com" },
  "primaryImageOfPage": { "@type": "ImageObject", "url": "https://nohotfix.com/features/<slug>/opengraph-image" }
}
```

## 3. `BreadcrumbList`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nohotfix.com/" },
    { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://nohotfix.com/features" },
    { "@type": "ListItem", "position": 3, "name": "<page name>", "item": "https://nohotfix.com/features/<slug>" }
  ]
}
```

## Implementation note

A small helper may build these objects from `FeaturePageMeta` to avoid divergence across the three
pages (justified by the ≥3-use rule). Render via
`<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />`
in the server component — standard Next App Router pattern.

## Honesty constraints (apply to all structured data)

- No aggregateRating / review / testimonial markup (no real proof yet).
- No claims of certifications NoHotfix doesn't hold (mirrors the on-page SOC2/PCI-DSS disclaimer).
- Descriptions market only shipped capability; no roadmap items as current features.
