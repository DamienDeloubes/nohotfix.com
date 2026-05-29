# Contract: Routes & Page Metadata

The "external interface" of this feature is a set of **public web routes** and their SEO metadata.
No HTTP API. Each route is a Next.js App Router `page.tsx` server component.

## Routes

| Route | File | `<h1>` (pillar headline) | Conversion goal |
|---|---|---|---|
| `/features/artifact-enforcement` | `app/features/artifact-enforcement/page.tsx` | "No artifact, no pass. Full stop." | Start free |
| `/features/go-no-go` | `app/features/go-no-go/page.tsx` | "The release decision, made once and locked." | Start free |
| `/features/audit-trail` | `app/features/audit-trail/page.tsx` | "The record is sealed when the call is made." | Talk to us (primary) / Start free (secondary) |

All three previously returned 404; after this feature they return 200 and are linked from the footer
and the Features mega-menu.

## Per-route metadata (export const metadata)

Each page exports a unique `Metadata` object (distinct title/description per intent cluster — no
duplicate content):

```ts
export const metadata: Metadata = {
  title: '…',                 // unique per page
  description: '…',           // unique per page, mechanic-led copy
  alternates: { canonical: 'https://nohotfix.com/features/<slug>' },
  openGraph: {
    title: '…', description: '…', type: 'website',
    url: 'https://nohotfix.com/features/<slug>',
    // OG image (1200×630) is auto-wired by Next from the sibling
    // `opengraph-image.tsx` route (ImageResponse). No manual `images` array.
    // (Static-PNG fallback: images: [{ url: '/og/features-<slug>.png', width: 1200, height: 630 }])
  },
};
```

### Intent clusters (for title/description)
- **artifact-enforcement**: "artifact-gated testing", "require screenshot before passing a test", "enforce evidence in QA workflow", "blocked pass action".
- **go-no-go**: "go no-go decision software", "release approval workflow", "Admin-only release decision".
- **audit-trail**: "immutable audit trail release testing", "release evidence for SOC2 audit", "tamper-evident release record".

## Semantic structure contract (all routes)

- Exactly one `<h1>`; section headings `<h2>`; subpoints `<h3>`; no skipped levels.
- `<main>` wraps content below `<Navigation />`; every content band is a `<section aria-labelledby="…">`.
- `<Navigation />` first, `<Footer />` last (reused, unchanged except active-state prop).

## Section order contract

**Artifact Enforcement** (6): Hero → Six artifact types (bento) → How enforcement works → What gets locked → Adoption/credibility → Final CTA (Start free / See how it works).
**Go/No-Go** (6): Hero → What the decision screen shows → Role gating → Justification requirement → After the decision → Final CTA (Start free / Talk to us).
**Audit Trail** (6): Hero → What the record contains → Three-layer immutability → Print-to-PDF → Compliance context → Final CTA (Talk to us / Start free).

## Internal-link contract (must be present, distributed in-content)

| Page | Must link to |
|---|---|
| artifact-enforcement | `/features/go-no-go`, `/features/audit-trail`, `/how-it-works`, `/pricing`, `/use-cases/qa-teams` |
| go-no-go | `/features/artifact-enforcement`, `/features/audit-trail`, `/how-it-works`, `/pricing`, `/use-cases/engineering-managers` |
| audit-trail | `/features/artifact-enforcement`, `/features/go-no-go`, `/how-it-works`, `/pricing`, `/use-cases/compliance`, `/contact`, `/platform` |

Signup CTA href: `${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nohotfix.com'}/auth/login?screen_hint=sign-up` (matches `FinalCTA.tsx`).
"Talk to us" href: `/contact`.

> Some destinations 404 today (e.g. `/how-it-works`, `/contact`, `/use-cases/*`, `/platform`). Links
> still render with correct hrefs and resolve when those routes ship (out of scope here).
