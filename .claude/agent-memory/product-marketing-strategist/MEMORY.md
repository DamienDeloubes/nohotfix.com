# Product Marketing Strategist — Memory

## NoHotfix Positioning

**Category**: Release Readiness / Release Governance (micro-category between QA tooling and release orchestration). This is the **wedge**; the vision broadens to "the QA/test tooling choice" (UAT authoring, Jira integration) without diluting the enforcement core — see `docs/product-vision.md`.

**Core differentiation**: The enforcement triad — artifact-gated spec execution + go/no-go decision gate + run immutability. No competitor combines all three. The triad stays the flagship even as the platform broadens.

**The one-line contrast**: "A Notion checklist can be checked off without doing the work. NoHotfix can't."

**Tagline**: "Ship it once." (the promise behind the name: catch every issue before production does)

**Domain**: nohotfix.com (confirmed, user acquired)

## NoHotfix Vocabulary (official — use sparingly)

Four anchor phrases, all serving one idea: catch it first, ship it once. Never as decoration.

1. "Ship it once." — tagline only
2. "Caught before production" — enforcement: blocked pass action, immutability
3. "No surprises in prod" — VP Eng / outcome-focused copy
4. "Proof before you ship" — compliance / audit context

**Voice rule**: vocabulary is permitted when it reinforces the concrete promise — never as decoration. No mascots, no animal/bird imagery, no puns.

## Target Personas

1. **QA Lead** — Series A-C B2B SaaS, 50-200 employees, regulated sector. Pain: testers skip steps, screenshots uploaded after the fact, evidence reconstruction for audits. Primary CTA: "Stop chasing testers for screenshots."
2. **VP Engineering** — Makes the go/no-go call informally (Slack/verbal). Pain: no formal record of what was known before shipping. Primary CTA: "Know your release is ready before you ship — and prove it if anyone ever asks."
3. **Compliance buyer** — Active SOC2/PCI-DSS/HIPAA programme. Pain: retrospective evidence assembly. Primary CTA: "Your release runs become auditable artifacts, automatically."

## Competitive Positioning

- **vs. Notion/Confluence**: advisory vs. enforced. Enforcement is the product.
- **vs. TestRail/Zephyr**: test case library vs. release gate. Can coexist.
- **vs. Jira**: advisory checklists, no artifact enforcement, no immutability.
- **vs. building internally**: no immutability guarantee, no audit output, ongoing maintenance burden.

## Pricing (as of 2026-03-08 pricing doc)

- **Free**: 1 seat, full enforcement triad, unlimited playbooks/runs/history. Upgrade trigger: invite gate.
- **Growth**: $29/mo early bird → $49/mo standard. Up to 10 seats. Audit-grade export (PDF/JSON).
- **Scale**: $99/mo early bird → $149/mo standard. Up to 40 seats.
- **Enterprise**: Custom, unlimited seats, SSO/SAML.
- Early bird = first ~100 paying orgs, grandfathered Stripe price objects.
- The enforcement triad is available on ALL tiers including Free — never gate the core value in messaging.

## Key File Locations

- `docs/marketing/positioning.md` — Category definition, 3 personas, competitive positioning, 5 positioning principles
- `docs/marketing/messaging.md` — Value prop, NoHotfix vocabulary, 3 pillars with proof points, narrative, voice guidelines
- `docs/marketing/sitemap.md` — Full site architecture with page-level specs for all 12 pages
- `docs/marketing/ideal-customer-profile.md` — ICP detail, buying journey, negative ICP
- `docs/marketing/competitors.md` — Competitive landscape, positioning summary table
- `docs/marketing/pricing-model.md` — Full pricing strategy, decision log, unit economics
- `docs/design/brand-identity.md` — Logo, color tokens, typography, glass system, CSS token set

## Negative ICP (do not position toward)

- Solo devs / teams < 5 engineers
- 90%+ automated test coverage shops
- Pure CD with feature flags (blurred release boundary)
- Fortune 500 without enterprise sales motion
- "QA = CI pipelines only" shops

## Rebrand — Tagline & H1 Options (doc: `docs/design/rebrand-proposal/04-tagline-and-headline-options.md`)

Founder requested a wider menu. 10 tagline candidates + 10 H1 candidates evaluated. Decisions:

- **Tagline #1**: "Ship it once." — incumbent, stays. Name + tagline are the same claim in two registers.
- **Tagline #2**: "The gate holds." — best mechanic-first alternative; use as section headline regardless.
- **Tagline #3**: "Nothing ships without evidence." — enforcement-absolute; for sceptics/conversion copy.
- **H1 #1**: "The release gate that holds." — the correct homepage H1. Category-establishing + mechanic-implying.
- **H1 #2**: "Specs don't pass until the evidence does." — best for QA persona landing pages / subhead opener.
- **H1 #3**: "The pass action is blocked. Until the artifact is attached." — QA engineer acquisition channels only.
- **Recommended hero pairing**: H1 = "The release gate that holds." / Subhead = "Specs don't pass until the evidence does. The go/no-go call is Admin-only and permanent. When the decision is made, the run is sealed."
- "The checklist is a shared lie." — manifesto section only, never the H1.
- "Your release checklist, structurally enforced." — accessible but contradicts the positioning; avoid as H1.

## Voice Rules (v5 — APPROVED 2026-05-28)

Three adjectives: Clinically confident. Structurally warm. Deliberately legible.
The shift: explanatory → declarative. Mechanic-first. Softness edited out.

- State the mechanic; let the reader infer the benefit. Engineers distrust benefit language.
- No soft connectives: "helps you," "makes it easy to," "allows teams to." Direct subject-verb only.
- Hero copy: max 10 words per sentence. Body: complete declarative sentences, present tense, active subject. Microcopy: verb first.
- Wit is single-use — the 404 line ("This page doesn't exist. It wasn't shipped.") earns its impact by appearing once.
- Never say "streamline," "AI-powered," "ensure," "help" (as a verb), "robust," "end-to-end," "seamless," "powerful," "solution," "leverage," "next-generation," "world-class."
- No mascots, no animal/bird imagery. NoHotfix vocabulary permitted only when reinforcing the concrete promise.
- Write for technical readers: specs, runs, artifacts, go/no-go, run immutability, sealed, blocked, terminal.

## Messaging Pillars (v5 statements)

1. **Evidence-Gated Execution** — "The pass action is blocked. Not warned. Blocked — until the required artifact is attached." Section headline: "No artifact, no pass. Full stop."
2. **Role-Gated Go/No-Go** — "One screen. One Admin. Every spec outcome visible before the call is made. The decision is permanent." Section headline: "The release decision, made once and locked."
3. **Immutable Audit Record** — "When the go/no-go call is made, the run is sealed. Nothing in it can be edited. Send the URL." Section headline: "The record is sealed when the call is made."
4. **Lightweight Adoption** _(supporting pillar)_ — "A playbook is live in an afternoon. No implementation project. No dedicated admin." Section headline: "Start enforcing in hours, not quarters."
