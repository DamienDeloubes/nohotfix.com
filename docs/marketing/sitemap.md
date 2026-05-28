# Marketing Website Sitemap — NoHotfix.com

**Product**: NoHotfix
**Date generated**: 2026-05-28
**Framing**: Hybrid — a release-readiness *platform anchored by the gate*. Every conversion and
feature page markets only shipped capability. The forward-looking direction (UAT, Jira, planned
releases) is previewed on **one** surface — the `/platform` page — with expectation-managed language.
**Source documents**: docs/product-vision.md, docs/project-summary.md, docs/project-scope.md, docs/marketing/positioning.md, docs/marketing/messaging.md, docs/marketing/ideal-customer-profile.md, docs/marketing/pricing-model.md, docs/marketing/competitors.md, docs/design/brand-identity.md, docs/design/website-vision.md, docs/design/pages/homepage.md

---

## The argument the site makes

The tools you already use are advisory. Advisory is not good enough. NoHotfix is the **release gate
that holds** — specs don't pass until the evidence does, the go/no-go call is Admin-only and
permanent, and when the decision is made the run is sealed. That enforced gate is the wedge; the
platform grows around it without ever blunting it (Positioning Principle 6).

Every page leads with the **mechanic, not the benefit**, uses the approved vocabulary (gate,
blocked, artifact, sealed, terminal, immutable, run, playbook, go/no-go, enforcement, the record),
and avoids the banned list in `messaging.md`. The product UI is the only imagery.

---

## Site architecture

```
/                                Homepage
/how-it-works                    How It Works — the core loop, end to end
/platform                        Platform — anchored by the gate + where we're going   [NEW]
/features
  /artifact-enforcement          Artifact-Gated Execution (deep feature)
  /go-no-go                      Go/No-Go Decision Gate (deep feature)
  /audit-trail                   Immutable Audit Trail (deep feature)
/use-cases
  /qa-teams                      For QA Teams
  /compliance                    For Compliance-Driven Teams
  /engineering-managers          For Engineering Managers
/pricing                         Pricing
/about                           About
/changelog                       Changelog
/blog                            Blog (SEO inbound)
/docs                            Documentation (external redirect)
/contact                         Talk to us (demo / enterprise / compliance)
/privacy                         Privacy Policy (legal)
/terms                           Terms of Service (legal)
/invite/[token]                  Invite acceptance (functional; app boundary — listed, not marketed)
```

### Navigation model

- **Primary nav** (left → right): logo → How It Works · Features (dropdown) · Use Cases (dropdown) ·
  Platform · Pricing · Changelog → Log in · **Start free**. The "Start free" button is always present
  and never changes.
  - *Features dropdown*: Artifact Enforcement, Go/No-Go Gate, Audit Trail.
  - *Use Cases dropdown*: For QA Teams, For Compliance Teams, For Engineering Managers.
- **Footer columns**:
  - *Product*: How It Works, Artifact Enforcement, Go/No-Go Gate, Audit Trail, Platform
  - *Use Cases*: For QA Teams, For Compliance Teams, For Engineering Managers
  - *Company*: About, Blog, Changelog, Contact
  - *Resources*: Pricing, Documentation, Privacy, Terms
- **Every page** ends with the same final-CTA section — the "Ship it once." closing rhythm.

### What is NOT included (and why)

- **No `/features/uat`, `/features/jira`, or `/features/planned-releases`.** These are next-phase and
  unshipped. Marketing them as features creates expectation debt and softens the enforcement story.
  They are previewed **only** in the clearly-labeled "Where we're going" section of `/platform`,
  never as a current feature. **Add a dedicated `/features/<name>` page the day each one ships** —
  see [product-vision.md](../product-vision.md).
- **No case-studies page** — no customers yet. Add when the first 2–3 stories exist; until then,
  testimonial slots on use-case pages stay reserved.
- **No standalone security page** — address security inline on `/pricing` and in `/docs`. A security
  page now over-engineers the concern without delivering credibility.
- **No careers page** — pre-PMF. Add when hiring.
- **No status page** — link to an external status page (e.g. Statuspage.io) once in production.

### Route reconciliation with shipped code (build state, not marketing)

