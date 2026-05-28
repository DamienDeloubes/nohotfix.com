# Pricing Model — NoHotfix

TRIGGER: When building, modifying, or discussing billing UI, subscription logic, plan gates, upgrade flows, seat limits, tier boundaries, or any feature that references the pricing structure.

## Instructions

1. Read `docs/pricing-model.md` — this is the single source of truth for all pricing decisions.
2. Use the tier structure, feature gates, and price points defined there as authoritative. Do not invent tiers, prices, or limits not present in that document.
3. When implementing billing-related code or UI, cross-reference against the pricing model to ensure consistency.

## Quick Reference

|                            | Free      | Growth            | Scale             | Enterprise |
| -------------------------- | --------- | ----------------- | ----------------- | ---------- |
| Early bird price           | Free      | $29/mo            | $99/mo            | Custom     |
| Standard price             | Free      | $49/mo            | $149/mo           | Custom     |
| Seats                      | 1 (solo)  | Up to 10          | Up to 40          | Unlimited  |
| Team invites               | No        | Yes               | Yes               | Yes        |
| Enforcement triad          | Full      | Full              | Full              | Full       |
| Playbooks / Runs / History | Unlimited | Unlimited         | Unlimited         | Unlimited  |
| Audit export (PDF/JSON)    | No        | Yes               | Yes               | Yes        |
| SSO/SAML                   | No        | No                | No                | Yes        |
| Support                    | Docs only | Email (3-day SLA) | Email (1-day SLA) | Custom     |

- **Early bird**: first ~100 paying orgs get discounted pricing, locked in for life (grandfathered via Stripe price objects)
- **No trial period** — free tier is the evaluation vehicle; users pay at the invite gate via Stripe Checkout
- No per-seat overage — hitting the seat cap means upgrading to the next tier
- Annual pricing (post early bird): 20% discount ($39/mo Growth, $119/mo Scale)
- Compliance features (retention policy, uptime SLA) planned post-launch

## Key Principles

- The core enforcement triad (artifact-gating, go/no-go, immutability) is never gated — available on all tiers including Free
- Run history is full and permanent on all tiers — never truncated
- Playbooks and runs are unlimited on all tiers
- The Free → Growth conversion trigger is the invite gate (wanting to add team members)
- Upgrade UX should lead with value gained, not restrictions hit
- The "glorified checklist" objection is a positioning problem, not a pricing problem — the free tier solves it by letting users experience enforcement before paying

## When to Consult the Full Document

- Designing upgrade modals or plan comparison UI
- Implementing subscription guards or feature checks
- Writing marketing copy that references pricing
- Making any decision about what to gate or limit by plan
