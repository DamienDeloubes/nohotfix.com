# Pricing Model — NoHotfix.com

_Last updated: 2026-05-28_

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Pricing Model Analysis](#pricing-model-analysis)
3. [Value Metric](#value-metric)
4. [Tier Structure](#tier-structure)
5. [Feature Gate Matrix](#feature-gate-matrix)
6. [Price Points and Anchoring](#price-points-and-anchoring)
7. [Product Integration and UX Touchpoints](#product-integration-and-ux-touchpoints)
8. [Growth Levers and Expansion Revenue](#growth-levers-and-expansion-revenue)
9. [Unit Economics Model](#unit-economics-model)
10. [Decision Log](#decision-log)
11. [Validation Plan](#validation-plan)
12. [Risks and Mitigations](#risks-and-mitigations)

---

## Executive Summary

NoHotfix is a pre-PMF product. The pricing model's primary job right now is to maximise the number of real teams using the product and generating learning — not to optimise ARPU. The model that achieves this is: a **permanent free tier** (1 seat, fully functional, no time limit) to neutralise the "glorified checklist" comparison and let solo evaluators experience the core value before a purchase decision is required, followed by **two paid tiers** — Growth and Scale — plus Enterprise. There is no per-seat overage: hitting the seat ceiling means upgrading to the next tier, keeping billing dead simple. There are no playbook limits, no run history restrictions, and no trial period on any tier. The free tier is the evaluation vehicle; when a user wants to invite teammates, they pay immediately via Stripe Checkout.

**Early bird pricing** applies to the first ~100 paying organisations: Growth at $29/month and Scale at $99/month. After ~100 paying orgs, prices move to the standard $49/month (Growth) and $149/month (Scale). Early bird customers keep their price locked in for life (grandfathered via Stripe price objects). This rewards early adopters, generates willingness-to-pay data at a lower price point, and creates urgency without a time-based deadline.

Once PMF is demonstrated — 20+ paying customers, low churn, clear upgrade patterns — the model can be revisited for revenue optimisation.

---

## Pricing Model Analysis

### Why Not Per-Run Usage-Based Pricing

Usage-based pricing (charging per run executed) seems attractive because it aligns cost directly with product usage. Reject it for NoHotfix for three reasons:

1. **Unpredictable bills erode trust with QA leads.** The primary buyer is a QA lead or VP Engineering managing a fixed budget. A bill that fluctuates with release cadence creates friction at renewal time, especially after a high-deployment month.
2. **It punishes the best customers.** The teams that are most successful with NoHotfix — running it on every release — would face the highest bills. This is an anti-pattern that creates resentment and opens the door to competitive switching.
3. **Runs are not the value metric — proof-of-readiness is.** A team that runs 3 releases per month gets the same organisational confidence from the product as a team that runs 30. Charging per run prices the activity, not the outcome.

### Why Not Flat-Rate Per-Organisation

A single flat monthly price regardless of seat count is the simplest possible model. Reject it for NoHotfix because:

1. **Value scales with headcount.** A 50-person QA team with 12 playbooks gets dramatically more value from NoHotfix than a 4-person team running a single playbook. Flat pricing captures none of that expansion.
2. **No natural expansion revenue.** Once an org subscribes, there is no mechanism for revenue to grow without the customer manually upgrading. Net revenue retention stalls at approximately 100% — the best-case scenario, worse than the 120%+ target for a mature business.
3. **Leaves money on the table at enterprise.** Compliance-driven buyers (fintech, healthtech) will pay a significant premium for audit export, SSO, and SLA guarantees. A single flat rate cannot capture that differentiated willingness to pay.

### Why Not Per-Seat Only (No Tier Differentiation)

Pure per-seat pricing is used by tools like Figma and Linear where features are nearly identical across the team. Reject it as the sole mechanism because:

1. **The enterprise features gap is real.** SSO, audit-grade export, custom data retention, and SLA guarantees are not features that a 10-person startup needs — but they are hard requirements for a 200-person fintech. These features warrant a separate tier, not just more seats.
2. **It creates sticker shock at scale.** A 40-person team evaluating a $15/seat/month tool sees a $600/month bill before they have validated the product. Tiered pricing with seat bands reduces this psychological hurdle.

### The Recommendation: Seat-Banded Tiered Pricing with a Free Tier (Two Paid Tiers for Now)

The model is: a permanent free tier, then two paid tiers with fixed seat ceilings and no overage mechanics. If you exceed the seat ceiling, you upgrade. No partial-tier billing, no overage line items, no billing surprises. This keeps the model as simple as possible at a stage when the product has not yet proven itself.

For the pre-PMF phase, two paid tiers only — Growth and Scale. Three paid tiers is the right architecture for a validated product at growth stage; it is premature complexity when you have zero paying customers. Two tiers eliminates decision fatigue: teams without active compliance requirements pick Growth, teams with compliance requirements or larger headcount pick Scale.

Revisit adding a third paid tier once you have evidence about how customers actually distribute across plans.

---

## Value Metric

**Primary value metric: seats (active org members).**

The value NoHotfix delivers is proportional to the number of people whose release behaviour it governs. A team of 5 benefits from one run at a time; a team of 30 runs concurrent runs across multiple product teams, creates dozens of playbooks, and accumulates audit records that span multiple compliance cycles. The value does not scale with runs — it scales with the size of the team being held accountable.

Seat count is:

- **Predictable for the buyer**: "we have 12 engineers on the team" is a known number
- **Easy to track**: directly observable in the product (members page)
- **Self-reported and honest**: organisations have no incentive to under-seat since all team members need access to execute runs
- **A proxy for organisational maturity and budget**: larger teams correlate with larger budgets and more complex compliance requirements

**What is not the value metric: runs, playbooks, or run history.** Do not build pricing gates around these dimensions. Limiting runs penalises active usage. Limiting playbooks punishes multi-product teams — the exact teams in the primary ICP. Limiting run history directly contradicts the product's core promise of immutable audit evidence. A team that cannot access a run from six months ago does not have an audit trail — they have a six-month audit trail, which is not what NoHotfix sells.

---

## Tier Structure

### Overview

| Plan           | Target Persona                               | Seats          | Early Bird Price | Standard Price | Annual (Standard)          |
| -------------- | -------------------------------------------- | -------------- | ---------------- | -------------- | -------------------------- |
| **Free**       | Solo evaluator, individual champion          | 1 seat         | Free             | Free           | Free                       |
| **Growth**     | Primary ICP — startup to mid-size SaaS teams | Up to 10 seats | $29/mo           | $49/mo         | $39/mo (billed $468/yr)    |
| **Scale**      | Multi-team orgs, compliance-sensitive buyers | Up to 40 seats | $99/mo           | $149/mo        | $119/mo (billed $1,428/yr) |
| **Enterprise** | Mid-market, audit-critical, 40+ seats        | Unlimited      | Custom           | Custom         | Custom                     |

Early bird pricing applies to the first ~100 paying organisations. Early bird customers are grandfathered at their price indefinitely (separate Stripe price objects). No annual discount during early bird — keep it simple.

No per-seat overage on any tier. Hitting the seat ceiling means upgrading to the next tier.

---

### Free — $0/month (permanent)

**Target persona**: A solo evaluator — typically the champion who discovered NoHotfix and wants to validate the product before bringing it to their team. A QA lead, senior engineer, or engineering manager who wants to experience the enforcement mechanics themselves before spending any money or political capital on an internal tool proposal.

**Key characteristics of this user**:

- Has not yet convinced anyone else to adopt the tool
- Needs to experience the artifact-gating, go/no-go flow, and run immutability personally before making the case to their VP Engineering
- Is comparing NoHotfix to free Notion templates and free Jira checklists — the free tier eliminates that comparison entirely
- Will invite teammates the moment they are convinced — transitioning naturally to Growth

**What they get**:

- 1 seat (the org has one member: the admin)
- Unlimited playbooks
- Unlimited runs
- Full run history, permanently accessible
- Full artifact-gated spec execution
- Full go/no-go decision gate with mandatory justification for go decisions with failures
- Immutable run records
- Spec library with full tagging and search
- Email notifications
- Community support (docs, no SLA)

**What they cannot do**:

- Invite anyone else to the org — collaboration requires a paid plan

**The upgrade trigger for Free**: the moment the user wants to invite a second person. This is the most natural collaboration threshold in any team tool.

**Why the free tier is structured this way**: the free tier is a solo evaluation lane, not a team product. A single-seat limit means it cannot serve as a long-term free alternative to Growth for a real team. It is a discovery tool. The enforcement mechanics — artifact gating, go/no-go, immutability — are fully present because experiencing them is the entire point. A watered-down free tier that hides the core differentiators defeats the purpose. The gate holds even on a solo evaluation run.

---

### Growth — $29/month (early bird) → $49/month (standard)

**Target persona**: The primary ICP. An engineering or QA team of 2–10 people at a startup or Series A company. They have converted from the free tier (or found NoHotfix through another channel) and are ready to run it as a team. They are replacing a Notion or spreadsheet release checklist with something that actually enforces the process. Budget is modest but present; $29/month (early bird) or $49/month is trivially expensed without approval at most startups.

**Key characteristics of this buyer**:

- QA lead, senior engineer, or technical co-founder is the decision maker
- Already convinced of the product's value — either from the free tier or from a team member who used it elsewhere
- Wants the tool adopted across the whole team, not just by the admin
- May grow into Scale within 6–18 months as seat count exceeds 10 or compliance requirements activate

**What they get**:

- Up to 10 seats
- Unlimited playbooks
- Unlimited runs
- Full run history, permanently accessible
- Full artifact-gated spec execution
- Full go/no-go decision gate with mandatory justification for go decisions with failures
- Audit-grade export (PDF / structured JSON)
- Immutable run records
- Spec library with full tagging and search
- Email notifications
- Standard support (email, 3-day SLA)

**The upgrade trigger for Growth**: the team grows past 10 seats, or they need Scale's compliance-operations features (viewer role for auditors, retention controls, formal SLA). Audit-grade export is **not** a Growth → Scale trigger — it is included in Growth (see Decision 12).

---

### Scale — $99/month (early bird) → $149/month (standard)

**Target persona**: A mid-size engineering organisation with multiple product teams. 15–40 engineers, possibly a central QA or release function overseeing multiple teams running concurrent releases. Compliance requirements are active — SOC2 Type II, PCI-DSS, or HIPAA-adjacent. The buyer is a VP Engineering, Director of Engineering, or QA Director who needs both the enforcement mechanics and the compliance-facing features.

**Key characteristics of this buyer**:

- Has an active compliance programme — auditors have asked for release evidence
- Multiple product teams means multiple playbooks, concurrent runs, and cross-team visibility requirements
- Needs export in a format auditors will accept; needs a role for auditors that does not give them edit access

**What they get** (everything in Growth plus):

- Up to 40 seats
- Unlimited playbooks
- Unlimited runs
- Full run history, permanently accessible
- Full artifact-gated spec execution
- Full go/no-go decision gate with mandatory justification for go decisions with failures
- Audit-grade export (PDF / structured JSON)
- Immutable run records
- Spec library with full tagging and search
- Email notifications
- Standard support (email, 1-day SLA)

At launch, Scale's concrete differentiation over Growth is seats (40 vs 10) and faster support. Its compliance-*operations* layer — a viewer role for auditors, retention policy controls, and a formal uptime SLA — is post-launch and becomes the Scale differentiator as it ships (see the Compliance Operations Features section). Audit-grade export is **not** a Scale gate; it is included from Growth (Decision 12).

**The upgrade trigger for Scale**: the team exceeds 40 seats, OR they need the compliance-operations layer (auditor viewer role, retention controls, SLA), OR they require SSO/SAML, OR they need multi-organisation management, OR they need custom data residency.

---

### Enterprise — Custom

**Target persona**: Mid-market organisations with 40+ engineers, a formal compliance programme, and procurement requirements. Fintech, healthtech, or insurtech companies where release governance is a regulatory requirement. Software agencies managing multiple client environments.

**What they get** (everything in Scale plus):

- Unlimited seats
- The rest is still unknown. The tier is offered just in case and everything that will be discussed with a potential enterprise customer still needs to be made.

**Typical ACV**: $6,000–$30,000/year depending on seat count and add-ons.

---

## Feature Gate Matrix

> **Launch scope (updated 2026-05-29):** This matrix describes the full intended model. **At launch, the only paid differentiators are seats and support speed.** Audit-grade **export** and Scale's **compliance-ops** (viewer role, retention controls, uptime SLA) are **post-launch**; **email notifications at launch are the invitation email only** (the three workflow triggers are post-launch). Rows annotated "*(post-launch)*" are not live at launch.

### Core Enforcement Features (All Tiers Including Free)

These features are the product. Gating any of them — even on the free tier — would mean users cannot experience what NoHotfix actually is. The entire free tier strategy depends on these being fully present.

| Feature                                    | Rationale                                                                                                                                                                          |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Artifact-gated spec execution              | This is the core differentiator. A version without it is not NoHotfix — it is just another checklist. The free user must experience this to understand why it is worth paying for. |
| Go/no-go decision gate                     | The governance moment is what buyers are paying for. The free user must experience it.                                                                                             |
| Run immutability                           | Tamper-evident audit evidence is a core promise. A mutable record on any tier makes the promise hollow.                                                                            |
| Unlimited runs                             | Run count limits punish active users. Execution should be encouraged, not rationed.                                                                                                |
| Unlimited playbooks                        | Playbook limits punish multi-product teams — the exact primary ICP. There is no version of this gate that makes the product better.                                                |
| Full run history, permanently accessible   | An audit trail that expires is not an audit trail. This applies even on the free tier — a solo user's run history is their personal proof-of-concept.                              |
| Email notifications (self-relevant events) | Table stakes for any tool with a workflow.                                                                                                                                         |

### Free Tier Limits (Hard Walls, Not Soft Nudges)

The free tier has exactly two limits. Both are structural rather than artificial.

| Limit  | Free Tier                      | Rationale                                                                                                                                                                                                                                                            |
| ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seats  | 1 (owner only, no invitations) | Collaboration is what makes the product valuable at team scale. 1 seat means the product is useful for self-evaluation; the moment you want someone else involved, you need a paid plan. This is not an artificial gate — it maps directly to when value multiplies. |
| Export | None                           | Export is for compliance and team records. A single-user evaluation has no export use case.                                                                                                                                                                          |

### Compliance Operations Features (Scale and Enterprise Only)

Audit-grade export is **not** gated here — it is available from Growth (see Decision 12). The Scale-only features are the compliance *operations* layer: meaningful only to buyers running an active compliance programme, and adding interface complexity without value for the majority of users. These are post-launch builds; they define the Scale compliance story as they ship.

| Feature                      | Scale | Enterprise | Rationale                                                                                                                                                  |
| ---------------------------- | ----- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Viewer role (auditor access) | Yes   | Yes        | Read-only access for auditors without consuming an editing seat or risking the immutable record. Only relevant once external auditors are in the picture. |
| Retention policy controls    | Yes   | Yes        | Configurable retention is a formal compliance-programme requirement, not an everyday need.                                                                |
| Uptime SLA                   | Yes   | Yes        | A contractual guarantee procurement asks for; irrelevant to smaller self-serve teams.                                                                     |

SSO/SAML is gated at Enterprise (see Decision 10).

**Next-phase vision capabilities (not yet priced):** UAT authoring + external partner sign-off and the Jira integration (see [product-vision.md](../product-vision.md)) are likely paid-tier differentiators — current lean is Scale/Enterprise — but their packaging is deliberately undecided until the features are specified and there is real demand signal. Do not bake them into the tier matrix yet.

### Features by Tier

| Feature                              | Free           | Growth          | Scale | Enterprise |
| ------------------------------------ | -------------- | --------------- | ----- | ---------- |
| Artifact-gated spec execution        | Yes            | Yes             | Yes   | Yes        |
| Go/no-go decision gate               | Yes            | Yes             | Yes   | Yes        |
| Run immutability                     | Yes            | Yes             | Yes   | Yes        |
| Unlimited runs                       | Yes            | Yes             | Yes   | Yes        |
| Unlimited playbooks                  | Yes            | Yes             | Yes   | Yes        |
| Full run history (permanent)         | Yes            | Yes             | Yes   | Yes        |
| Spec library with tagging and search | Yes            | Yes             | Yes   | Yes        |
| Seats                                | 1              | 10              | 40    | Unlimited  |
| Team invitations                     | No             | Yes             | Yes   | Yes        |
| Email notifications (4 workflow events) *(post-launch — invite email only at launch)* | No (self only) | Yes | Yes | Yes |
| Standard support                     | No (docs only) | Yes (3-day SLA) | Yes   | Yes        |
| Audit-grade export (PDF/JSON) *(post-launch; Growth+ when it ships)* | No | Yes | Yes | Yes |

---

## Price Points and Anchoring

### The "Glorified Checklist" Objection — Address It Directly

The founder's concern is correct and worth treating as the central pricing challenge rather than a footnote. Any prospect who frames NoHotfix as a "glorified checklist" will not convert at $29/month any more than at $49/month. The comparison to free Notion templates is not a price objection — it is a positioning failure. Solving it with a lower price does not work; it just makes the product look cheaper without changing the mental model.

The "glorified checklist" framing appears when the prospect has not yet understood the enforcement difference. They are comparing features they can see — a list of items to check off — rather than the property they cannot see until they experience it: that NoHotfix makes it structurally impossible to check off a spec without doing the work. A Notion checklist can be completed in 30 seconds by someone who never ran the test. A NoHotfix run cannot. That difference is everything, and it cannot be communicated with bullet points on a pricing page — it has to be experienced.

This is why the free tier is the right answer to the "glorified checklist" objection, not a price cut. The free tier says: "try it for nothing, by yourself, right now — and then tell us it feels like a Notion template." A solo user who creates a playbook, starts a run, hits the artifact requirement gate, and cannot mark a spec as passed without uploading proof has experienced the core differentiator. That experience reframes the entire value conversation before a price is even on the table.

A price cut to $29 or $19 does not achieve any of this. It signals lower value, attracts more price-sensitive customers who are harder to retain, and does not resolve the positioning problem. The teams NoHotfix is built for — QA leads at Series A–C SaaS companies with compliance pressure — have tooling budgets. $49/month is not the barrier; the belief that the product is worth $49/month is the barrier. The free tier creates that belief before money is discussed.

### $49 Is the Right Price for Growth — Here Is the Full Case

The case for $49 on Growth rests on three arguments, each of which holds independently.

**Argument 1: The relevant comparison is not Notion — it is the cost of the problem NoHotfix solves.**

The "glorified checklist" frame breaks the moment you shift the comparison from "what does a Notion template cost" to "what does one skipped test spec cost." For a Series A SaaS company, a production incident caused by a missed testing step costs tens of thousands of dollars in engineering time, customer trust damage, and potential churn. A compliance audit failure caused by missing release evidence costs months of remediation and potentially a failed SOC2 certification. $49/month — $588/year — is a rounding error relative to either outcome.

This is not a hypothetical. It is the exact pain moment that drives every sales conversation in the ICP. The QA lead who found NoHotfix found it because something went wrong. The value frame is not "how much better than Notion is this?" It is "what is the next incident worth?"

**Argument 2: $49 is below every relevant purchase threshold.**

$49/month is below the threshold that requires approval at virtually any startup or Series A company. The decision maker buys it with a company card, the way they buy Loom, Figma, or Linear. At $99/month, some companies require a quick manager approval. At $149/month, some require a budget conversation. $49 is in the territory where the champion buys it before telling anyone, and then demonstrates value after the fact. This is exactly the land-and-expand motion.

**Argument 3: The price signals that the product is real.**

A $9/month or $19/month price point for a governance tool signals a side project, not infrastructure. QA leads and VP Engineering at regulated companies are not looking for cheap tooling — they are looking for credible tooling. A price point that is clearly "under $50 but not embarrassingly cheap" is part of the product's credibility signal. Underpricing in B2B does not attract more customers — it attracts worse customers who negotiate harder and churn faster. A serious tool carries a serious price.

### What to Do Instead of Lowering the Price

The three actions that address the "glorified checklist" perception without touching the price:

1. **Launch the free tier.** Solo evaluation with no time limit eliminates the comparison to free tools. The prospect who tries it for free and experiences the enforcement mechanics will not describe it as a checklist tool.

2. **Lead with the failure story, not the feature list.** Every marketing touchpoint — the homepage, the pricing page, the first lifecycle email — should open with the scenario that drove the buyer to search: "A tester checked the box. The test wasn't run. The release shipped. You found out in production." NoHotfix is the product that makes that scenario structurally impossible. Price is an afterthought to a buyer who recognises their own incident in that sentence.

3. **Make the onboarding experience demonstrate the hard gate.** The demo playbook seeded on signup should include at least one spec with an artifact requirement that a new user will hit in their first session. The moment they try to click "passed" and the product refuses — because they have not uploaded the evidence — is the moment the "glorified checklist" frame breaks. Price this product at whatever you want after that moment.

### Competitive Benchmarking

For context only — these comparisons should not drive the pricing decision, but they provide market calibration.

- **TestRail**: $36/user/month (Cloud) — expensive, complex, test case management (different category)
- **Zephyr Scale**: $10–$12/user/month via Jira licence
- **Linear**: $8/user/month (Business tier) — project management, not governance
- **Notion**: Free–$16/user/month — the incumbent being replaced
- **Intercom**: $74–$374/month tiered — B2B SaaS peer at comparable team sizes

At $49/month for up to 10 seats, NoHotfix is $4.90/seat — cheaper per seat than TestRail and in the same range as Zephyr. This framing is available on the pricing page for buyers who do compare per-seat, but it should not be the primary value argument.

### Annual Discount: 20%

20% is the B2B SaaS market norm and is understood by buyers as "about two months free." Display monthly equivalent prominently on the pricing page: "$39/mo, billed annually." Annual commitments reduce churn by 40–50% on average; the cash flow improvement and churn reduction together justify the discount even at the pre-PMF stage.

---

## Product Integration and UX Touchpoints

### The Free Tier Signup and First Session

**Goal**: Get the free user to hit the artifact gate within their first session. Not a demo — the actual gate on a real playbook they have started to build. That experience is the product's best sales argument. The gate holds, even on a solo first run.

Free tier onboarding flow:

1. Signup — no credit card, no trial clock, no urgency
2. Immediate redirect to a seeded demo playbook with one spec that has an artifact requirement
3. A single dashboard CTA: "Try your first run" — points directly to the demo playbook
4. When the user tries to mark the spec as passed without uploading the artifact, the hard gate fires
5. No upgrade prompt at this moment — let the product speak for itself
6. After the run is complete, a single inline callout on the run completion screen: "Ready to bring your team in? Growth includes up to 10 seats."

The free tier has no trial clock and no nag emails. The only upgrade prompt appears naturally when the user tries to invite someone, at which point the gate is honest and expected: collaboration requires a paid plan.

### No Trial Period

There is no trial on paid plans. The free tier is the evaluation vehicle. Every user starts on Free, experiences the full enforcement mechanics solo, and pays when they want to invite teammates. This eliminates trial state management, countdown UI, lifecycle emails, and grace period logic — significant technical simplicity for a pre-PMF product.

The conversion flow is: Free tier → hit invite gate → Stripe Checkout → active paid subscription. One step, no intermediate states.

### Seat Ceiling and Upgrade Prompts (Paid Plans)

Seats are the only capacity limit on paid plans. The UX at the boundary should show what the customer gains, not block them with an error.

**Seat limit hit on Growth**: When an Admin tries to invite an 11th member, show a modal:

> "Your Growth plan includes 10 seats. Invite [name] by upgrading to Scale — up to 40 members, plus the compliance-operations layer (auditor viewer role, retention controls, SLA)."
> [Upgrade to Scale] [Not now]

**Approaching the seat ceiling**: Show an ambient seat usage indicator ("8 of 10 seats") on the members page and billing settings page. At 80% utilisation, surface a soft callout:

> "You're using 8 of 10 seats. Growing your team? Scale supports up to 40 members."
> [View Scale features] [Dismiss]

**Free to paid upgrade**: When the free user tries to invite a second member, show a modal:

> "Team collaboration requires a paid plan. NoHotfix Growth includes up to 10 seats and full team notifications for $29/month."
> [Upgrade to Growth] [Not now]

During early bird phase, the modal should mention the early bird pricing. After the early bird cap is reached, update to $49/month.

Do not show this prompt anywhere other than the invite flow. The free tier should never feel like it is constantly pushing the user to pay.

### Export and the Compliance Upsell

Audit-grade export (PDF / structured JSON) and CSV are both included from **Growth** — a QA lead facing their first audit request should never be blocked from exporting evidence by a tier wall (see Decision 12). Free has no export.

- **Free → Growth at the export moment**: when a Free user opens the export action, surface that export (like team collaboration) requires a paid plan, leading into the invite/upgrade flow.
- **Growth → Scale compliance-ops upsell**: the Scale upgrade prompt fires around the *operations* features an audit programme needs — a viewer role for auditors, retention controls, and a formal SLA — not around export. Surface it where those needs appear (e.g. when inviting an auditor who should have read-only access), not on the export button.

Surface the compliance need at the moment the user expresses it. Do not hide the option.

### Billing Management (Settings > Billing)

Admin-only, as enforced in the route guard. Structure:

1. **Current plan summary**: plan name, seat count in use vs. included, next renewal date
2. **Seat usage bar**: "8 of 10 seats used" — visual, always visible
3. **Upgrade CTA**: inline button, always visible, links to plan selection or Stripe Checkout
4. **Annual upgrade nudge** for monthly subscribers: "Switch to annual and save 20% — that's $118/year back."
5. **Payment method management**: Stripe Customer Portal link
6. **Invoice history**: last 12 invoices via Stripe Customer Portal redirect
7. **Cancellation**: at the bottom, self-serve, not hidden. A single exit survey question ("What made you cancel?") before confirming. Hiding cancellation creates resentment; making it easy creates goodwill and occasionally recovers the account.

### Post-Expiry Flow (Paid Plans)

On paid subscription expiry (after grace period):

- **Retain all data indefinitely** — runs, playbooks, artifacts. Never delete on expiry.
- Block creation of new runs, new playbooks, and new member invitations
- Show a full-page interstitial on login explaining what is blocked and what reactivation restores
- Provide a direct "Reactivate" CTA to Stripe Checkout

The free tier is never affected by expiry — it has no subscription to expire.

### Pricing Page on Marketing Site

The pricing page must:

1. Display three columns — Free, Growth (highlighted as "Most popular"), Scale — with Enterprise as a callout below
2. Free column should be visually present but clearly subordinate — it is a starting point, not a competing product
3. During early bird phase: anchor on the **standard** price as the reference number and frame the early bird as a saving, not as "the price" — e.g. "$49/mo · $29 early bird for the first 100 orgs (save $20/mo)" with a "First 100 orgs" badge and the standard price struck through. Use this standard-price-first framing consistently across the page, emails, onboarding, and any community mentions so word-of-mouth never settles on $29 as the baseline (see Risk 5). After early bird cap: show standard prices with optional annual toggle
4. CTAs: Free column → "Start for free" (no credit card); Growth/Scale columns → "Upgrade" (goes to Stripe Checkout)
5. Prominently state "No credit card required" under the Free CTA
6. Enterprise callout: "More than 40 seats, need SSO, or have compliance procurement requirements? [Talk to us]"
7. A brief FAQ: "Can I upgrade from Free to paid?", "What happens if I cancel?", "Is there a long-term contract?", "What is early bird pricing?"

---

## Growth Levers and Expansion Revenue

### Lever 1: Free-to-Paid Conversion (Primary at Launch)

The free tier's single conversion event is the first invitation attempt. Every free user who tries to add a teammate becomes a paid conversion opportunity. This is the most natural and least coercive conversion moment in any SaaS product — the user is not being pushed to upgrade; they are trying to do something that inherently requires a team plan.

Design this moment carefully: the upgrade modal at the invite gate should be frictionless (pre-select the Growth plan, go directly to Stripe Checkout, no plan comparison page). Reduce the number of steps between "I want to invite someone" and "I have entered my payment details."

### Lever 2: Seat Expansion within Paid Plans (Near-Term Revenue Growth)

Once a team is on Growth, every new team member added up to the 10-seat ceiling is a natural product expansion. When the team hits 10 seats, the only path forward is Scale. There is no overage — the ceiling is hard. This means the upgrade moment is clear and expected rather than a surprise charge.

The seat usage indicator ("X of Y seats") creates ambient awareness so the upgrade conversation happens proactively, not reactively.

### Lever 3: Compliance Trigger (Growth to Scale)

When a Growth-tier team begins a SOC2 audit or receives a compliance questionnaire from a prospect, they immediately need the compliance-operations layer only Scale provides: a viewer role for auditors, retention controls, and a formal SLA. (Audit-grade export itself is already in Growth — see Decision 12 — so the export need does not by itself drive this upgrade; the *operations* of running an audit do.) This trigger is external, but the product can make the gap visible before the urgency hits:

- Surface the Scale compliance-operations features as visible-but-locked options where they belong (e.g. an "invite auditor (viewer)" affordance on the members page)
- Include a compliance-framed lifecycle email at month 3: "Running an audit? Scale adds a viewer role for auditors, retention controls, and an uptime SLA."

### Lever 4: Annual Upgrade at Renewal

Monthly subscribers are natural annual upgrade targets at the 3–6 month mark. The retention playbook:

- At month 3, send a lifecycle email: "3 months in — switch to annual and save $118/year."
- On the billing page, show a persistent "Save 20% — switch to annual" nudge for monthly subscribers
- At 30 days before monthly renewal, surface the annual option in the renewal reminder email

---

## Unit Economics Model

### Important Caveat

These are directional projections for planning purposes. At the pre-PMF stage, the unit economics are less important than qualitative signal: are teams finding value, staying, and growing into the product? Revisit these numbers after 20 paying customers with actual conversion data.

### Assumptions

| Metric                     | Assumption               | Basis                                                                                                                                                             |
| -------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Free-to-paid conversion    | 15% of active free users | Industry average for SaaS products with a genuine free tier and a natural invite gate: 10–25%. Free users who try to invite someone convert at much higher rates. |
| Average plan at conversion | Growth                   | 80% convert to Growth, 20% to Scale. Primary ICP is a small-to-mid team; Scale adopters are self-selecting compliance buyers.                                     |
| Monthly churn (paid)       | 3.5%                     | Target for B2B SaaS tooling at this price point. Pre-PMF churn is slightly higher than a validated product.                                                       |

### Projected ARPU

**Early bird phase (first ~100 paying orgs):**

- 80% Growth ($29) = $23.20 contribution
- 20% Scale ($99) = $19.80 contribution
- Blended early bird ARPU: **~$43/month**

**Standard pricing (post early bird):**

- 80% Growth ($49) = $39.20 contribution
- 20% Scale ($149) = $29.80 contribution
- Blended standard ARPU: **~$69/month**

This is deliberately modest. The pre-PMF priority is learning, not ARPU maximisation.

### LTV at 3.5% Monthly Churn

Average customer lifetime = 1 / 0.035 = 29 months.

**Early bird:**

- Growth LTV: $29 × 29 = ~$841
- Scale LTV: $99 × 29 = ~$2,871

**Standard:**

- Growth LTV: $49 × 29 = ~$1,420
- Scale LTV: $149 × 29 = ~$4,320

Early bird LTV is lower but acceptable — these customers provide learning, testimonials, and case studies that are worth more than the revenue delta.

### Breakeven Sketch

Infrastructure costs ~$78/month. At $43 early bird blended ARPU, break-even requires **2 paying customers**. At standard pricing, still 2 customers. The free tier adds zero infrastructure cost at low volume — a handful of free single-seat orgs is noise. Revenue optimisation is not the constraint; product-market fit is.

---

## Decision Log

### Decision 1: Free Permanent Tier Added

**Decision**: Add a permanent free tier capped at 1 seat. No time limit. Full access to all enforcement mechanics.

**Reasoning**: The "glorified checklist" objection cannot be resolved with a lower price. It can only be resolved by letting the prospect experience the enforcement mechanics before money enters the conversation. A solo user who builds a playbook, starts a run, and hits the artifact gate for the first time has experienced the core differentiator. That experience makes the $49/month conversation a straightforward one. Without it, the product is just features on a pricing page — which look like a Notion template to someone who has not tried it. The free tier is a discovery vehicle, not a product offering. It is designed to produce one outcome: the user tries to invite a teammate.

**Why not just a longer trial**: A trial has an end date, which creates urgency. Urgency is fine for a product the user already understands. For a product the user does not yet understand ("is this actually different from a Notion template?"), urgency is counterproductive — it adds pressure at the wrong moment. The free tier removes urgency from the evaluation phase and puts it exactly where it belongs: at the invite gate, where the user's own desire to collaborate creates the natural conversion moment.

**Trade-off accepted**: Some solo users will use the free tier indefinitely and never invite anyone. This is acceptable — they are a marginal infrastructure cost and a potential future champion when they change jobs.

### Decision 2: $49 Held as Growth Price (Not Lowered)

**Decision**: Keep Growth at $49/month. Do not lower to $29 or $19 in response to "glorified checklist" price sensitivity.

**Reasoning**: Lowering the price does not resolve the positioning problem. A prospect who sees NoHotfix as a glorified checklist will not convert at $29 either — they will compare it to a $0 Notion template and still not pay. Price sensitivity is a symptom of unclear value, not the root cause. The root cause is that the enforcement difference between NoHotfix and a Notion checklist cannot be communicated in copy — it must be experienced. The free tier creates that experience. Once a prospect has experienced the artifact gate, $49/month is trivially justified.

Lowering the price also creates two compounding risks: (1) it signals lower product quality, which is lethal in a governance tool where buyers equate price with credibility, and (2) it attracts more price-sensitive customers who have smaller budgets, require more hand-holding, and churn more readily when something goes wrong.

$49/month is below the approval threshold at virtually every startup and Series A company. It is not a budget problem for the ICP. It is a belief problem, and the free tier is the right remedy.

**Revisit when**: Post-launch data shows that "too expensive" is consistently the exit reason from free-to-paid conversion attempts — specifically, that users are hitting the invite gate, seeing the $49 price, and abandoning. If that pattern emerges, consider a lower price for Growth. Do not pre-empt it.

### Decision 3: No Per-Seat Overage

**Decision**: Remove per-seat overage mechanics entirely. Hitting the seat ceiling means upgrading to the next tier. No partial billing, no overage line items.

**Reasoning**: Overage mechanics add complexity — both to the billing system and to the buyer's mental model. At the pre-PMF stage, simplicity is more valuable than revenue precision. The seat ceiling is already the primary upgrade trigger; overage adds billing noise without materially changing who upgrades or when. A team that hits 11 seats on Growth and is billed $49 + $6 = $55/month is not meaningfully different from a team that is simply told "you need Scale at $149/month." The former creates a billing confusion vector; the latter creates a clean, predictable decision.

**Trade-off accepted**: Some teams that need 11–15 seats may balk at upgrading all the way to Scale ($149) rather than paying a modest overage. If this turns out to be a meaningful conversion blocker — teams churning at the seat ceiling rather than upgrading — the Growth seat band can be expanded to 15 seats, or a mid-tier can be introduced. Measure this before changing it.

### Decision 4: No Starter Tier (Pre-PMF Phase)

**Decision**: Launch with two paid tiers (Growth and Scale), not three. Do not add a paid tier below Growth.

**Reasoning**: A three-tier paid structure forces every prospect into a "which plan fits me?" decision before they have experienced the product. The free tier now handles the sub-$49 evaluation use case — a separate paid Starter tier is not needed to capture that audience. Two paid tiers provides a clean decision: teams without compliance requirements and under 10 seats pick Growth; teams with compliance requirements or above 10 seats pick Scale.

**Revisit when**: 20+ paying customers with evidence that teams are churning off Growth at the seat ceiling (11–15 seats) rather than upgrading to Scale. If that pattern is consistent, a mid-tier between Growth and Scale makes sense.

### Decision 5: No Playbook Limits on Any Tier (Including Free)

**Decision**: Remove playbook limits entirely from all tiers.

**Reasoning**: The founder's own company has 5 products each needing different playbooks. A playbook ceiling punishes multi-product teams — the exact primary ICP. Playbook creation is product-building behaviour: more playbooks means more value delivered, more process embedded, more switching cost created. It should be encouraged, not rationed. The free tier has unlimited playbooks because a solo evaluator building playbooks for all five of their products is the best possible user — they are building deep product dependency before they pay anything.

**Trade-off accepted**: Playbooks cannot be used as a conversion lever. The seat ceiling and the invite gate are the only conversion levers. This is the right trade.

### Decision 6: No Run History Truncation on Any Tier (Including Free)

**Decision**: Full run history, permanently accessible, on all tiers including Free.

**Reasoning**: NoHotfix's core claim is "immutable audit trail." Truncating that trail at any tier directly undermines the claim. A team that cannot access a run from six months ago does not have an audit trail — they have a time-limited record. Beyond the positioning problem: the teams most likely to need historical runs are preparing for compliance audits, which happen on 6–12 month cycles. A 90-day truncation on any tier means the limitation is discovered at the worst possible moment. Full permanent history, on every tier, is the only version of the product that delivers the audit trail promise.

**Trade-off accepted**: Run history cannot be used as a conversion lever. Accepted — the seat ceiling is the correct lever.

### Decision 7: No Credit Card Required for Free Tier Signup

**Decision**: No credit card at signup. The free tier is genuinely free with zero friction.

**Reasoning**: Credit card requirements at signup reduce trial volume by 40–60% (ProfitWell / Totango). The free tier must have zero friction — a free product that requires a credit card is not actually free in the buyer's mind. Credit card is collected at the moment of paid conversion (invite gate → Stripe Checkout).

### Decision 8: No Trial Period on Paid Plans

**Decision**: Remove the 30-day paid trial entirely. The free tier is the only evaluation vehicle. When a user wants to invite teammates, they pay immediately.

**Reasoning**: The free tier already provides unlimited, no-pressure evaluation of the full enforcement mechanics. Adding a trial on top creates unnecessary technical complexity (trial state management, countdown UI, lifecycle emails, grace periods) without meaningfully improving conversion. The free tier gives users as much time as they need. When they hit the invite gate, they've already validated the product — a 30-day trial at that point just delays revenue and adds a billing state to manage.

**Trade-off accepted**: Users cannot evaluate the team collaboration experience before paying. This is acceptable — the core value proposition (enforcement mechanics) is fully evaluable solo. Team collaboration is table-stakes functionality that does not need a trial to prove.

### Decision 9: Early Bird Pricing for First ~100 Paying Orgs

**Decision**: Launch with early bird pricing — Growth at $29/mo, Scale at $99/mo — for approximately the first 100 paying organisations. Early bird customers keep their price locked in for life (grandfathered via separate Stripe price objects). After the cap, new customers pay standard pricing ($49/$149).

**Reasoning**: Early bird pricing serves three purposes: (1) it rewards early adopters who take a risk on an unproven product, building loyalty and goodwill; (2) it generates willingness-to-pay data at a lower price point — if conversion is strong at $29, the $49 standard price is validated; (3) it creates urgency without a time-based deadline ("first 100 orgs" is concrete and fair). The ~100 cap is approximate and manually monitored — no automated counter needed. When the threshold is reached, create new Stripe price objects at standard rates. Existing subscriptions are untouched (Stripe's default behavior).

**Implementation**: Two sets of Stripe price objects (early bird + standard). Switch the pricing page to reference standard price IDs when the cap is reached. No feature flags, no DB state, no custom billing logic.

**Revisit when**: The early bird cap is reached. Evaluate conversion rates at $29 vs projected rates at $49 to validate the standard price.

### Decision 10: SSO/SAML Is Enterprise-Only

**Decision**: SSO/SAML gated at Enterprise, not Scale.

**Reasoning**: SSO is a procurement prerequisite for large enterprises, not a feature teams evaluate on. Including it in Scale would undermine the Enterprise commercial gate. WorkOS Enterprise is already in the infrastructure — activate at first Enterprise deal.

**Trade-off accepted**: Some Scale-tier companies may require SSO and will need Enterprise. This is the intended outcome.

### Decision 11: Data Retained Indefinitely on Expiry

**Decision**: All data retained indefinitely after subscription expiry. Only creation of new runs, playbooks, and member invitations is blocked.

**Reasoning**: Teams that pause for budget or structural reasons and return later should find their audit history intact. Deleting data on expiry removes the most compelling reason to reactivate. Storage cost for inactive orgs is negligible — artifact files in DigitalOcean Spaces can be tiered to cold storage after 90 days of org inactivity.

### Decision 12: Audit-Grade Export at Growth, Not Scale

**Decision**: Audit-grade export (PDF / structured JSON) is included from the Growth tier, alongside CSV. Scale's compliance differentiation is the operations layer — viewer role for auditors, retention policy controls, and a formal uptime SLA — not export.

**Reasoning**: The Growth-tier buyer (a QA lead at a Series A–B company) is precisely the person who receives their first SOC2 audit request. Gating export at Scale forces a ~3x jump ($49 → $149) to unlock a single feature at the exact moment of high-intent compliance urgency — the worst possible place to create friction. That is a churn trigger, not an upgrade trigger. Export is a compliance *output* every paying team can need; the genuinely Scale-appropriate features are the compliance *operations* a formal programme runs (auditor access, retention, SLA). This also resolves an internal inconsistency in earlier drafts, which listed export as both a Growth inclusion and a Scale-only feature.

**Trade-off accepted**: Scale's launch differentiation is effectively seats (40) plus faster support until the compliance-operations features ship post-launch. Acceptable — Scale is an anchor and a headroom tier at launch; its compliance-ops story strengthens as those features roll out.

---

## Validation Plan

### Pre-Launch (Before First External Customer)

**1. Willingness-to-Pay Interviews (5–8 conversations)**

Talk to 5–8 people matching the primary ICP: QA leads or VP Engineering at Series A–C B2B SaaS companies. Ask:

- "What do you currently pay for QA or release management tooling?" (anchors the conversation in real budgets)
- "What is a production incident caused by a skipped test worth to your team in engineering hours?" (establishes the value anchor)
- "At what monthly price would you not hesitate to try this for your team?" (establishes price floor)
- "At what monthly price would you start to question whether it was worth it?" (establishes ceiling)

Do not show the pricing page during the interview. Reveal pricing only after gathering unprompted reactions. Pay particular attention to whether $49 is met with relief, acceptance, or hesitation — and whether the hesitation is about price specifically or about the product's value.

**2. Van Westendorp Price Sensitivity Survey (20–30 respondents)**

Recruit from QA communities (Ministry of Testing, Engineering Managers Slack). Run the four Van Westendorp questions on the Growth tier description:

- "At what price would this be so cheap you would question its quality?" (expected: below $20/mo)
- "At what price would this feel like a bargain for your team?" (expected: $30–50/mo)
- "At what price does this start to feel expensive?" (expected: $80–100/mo)
- "At what price would this be too expensive to seriously consider?" (expected: above $150/mo)

If the "bargain" threshold clusters above $49, Growth can be raised to $69 or $79 post-PMF. If the "too expensive" threshold clusters near or below $49, that is a signal — but investigate whether the respondents are in the negative ICP (teams without a real compliance or governance need) before adjusting price.

**3. Early Bird → Standard Price Transition Analysis**

When the ~100 early bird cap is reached, compare:

- Early bird conversion rate (free → paid at $29/$99)
- Standard conversion rate (free → paid at $49/$149) over the next 100 signups

If standard pricing converts at 80%+ of the early bird rate, the standard prices are validated. If conversion drops sharply, consider keeping a lower price point or introducing a mid-price tier.

### Post-Launch Metrics to Monitor

Track weekly for the first 6 months:

| Metric                                                                                  | Target                 | Warning Signal                                                                         |
| --------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| Free-to-paid conversion rate (at invite gate)                                           | >20%                   | <10% — price or product value mismatch at conversion                                   |
| % converting to Scale vs. Growth                                                        | 15–25% Scale           | >40% Scale — Growth may be missing features; <10% Scale — Scale value prop not landing |
| Monthly churn rate (paid)                                                               | <4%                    | >6% — value or fit mismatch                                                            |
| Seat utilisation at conversion                                                          | >50% of included seats | <25% — teams may be over-buying on Scale                                               |
| Time from free signup to first run completed                                            | <3 days                | >7 days — onboarding problem                                                           |
| Qualitative exit reason at invite gate (free users who see the upgrade modal and leave) | "Not ready / timing"   | "Too expensive" >30% — reconsider $49 price point                                      |
| Annual plan adoption at conversion                                                      | >15%                   | <5% — annual incentive not landing                                                     |

The qualitative exit reason at the invite gate is the most important data point for the "glorified checklist" / price sensitivity question. If free users consistently hit the invite gate, see $49, and leave — that is price sensitivity. If they leave without hitting the gate, or hit the gate and say "I need to think about it," that is a different problem entirely.

---

## Risks and Mitigations

### Risk 1: The Seat Ceiling Creates a Hard Gap Between Growth and Scale

**Scenario**: A 12-person team hits the 10-seat ceiling on Growth and balks at the jump to Scale ($149/month, 40 seats). They feel Growth is too small and Scale is too large and too expensive. They churn.

**Mitigation**: First, measure whether this actually happens before reacting. The 10-to-40 seat gap is a real jump. If data shows teams consistently churning at the seat ceiling rather than upgrading, the options are: (a) expand the Growth seat band to 15, which reduces the jump; (b) add a mid-tier between Growth and Scale (e.g., $89/month, 20 seats); (c) add modest overage to Growth to smooth the ceiling (e.g., up to 5 extra seats at $6/seat before forcing a tier upgrade). Do not pre-optimise this — measure the churn pattern first.

### Risk 2: Free Tier Attracts Non-Target Users

**Scenario**: The free tier attracts solo developers, students, and hobbyists who never intend to invite a team or pay. They generate support load and usage noise without producing signal about the primary ICP.

**Mitigation**: The free tier requires no active support — it is self-serve with documentation only. Non-target users in the free tier cost almost nothing. Monitor the free-to-paid conversion rate and the characteristics of who is converting (company size, industry, job title from the signup form). If free tier signups are overwhelmingly from the negative ICP, consider adding a brief qualifying question at signup ("team size" or "company name") that filters routing — non-ICP users get docs; ICP users get outreach. Do not gate the free tier itself.

### Risk 3: Free Tier Users Never Convert

**Scenario**: Users sign up for the free tier, use it solo indefinitely, and never hit the invite gate. The free tier accumulates users who generate no revenue.

**Mitigation**: The free tier is 1 seat with no team features. Its cost per user is negligible (single-seat org in the DB, minimal storage). Monitor the ratio of free signups to invite gate hits. If fewer than 30% of active free users ever attempt to invite someone within 60 days, the onboarding flow may not be surfacing the collaboration value effectively — adjust the post-run CTA messaging. Solo users who stay on Free indefinitely are acceptable as potential future champions when they change jobs or teams.

### Risk 4: $49 Remains a Barrier After the Free Tier

**Scenario**: Free users experience the product, love the enforcement mechanics, hit the invite gate — and then consistently abandon at $49 rather than converting.

**Diagnosis**: If this pattern appears in data, it means either (a) the users experiencing the free tier are not in the ICP (no budget), or (b) $49 is genuinely too high for the ICP at this stage. Distinguish between these by looking at the company characteristics of abandoning users. If they are pre-seed or solo founders, they are in the negative ICP and the price is not the problem — targeting is. If they are Series A companies with real teams, lower the price. The validation plan's exit survey question at the invite gate is designed to capture this signal.

### Risk 5: Early Bird Price Becomes the Anchor

**Scenario**: Early bird customers at $29/mo tell their network about the price. When the standard $49 price kicks in, new prospects feel they're overpaying relative to what they've heard.

**Mitigation**: Frame early bird explicitly as a limited launch reward, not the "real" price. The pricing page should show the standard price as the primary number with the early bird as a crossed-out discount ("~~$49~~ $29/mo — early bird for first 100 orgs"). This anchors on $49 and frames $29 as a deal, not the baseline. When the cap is reached, the transition feels expected rather than like a price hike.

### Risk 6: Scale Tier Has No Buyers at Launch

**Scenario**: The first 20 paying customers are all on Growth. Scale gets no signups in the first 3 months.

**Mitigation**: Expected and acceptable. Scale is aspirational positioning and a pricing anchor that makes Growth feel like rational value. If Scale remains empty after 6 months, consider whether its compliance-operations features (viewer role, retention controls) should be pulled into Growth to strengthen the Growth conversion argument — then introduce a new Scale tier at a higher price point with the next tier of features (SSO-adjacent, multi-team management, etc.).

---

_This document reflects the pre-PMF phase of NoHotfix. The pricing model is designed to maximise learning and adoption. Key milestones for revision: early bird cap reached (~100 paying orgs), evidence of PMF (20+ customers, <3% monthly churn, organic referrals), and any material shift in competitive positioning. The next iteration of this document should be grounded in real conversion data, not projections._