| Route | Linked from code today | Page exists today |
| --- | --- | --- |
| `/` | nav logo | ✅ built (8 sections) |
| `/how-it-works` | nav, footer | ❌ 404 |
| `/platform` | (to add to nav + footer) | ❌ new |
| `/features/artifact-enforcement` · `/go-no-go` · `/audit-trail` | footer | ❌ 404 |
| `/use-cases/qa-teams` · `/compliance` · `/engineering-managers` | footer | ❌ 404 |
| `/pricing` | nav, footer | ⚠️ stub |
| `/about` | (to add to footer) | ❌ 404 |
| `/changelog` | nav, footer | ❌ 404 |
| `/blog` | footer | ❌ 404 |
| `/docs` | footer | ⚠️ one sparse page |
| `/contact` | PricingSummary (enterprise) | ❌ 404 |
| `/privacy` · `/terms` | footer | ⚠️ stubs |
| `/invite/[token]` | email links | ✅ functional |

> Note: the shipped nav (`Navigation.tsx`) currently renders flat links (How It Works, Features,
> Pricing, Changelog) and the "Features" link points at `/features` with no dropdown or index page.
> When these pages are built, either implement the Features/Use Cases dropdowns above or repoint
> "Features" to a `/features` overview. Building pages is out of scope for this doc.

---

## Page specifications

The format for each page: a summary table (Purpose · Target audience · Primary message · Supporting
messages · Conversion goal) followed by **Key sections (in order)**. Visual/design direction for each
page lives in [website-vision.md](../design/website-vision.md) — this document owns content and IA.

---

### Homepage

| Field | Detail |
| --- | --- |
| **URL** | `/` |
| **Purpose** | Convert QA leads and VP Engineering into Free signups by making the enforcement mechanic viscerally clear in the first scroll, then dismantling the "we already have Notion / TestRail / Jira" and "this looks complex" objections before the final CTA. |
| **Target audience** | QA Lead (primary), VP Engineering (secondary) |
| **Primary message** | The release gate that holds. Specs don't pass until the evidence does. |
| **Supporting messages** | The go/no-go call is Admin-only and permanent. When the decision is made, the run is sealed. Start free — one seat, full enforcement, no credit card. |
| **Conversion goal** | Start free |

**Full design + section spec already exists**: [docs/design/pages/homepage.md](../design/pages/homepage.md). Hero through final CTA are defined there and built in `apps/web`. This sitemap adds **one change**: the platform thread (below). Section order (built): Hero → Pain hook → Three guarantees → How it works (compressed) → Who it's for → Comparison table → Pricing summary → Final CTA.

**The platform thread (new — the only homepage edit this framing requires)**: a single low-weight line that signals NoHotfix is more than one gate, placed between the comparison table and pricing (or as a one-line band under the comparison). It states the platform stance without competing with the enforcement hero and links to `/platform`.

> **Suggested copy**: "Anchored by the gate. Built to grow around it — UAT sign-off, Jira, and
> release-level gating are next." → link: "See where we're going."

Keep the enforcement triad as the hero. The platform line is a thread, never a headline. Do **not**
add unshipped features to the comparison table or the three-guarantees section.

---

### How It Works

| Field | Detail |
| --- | --- |
| **URL** | `/how-it-works` |
| **Purpose** | Walk a prospect through the full core loop — build a playbook to making an immutable go/no-go decision — so they understand exactly what they're adopting before they sign up. |
| **Target audience** | QA Lead (primary), VP Engineering (evaluating) |
| **Primary message** | NoHotfix is a structured release cycle, not a flexible checklist. Build it once, enforce it every time. |
| **Supporting messages** | The playbook is a reusable template. Each run is a frozen snapshot — template edits don't affect runs in progress. The record is locked the moment the decision is made. |
| **Conversion goal** | Start free |

**Key sections (in order)**:

