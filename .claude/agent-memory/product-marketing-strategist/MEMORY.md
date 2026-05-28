# Product Marketing Strategist — Memory

## NoHotfix Positioning (rebranded from NoHotfix on 2026-03-11)

**Category**: Release Readiness / Release Governance (micro-category between QA tooling and release orchestration)

**Core differentiation**: The enforcement triad — artifact-gated spec execution + go/no-go decision gate + run immutability. No competitor combines all three. This is the entire positioning.

**The one-line contrast**: "A Notion checklist can be checked off without doing the work. NoHotfix can't."

**Tagline**: "Watch every release land." (replaced "Release with proof." on 2026-03-11 rebrand)

**Domain**: nohotfix.com (confirmed, user acquired)

## Hawk Brand Vocabulary (official — Option B, used sparingly)

Five anchor phrases. Use when they reinforce precision/scrutiny. Never as decoration.

1. "Watch every release land." — tagline only
2. "Sharp eyes on every release" — scrutiny, QA lead / VP Eng context
3. "Nothing slips through" — enforcement, blocked pass action, immutability
4. "Locked on" — go/no-go decision moment
5. "Overhead view" — VP Eng multi-team visibility, use sparingly

**Voice rule**: Hawk vocabulary is permitted when it reinforces precision and scrutiny — never as decoration. No feather imagery. No bird mascots. No puns.

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

## Messaging Pillars

1. **Evidence-Gated Execution** — pass action is blocked until artifacts are attached. Six artifact types.
2. **Role-Gated Go/No-Go** — Admin-only decision screen, all specs must be terminal, mandatory written justification for Go with failures.
3. **Immutable Audit Record** — 3-layer enforcement, tamper-evident, send auditor the URL.

## Key File Locations

- `docs/marketing/positioning.md` — Category definition, 3 personas, competitive positioning, 5 positioning principles
- `docs/marketing/messaging.md` — Value prop, hawk vocabulary table, 3 pillars with proof points, narrative, voice guidelines
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

## Voice Rules

- Precise, grounded, confident. Never cartoonish, never enterprise-gray, never buzzword-driven.
- Never say "streamline." Never say "AI-powered." No bird mascots, no puns on "hawk."
- Hawk vocabulary (sharp eyes, locked on, nothing slips through, overhead view) permitted only when reinforcing precision and scrutiny — never as decoration.
- Write for technical readers. Use their vocabulary: specs, runs, artifacts, go/no-go, run immutability.
- Concrete mechanics > vague benefit language.
