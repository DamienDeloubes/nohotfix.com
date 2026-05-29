# Phase 1 Data Model: Feature Marketing Pages

**There is no database, no persistence, and no API in this feature.** The "entities" are
client-side content/prop **data shapes** (TypeScript interfaces) for the static pages and their
product-UI fragments. These are illustrative props contracts — final names/fields may be refined in
implementation — used to keep the three pages consistent and the fragments faithful.

No Kysely tables, no migrations, no `org_id`, no domain entities.

---

## Page-level content shapes

### `FeaturePageMeta`
Drives the per-route `metadata` export and JSON-LD.

| Field | Type | Notes |
|---|---|---|
| `slug` | `'artifact-enforcement' \| 'go-no-go' \| 'audit-trail'` | URL segment under `/features/` |
| `title` | `string` | `<title>` + OG title (unique per intent cluster) |
| `description` | `string` | meta description + OG description |
| `pillarHeadline` | `string` | the single `<h1>` |
| `ogImage` | `string` | path to 1200×630 hero-fragment OG image |
| `breadcrumb` | `{ name: string; url: string }[]` | Home → Features → [page] |

### `SectionLabelProps`
| Field | Type | Notes |
|---|---|---|
| `children` | `string` | all-caps Inter 500, 13px |
| `tone` | `'orange' \| 'slate'` | slate for Audit Trail's restrained register |

### `FeatureFinalCTAProps`
| Field | Type | Notes |
|---|---|---|
| `eyebrow?` | `string` | small lock-line above headline |
| `headline` | `string` | DM Sans display `<h2>` |
| `body` | `string` | sub-copy |
| `primary` | `{ label: string; href: string }` | filled orange CTA |
| `secondary` | `{ label: string; href: string }` | quiet/bordered CTA |
| `swapEmphasis?` | `boolean` | Audit Trail: makes `primary` "Talk to us", `secondary` bordered "Start free" |
| `tagline?` | `string` | defaults to "Ship it once." |

---

## Fragment (product-UI depiction) shapes

These model the *visual content* of the faithful HTML fragments. All values are static literals
authored in the page; nothing is fetched.

### `PassButtonProps`
| Field | Type | Notes |
|---|---|---|
| `state` | `'blocked' \| 'enabled'` | blocked → lock icon, ~0.45 opacity, `aria-disabled`, not-allowed; enabled → orange fill |
| `hint?` | `string` | enabling-hint label + tooltip text (accessible, not a CSS pseudo-element) |
| `minTouchPx?` | `number` | defaults to 44 (mobile touch-target floor, even when blocked) |

### `ArtifactRequirement`
| Field | Type | Notes |
|---|---|---|
| `type` | `'file' \| 'text' \| 'checkbox' \| 'url' \| 'measured' \| 'table'` | one of the six |
| `label` | `string` | requirement label (live text) |
| `status` | `'complete' \| 'incomplete'` | drives checkmark vs incomplete indicator |
| `value?` | `string` | e.g. `2340` for measured, filled URL, etc. |
| `threshold?` | `string` | e.g. `≤ 3000 ms` |

### `ArtifactTypeTile` (AE §2 bento)
| Field | Type | Notes |
|---|---|---|
| `type` | same union as above | `<h3>` type name is the crawlable term |
| `name` | `string` | e.g. "File upload" |
| `useCase` | `string` | the lead line (practical use, not the type name) |
| `detail` | `string` | supporting detail |
| `inset` | enum tag | which mini product-fragment to render inside the tile |
| `inUse?` | `boolean` | faint orange tint when the type is "in use" (hero preview only) |

### `SpecRowProps`
| Field | Type | Notes |
|---|---|---|
| `title` | `string` | spec title (Inter 600) |
| `severity` | `'critical' \| 'high' \| 'medium'` | badge recipe (Error / NoGo / Slate) |
| `result` | `'passed' \| 'failed' \| 'skipped' \| 'in_progress'` | semantic-colored result badge |
| `executedBy?` | `string` | tester name |
| `timestamp?` | `string` | Geist Mono |
| `tintFailed?` | `boolean` | faint Error-50 row tint for failed rows |

### `StatusBadgeProps`
| Field | Type | Notes |
|---|---|---|
| `kind` | `'in_progress' \| 'awaiting' \| 'go' \| 'no_go' \| 'sealed'` | exact v5 semantic color recipes |

### `DecisionRecordBlockProps`
| Field | Type | Notes |
|---|---|---|
| `decision` | `'go' \| 'no_go'` | |
| `deciderName` | `string` | full name |
| `timestamp` | `string` | Geist Mono |
| `justification?` | `string` | shown for Go-with-failures |
| `sealed` | `boolean` | renders static `SealedLockIcon` + `SEALED` label; no edit affordances |

### `ImmutabilityCard` (AT §3)
| Field | Type | Notes |
|---|---|---|
| `layer` | `'api' \| 'service' \| 'database'` | |
| `heading` | `string` | `<h3>` technical vocabulary |
| `body` | `string` | |
| `codeCallout` | `string` | the Geist Mono line rendered via `TextType` (type-once) |

### `CalloutAnnotation` (GNG §2, AT §2 paired-hover)
| Field | Type | Notes |
|---|---|---|
| `id` | `string` | links left-column item ↔ fragment circle (`aria-controls`) |
| `number` | `number` | 1..n |
| `tone` | `'orange' \| 'slate'` | slate on Audit Trail; orange capped at 2/viewport elsewhere |

---

## State (UI-only, ephemeral)

No persisted state. The only runtime state is presentational:

- `ScrollReveal` reveal flag (intersection-driven; idempotent — reveals once).
- Paired-hover/focus highlight id (GNG §2, AT §2) — transient, `useState`.
- `TextType` typing progress — transient; completes once and stops; `disabled` short-circuits to final string.

## Validation rules (content integrity, enforced by review/E2E — not runtime schemas)

- Exactly one `PassButton state="blocked"` reads as blocked (not loading); enabled variant only in AE §3 step 3.
- `sealed` fragments render **no** edit affordances and a **static** lock (never animates).
- Reserved testimonial slots contain no fabricated name/company/quote.
- No roadmap capability rendered as a current feature (Audit Trail §4 honesty note required).
- ≤ 2 `tone="orange"` elements per viewport; overflow falls back to `slate`.