1. **Intro** — One line: "NoHotfix has one job: answer 'are we ready to ship, and can we prove it?' Here is how it does that."
2. **Step 1 — Build a playbook** — The org-wide reusable spec library + playbook templates (sections + specs, drag-and-drop ordering). Screenshot of the playbook editor. Message: build once, run many times.
3. **Step 2 — Declare the evidence** — The six artifact types (file, text, checkbox, URL, measured value, table). Screenshot of a spec with artifact requirements configured. Message: the spec author declares the required evidence; the tester has no path around it.
4. **Step 3 — Start a run** — Snapshot behaviour: starting a run freezes the playbook; later template edits don't touch the in-progress run. Optional section-level pre-assignment at start.
5. **Step 4 — Execute specs** — The run execution UI. Show the **blocked pass action** (pass disabled while an artifact is missing), the artifact input flow, and the spec state machine (Pending → In Progress → Passed/Failed/Skipped).
6. **Step 5 — Make the go/no-go call** — The decision screen: available only when all specs are terminal, Admin-only, specs sorted by severity, mandatory written justification for a Go with failures. Screenshot.
7. **Step 6 — The sealed record** — The completed run in read-only state; three-layer immutability; browser print-to-PDF for auditors. Message: "When the auditor asks, you send them this."
8. **Final CTA** — "Start building your first playbook." → Start free.

---

### Platform  *(new — the single hybrid vision surface)*

| Field | Detail |
| --- | --- |
| **URL** | `/platform` |
| **Purpose** | Late-funnel credibility and strategic narrative. Position NoHotfix as a release-readiness *platform anchored by the gate*, and show where it's going — without presenting unshipped work as available. This is the one place the next-phase vision is allowed to surface. |
| **Target audience** | VP Engineering / Director doing due diligence; compliance and strategic buyers comparing tools and betting on a direction. |
| **Primary message** | A platform anchored by the gate. The enforced release gate is the core — everything we build extends the same promise: ship it once. |
| **Supporting messages** | The gate is shipped and the flagship. UAT sign-off, Jira, and release-level gating extend the same enforced-evidence model. We will never become a generic test-management suite. |
| **Conversion goal** | Start free (primary, low-pressure) / Talk to us (secondary). This is a credibility page, not a hard conversion surface. |

**Key sections (in order)**:

1. **The wedge today** — One paragraph + three compact cards recapping the shipped enforcement triad (Artifact Enforcement, Go/No-Go Gate, Immutable Record), each linking to its feature page. Message: this is real and available now.
2. **The thesis** — The "expand from the wedge" idea, rendered from the pyramid in [product-vision.md](../product-vision.md): *Ship it once* at the apex; the wedge (shipped), the next phase, the later vision below it. Plain statement: the gate is the core; the platform grows around it; every addition serves the same promise.
3. **Where we're going** — Each item **explicitly labeled "On the roadmap · not yet available"**, no dates, no signup gating, no live product screenshots:
   - **UAT sign-off, caught before production too** — author user-acceptance tests and send a partner or client a link to walk them and sign off, on the record. The same evidence-backed testing, extended to the people outside your team who accept the work.
   - **Verification on the ticket they already watch** — Jira integration attaches NoHotfix tests to issues as subtasks, so "it was verified" shows up where the team already lives — without weakening the enforcement underneath.
   - **Release-level gating** — group the runs a release depends on; the release can't be marked shipped until everything attached to it has cleared its go/no-go.
4. **The guardrail** — A short, confident statement of Positioning Principle 6: breadth must never blunt the wedge; we are not chasing TestRail's feature surface; every expansion answers "how does this help you catch it before production?" — if it doesn't, it doesn't ship.
5. **Final CTA** — "Ship it once." → Start free / Talk to us.

**Hard rule for this page**: roadmap items are described in the future and styled as future (see the
platform-page note in website-vision.md). Nothing here may read as a current, available feature.

---

### Features — Artifact-Gated Execution

| Field | Detail |
| --- | --- |
| **URL** | `/features/artifact-enforcement` |
| **Purpose** | Convert visitors who are specifically checking whether the enforcement is real — not advisory, not configurable to be bypassed — by showing the mechanics in detail. |
| **Target audience** | QA Lead (primary), compliance buyer (secondary) |
| **Primary message** | The pass action is blocked. Not warned. Blocked — until the required artifact is attached. |
| **Supporting messages** | Six evidence types cover every scenario a QA team encounters. Requirements are configured per spec by the author. Everything locks when the decision is made. |
| **Conversion goal** | Start free |

