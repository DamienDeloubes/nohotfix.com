# Pricing Strategist Memory — NoHotfix.io

## Product

Release readiness platform. Replaces Notion/Sheets release checklists with enforced artifact-gated testing workflows, go/no-go decision gates, and immutable audit trails. Tenant unit is the Organisation.

## Pricing Model (decided, see docs/pricing-model.md)

- **Model**: Seat-banded tiered pricing, no per-seat overage. Free tier (1 seat, permanent). 30-day trial on paid plans, no credit card required.
- **Value metric**: Seats (org members). Runs are always unlimited on all tiers.
- **Tiers**: Free (1 seat), Growth ($49/mo, 10 seats — anchor), Scale ($149/mo, 40 seats), Enterprise (custom). No Starter tier.
- **Annual discount**: 20%.
- **No overage** — hitting the seat ceiling means upgrading to the next tier, full stop.
- **Phase**: Pre-PMF. Model optimised for adoption and learning. Revisit after 20+ paying customers.

## Key Decisions

- Free permanent tier (1 seat) — addresses "glorified checklist" objection by letting solo evaluators experience the artifact gate before any money is discussed. Conversion event is the invite gate.
- $49 held for Growth — "glorified checklist" is a positioning problem, not a price problem. Lowering price does not resolve it; free tier + enforcement experience does.
- No per-seat overage — simplicity beats revenue precision at pre-PMF. Hard ceiling, upgrade to next tier.
- No Starter tier — free tier handles sub-$49 evaluation use case; add Starter only if teams consistently churn at Growth seat ceiling.
- No playbook limits on any tier — punishes multi-product teams (the ICP) and contradicts adoption goals.
- No run history truncation on any tier — truncating history contradicts the "immutable audit trail" core promise.
- No credit card required for free tier or paid trial — maximise trial volume at pre-PMF stage.
- 30-day paid trial (not 14) — 14 days is only 1 release cycle for weekly shippers; insufficient to build habit.
- Runs never gated — core enforcement (artifact-gating, go/no-go, immutability) on all tiers including free.
- SSO/SAML is Enterprise-only (WorkOS Enterprise already in stack; commercial gate is natural).
- Data retained indefinitely on expiry — only new-run, new-playbook, and invite creation blocked.
- Compliance features (audit PDF export, viewer role, retention controls) at Scale tier, not Growth.

## ICP

- Primary: QA leads / VP Engineering at Series A–C B2B SaaS, 50–500 employees, 10–100 engineers, regulated sectors (fintech, healthtech, etc.)
- Secondary: multi-team mid-market, software agencies
- Negative: solo devs, teams < 5, 90%+ automated coverage shops

## Competitors

Indirect: Notion, Confluence, Jira (incumbents they replace). Direct: TestRail, Zephyr, Xray (different category — test case management, not release governance). NoHotfix is the only tool with enforced artifacts + role-gated approval + immutable trail + release-centric UX.

## Validation Actions Planned

1. 5–8 WTP interviews with primary ICP pre-launch
2. Van Westendorp survey (20–30 respondents) on Growth tier
3. A/B test: free tier present vs. trial-only (after 100 signups) — tests whether free tier increases paid conversion or just adds non-converting users

## Key Files

- `docs/marketing/pricing-model.md` — full pricing strategy document
- `docs/marketing/ideal-customer-profile.md` — ICP details
- `docs/marketing/competitors.md` — competitive landscape
- `apps/app/src/routes/_authenticated/settings/billing.tsx` — billing UI route
- `apps/app/src/components/layout/SubscriptionBanner.tsx` — trial/expiry banners