**Key sections (in order)**:

1. **Hero statement** — "No artifact, no pass. Full stop." One paragraph on the mechanic.
2. **The six artifact types** — For each: name, one-line description, primary use. File (screenshots, scan outputs), Text (log output, observed errors), Checkbox (explicit confirmation), URL (CI pipelines, deployment links), Measured value (API response times, error rates), Structured table (browser matrix, load-time tables).
3. **How enforcement works** — Three steps: author configures requirements → tester executes and submits evidence → the system unblocks the pass action. Show the blocked state clearly.
4. **What gets locked** — When the go/no-go decision is recorded, every artifact and the run record lock. Show the active → sealed transition.
5. **Final CTA** — "See it in action." → Start free.

---

### Features — Go/No-Go Decision Gate

| Field | Detail |
| --- | --- |
| **URL** | `/features/go-no-go` |
| **Purpose** | Convince VP Engineering and QA Directors that go/no-go is the formal, documented decision they've been missing — a governance mechanism, not just a UI affordance. |
| **Target audience** | VP Engineering (primary), QA Director (secondary) |
| **Primary message** | One screen. One Admin. Every spec outcome visible before the call is made. The decision is permanent. |
| **Supporting messages** | Only Admins can make the call, and only after all specs are terminal. A Go with failures requires written justification, recorded permanently. Specs are sorted by severity. |
| **Conversion goal** | Start free |

**Key sections (in order)**:

1. **Hero statement** — "The release decision, made once and locked."
2. **What the decision screen shows** — Full spec list sorted by severity; out-of-tolerance measured-value warnings; failed specs flagged; the Go / No-Go action with a mandatory justification field for a Go with failures.
3. **Role gating** — Only Admins decide; the screen is inaccessible until every spec is terminal. Why: the decision is a formal accountability act, not a convenience.
4. **The justification requirement** — The mandatory written justification for a Go with failures; show the input; explain it's recorded permanently in the audit trail.
5. **After the decision** — The run is sealed; the team is notified by email; the record is available in run history.
6. **Final CTA** — Start free.

---

### Features — Immutable Audit Trail

| Field | Detail |
| --- | --- |
| **URL** | `/features/audit-trail` |
| **Purpose** | Speak to compliance buyers and engineering managers who've been through a painful audit-evidence reconstruction. Make the case that NoHotfix eliminates that exercise entirely. |
| **Target audience** | Compliance buyer (primary), QA Director (secondary) |
| **Primary message** | When the go/no-go call is made, the run is sealed. Nothing in it can be edited. Send the URL. |
| **Supporting messages** | No reconstruction. No chasing screenshots. The record exists from the moment the run started and can't be altered after the decision. |
| **Conversion goal** | Talk to us (primary for compliance buyers) / Start free (secondary) |

**Key sections (in order)**:

1. **Hero statement** — "The record is sealed when the call is made."
2. **What the record contains** — Full spec list with outcomes; per-spec artifact rendering (inline images, log text, URLs, measured-value comparisons, table data); the go/no-go decision with decider identity, timestamp, and justification; section-level skip reasons.
3. **Three-layer immutability** — API middleware (no edit endpoints for completed runs), service-layer state machine (rejects mutations), DB-level constraints. Don't hide the technical detail — the audience reads like engineers.
4. **Print-to-PDF for auditors** — A print-friendly layout; browser print-to-PDF produces a compliance-ready document. Describe what that document contains.
5. **Compliance context** — SOC2, PCI-DSS, HIPAA-adjacent teams need evidence of testing; NoHotfix produces it as a natural output of running the release process. No certification claims NoHotfix hasn't earned.
6. **Final CTA** — Talk to us (primary) and Start free (secondary).

---

### Use Cases — For QA Teams

| Field | Detail |
| --- | --- |
| **URL** | `/use-cases/qa-teams` |
| **Purpose** | Speak to QA leads in the language of their daily reality — testers skipping steps, missing screenshots, inconsistency across the team — and show exactly how NoHotfix addresses each. |
| **Target audience** | QA Lead / Senior QA Engineer |
| **Primary message** | Stop chasing testers for screenshots. The screenshot gets attached before the spec passes — the system enforces it, you don't have to. |
| **Supporting messages** | A reusable spec library makes your process consistent across every tester. The record exists before anyone asks for it. Live in an afternoon, not a quarter. |
| **Conversion goal** | Start free |

**Key sections (in order)**:

1. **Pain acknowledgment** — "Testers mark specs as passed without running them." "Screenshots get uploaded after the fact — or not at all." "New team members don't know the full checklist." "An auditor asks for evidence and you spend days reconstructing it."
2. **How NoHotfix addresses each** — Matched pairs: each pain + the specific mechanic that resolves it.
3. **The spec library** — Reusable specs: write once, use across every playbook; sync when the library changes; new members run the same spec as veterans.
4. **The enforcement mechanic, in QA terms** — "You configured the artifact requirements. The system enforces them. You don't chase."
5. **Adoption speed** — Live in an afternoon; first playbook in under an hour; no implementation project, no dedicated admin.
6. **Testimonial slot** — Reserved for a QA-lead quote (add at first paying customer).
7. **Final CTA** — "Start building your spec library." → Start free.

---

### Use Cases — For Compliance-Driven Teams

| Field | Detail |
| --- | --- |
| **URL** | `/use-cases/compliance` |
| **Purpose** | Convert engineering/QA leaders at SOC2 / PCI-DSS / HIPAA-adjacent companies looking for a tool that produces audit-grade evidence as a natural output of the release process. |
| **Target audience** | Compliance buyer (QA Director, VP Engineering at regulated-sector SaaS) |
| **Primary message** | Your release runs become auditable artifacts, automatically. |
| **Supporting messages** | Tamper-evident by design. No reconstruction required. Send the auditor the record URL. |
| **Conversion goal** | Talk to us |

**Key sections (in order)**:

1. **The compliance problem** — "Three days before the audit closes, your team is going through Slack threads and Jira tickets to assemble evidence of testing from six months ago."
2. **What NoHotfix produces** — Each record: spec outcomes, submitted artifacts (screenshots, logs, measurements), the go/no-go decision with decider identity and timestamp, justification for any Go with failures, section-level skip reasons.
3. **Immutability** — The record can't be altered after the decision. This is the tamper-evidence that makes it credible to an auditor.
4. **Relevant frameworks** — SOC2, PCI-DSS, HIPAA-adjacent: a brief, non-prescriptive statement of how NoHotfix evidence maps to testing-evidence requirements. No certification claims not yet earned.
5. **Plans for compliance teams** — Link to pricing. Audit-grade export (PDF / structured JSON) is available from **Growth**. **Scale** adds the compliance-operations layer (viewer role for auditors, retention controls, uptime SLA — post-launch) plus up to 40 seats and faster support.
6. **Final CTA** — Talk to us (primary), Start free (secondary).

---

### Use Cases — For Engineering Managers

| Field | Detail |
| --- | --- |
| **URL** | `/use-cases/engineering-managers` |
| **Purpose** | Speak to VP Engineering / Engineering Managers — the buyer and decision-maker, not the daily user — and frame go/no-go as the governance mechanism they've been operating without. |
| **Target audience** | VP Engineering / Engineering Manager |
| **Primary message** | Know your release is ready before you ship — and prove it if anyone ever asks. |
| **Supporting messages** | The go/no-go decision is formal, documented, and permanent. The record includes what every tester submitted, what failed, and what you knew before you shipped. |
| **Conversion goal** | Start free / Talk to us |

**Key sections (in order)**:

1. **Pain framing** — "You make the go/no-go call in a Slack thread. You trust the QA lead's spreadsheet is current. If something goes wrong, there's no record of what you collectively knew before you shipped."
2. **The decision screen** — Show the go/no-go interface; role-gating (Admin only); specs-by-severity; mandatory justification for a Go with failures.
3. **Accountability without micromanagement** — The enforcement mechanic holds testers accountable without requiring the manager to chase. The process enforces itself.
4. **Team-level visibility** — The dashboard shows active runs across the team; run history is filterable; a single consolidated view of any run at any time.
5. **Final CTA** — Start free.

---

### Pricing

| Field | Detail |
| --- | --- |
| **URL** | `/pricing` |
| **Purpose** | Convert visitors ready to evaluate commitment — by making the model simple, the free tier compelling, and the upgrade trigger clear. |
| **Target audience** | All three personas, at different readiness levels |
| **Primary message** | Start free. Pay when you invite your team. |
| **Supporting messages** | Seat-banded tiers with a permanent Free tier — no per-seat overage (hit a tier's seat ceiling and you upgrade). Early-bird pricing for the first 100 organisations, locked for life. The enforcement triad is on every tier, including Free. |
| **Conversion goal** | Start free (Free) / Start free then upgrade (Growth, Scale) / Talk to us (Enterprise) |

**Key sections (in order)**:

1. **Section headline** — "The enforcement triad is free. Seats are what you pay for."
2. **Tier table** — Free (1 seat) · Growth (≤10 seats, $29 early bird / $49 standard) · Scale (≤40 seats, $99 / $149) · Enterprise (custom). Annual −20% on paid tiers. Early-bird labeled prominently; **anchor copy on the standard price** and frame early bird as the saving.
3. **Feature-gate matrix** — Honest: the enforcement triad (artifact gating, go/no-go, immutability) is on every tier including Free. Differentiators are seats, audit-grade export (from Growth), and — at Scale — the compliance-operations layer (viewer role, retention controls, uptime SLA).
4. **FAQ — "Why is Free actually free?"** — Free is a solo evaluation lane: full enforcement, one seat. The moment you invite a teammate, you move to Growth (the invite gate).
5. **FAQ — "What happens to my data if I downgrade?"** — Address retention directly.
6. **FAQ — "Is the early-bird price locked forever?"** — Yes. First 100 paying orgs, grandfathered via Stripe price object.
7. **FAQ — security & data handling** — Brief inline answer (this is where security questions live; no standalone security page).
8. **Enterprise** — "Need 40+ seats, SSO, or custom data residency? Let's talk." → `/contact`.

---

### About

| Field | Detail |
| --- | --- |
| **URL** | `/about` |
| **Purpose** | Give evaluating buyers — especially at compliance-sensitive companies — confidence that NoHotfix is a real product built by people who understand the problem. |
| **Target audience** | Compliance buyers and VP Engineering in late-stage evaluation |
| **Primary message** | Built by engineers who've managed releases with informal checklists and lived the failure modes. |
| **Supporting messages** | We solve the exact problem we hit ourselves. We run our own releases through NoHotfix before asking anyone else to. |
| **Conversion goal** | Start free |

**Key sections (in order)**:

1. **Founding story** — The problem we experienced; why existing tools didn't solve it; what we built and why.
2. **The internal-validation principle** — "Before we ask anyone else to use NoHotfix, we use it to manage our own releases." A specific, verifiable credibility statement.
3. **Team** — Founder(s), brief bios. No fabricated team, no stock photos.
4. **Contact** — Link to `/contact`.

---

### Changelog

| Field | Detail |
| --- | --- |
| **URL** | `/changelog` |
| **Purpose** | Build credibility and momentum by showing the product is actively developed; give existing users a reason to return. |
| **Target audience** | Existing users (retention), evaluating prospects (credibility) |
| **Primary message** | NoHotfix ships regularly. Here's what's new. |
| **Supporting messages** | Each entry is concrete and specific — no vague "improvements." |
| **Conversion goal** | None direct — trust and credibility builder |

**Key sections (in order)**:

1. **Entries** — Reverse-chronological; each entry: date, optional version/release name, what changed, why it matters. **Do not launch this page empty** — publish only when there's something real.
2. **Subscribe** — Single-field email capture: "Get notified when NoHotfix ships something new."

> The changelog is also where shipped next-phase features (UAT, Jira, release-level gating) first
> graduate from the `/platform` roadmap into reality — at which point their `/features/<name>` page
> is built and the roadmap entry on `/platform` is replaced with a live link.

---

### Blog

| Field | Detail |
| --- | --- |
| **URL** | `/blog` |
| **Purpose** | Build SEO-driven inbound from QA leads and engineering managers searching for release-checklist workflows, go/no-go processes, and compliance-evidence tooling. |
| **Target audience** | QA Lead (primary SEO target), VP Engineering |
| **Primary message** | Practical thinking on release readiness, testing workflows, and compliance evidence. |
| **Supporting messages** | No generic content marketing — every post addresses a specific ICP pain. |
| **Conversion goal** | Start free (inline CTAs) |

**Key sections (in order)**:

1. **Post list** — Reverse-chronological; each: title, date, reading time, brief description.
2. **Inline CTAs** — One contextual CTA per post (e.g. a SOC2-evidence post ends with "NoHotfix produces this evidence as a natural output of your release process. Start free.").

**Launch post ideas (SEO-driven)**:

- "Why your Notion release checklist isn't good enough (and what to do instead)"
- "How to prepare release-testing evidence for a SOC2 audit"
- "Go/no-go decisions: how to make the release call formally and document it"
- "Test management vs. release readiness: the difference that matters"

---

### Documentation

| Field | Detail |
| --- | --- |
| **URL** | `/docs` (redirects to external docs site) |
| **Purpose** | Give evaluators and new users a self-serve path to set up and use NoHotfix without a sales conversation. |
| **Target audience** | QA Lead (self-serve evaluator), new users post-signup |
| **Primary message** | Everything you need to get your first playbook running. |
| **Supporting messages** | Start with the quickstart. Reference the spec-configuration guide for artifact types. |
| **Conversion goal** | Start free (for evaluators reading before signing up) |

**Note**: Documentation is a separate product (GitBook / Mintlify / custom). The `/docs` path
redirects to it — do not build docs inside the marketing site.

**Minimum content for launch**: quickstart (create org → build playbook → start a run → make the
go/no-go call); spec-configuration guide (all six artifact types with examples); pricing & billing
FAQ; roles & permissions.

---

### Contact

| Field | Detail |
| --- | --- |
| **URL** | `/contact` |
| **Purpose** | Capture demo requests, enterprise inquiries, and compliance-buyer conversations that don't convert self-serve. The "Talk to us" / "Book a demo" destination referenced across the site. |
| **Target audience** | Compliance buyers, enterprise prospects (40+ seats, SSO, data residency), agencies |
| **Primary message** | Talk to the people who built the gate. |
| **Supporting messages** | For 40+ seats, SSO, custom data residency, or a walkthrough for your compliance team. |
| **Conversion goal** | Submit inquiry / book a demo |

**Key sections (in order)**:

1. **Short form** — Name, work email, company, team size, one free-text field. Keep it minimal.
2. **What to expect** — Who replies and roughly when. No false urgency.
3. **Self-serve nudge** — "Just want to try it? Start free — no call required." → Start free.

---

### Legal — Privacy & Terms

| Field | Detail |
| --- | --- |
| **URLs** | `/privacy`, `/terms` |
| **Purpose** | Standard legal pages; required for trust, signup, and procurement at compliance-sensitive buyers. |
| **Target audience** | Procurement, legal, security reviewers |
| **Primary message** | n/a (legal content) |
| **Conversion goal** | None |

Plain, readable legal copy. Linked from the footer. Not marketing surfaces — keep them factual and
current.

---

### Invite acceptance *(app boundary — listed for completeness)*

| Field | Detail |
| --- | --- |
| **URL** | `/invite/[token]` |
| **Purpose** | Token-based invite acceptance — the entry point for an invited teammate (the moment the inviting org crosses the Free→Growth invite gate). |
| **Target audience** | Invited team member |
| **Conversion goal** | Accept invite → join org |

This is a functional product surface, not a marketed page. Listed so the route inventory is complete.
Its design follows the app, not the marketing-page patterns above.

---

## Changelog

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-05-28 | Rebuilt from scratch after the prior wedge-only sitemap was retired. Hybrid framing: platform-anchored narrative, conversion/feature pages market only shipped capability, next-phase vision confined to the new `/platform` page. Added `/platform`, `/about`, `/contact`, and legal pages; defined nav/footer model and route reconciliation with shipped code. |
