# Marketing Website Sitemap — NoHotfix.com

**Product**: NoHotfix
**Date generated**: 2026-03-10 (rebranded 2026-03-11)
**Source documents**: docs/project-summary.md, docs/project-scope.md, docs/marketing/pricing-model.md, docs/marketing/competitors.md, docs/marketing/ideal-customer-profile.md, docs/design/brand-identity.md, docs/marketing/positioning.md, docs/marketing/messaging.md

---

## Site Architecture

```
/                          Homepage
/how-it-works              How It Works (core loop walkthrough)
/features
  /artifact-enforcement    Artifact-Gated Execution (deep feature page)
  /go-no-go                Go/No-Go Decision Gate (deep feature page)
  /audit-trail             Immutable Audit Trail (deep feature page)
/use-cases
  /qa-teams                For QA Teams
  /compliance              For Compliance-Driven Teams
  /engineering-managers    For Engineering Managers
/pricing                   Pricing
/changelog                 Changelog
/docs                      Documentation (external, linked to docs site)
/blog                      Blog
/about                     About
```

**What is NOT included and why**:

- No integrations page — NoHotfix has no integrations in v1. Adding a page for planned integrations is aspirational marketing that creates expectation debt.
- No case studies page — no customers yet. Add when the first 2–3 customer stories exist.
- No security page — address security questions inline on pricing and in docs. A standalone security page at this stage over-engineers the concern without delivering credibility.
- No careers page — pre-PMF. Add when hiring.
- No status page — link to an external status page (e.g. Statuspage.io) when the product is in production.

---

## Page Specifications

---

### Homepage

| Field                   | Detail                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | Homepage                                                                                                                                                  |
| **URL path**            | `/`                                                                                                                                                       |
| **Purpose**             | Convert engineering managers and QA leads who land on the site into free signups by making the enforcement mechanic viscerally clear in the first scroll. |
| **Target audience**     | QA Lead (primary), VP Engineering (secondary)                                                                                                             |
| **Primary message**     | Watch every release land. Your team can't mark a spec as passed without the evidence.                                                                     |
| **Supporting messages** | The go/no-go decision is permanent. The audit record writes itself. Start free — no credit card, no time limit on the Free plan.                          |
| **Conversion goal**     | Start free (sign up for Free tier)                                                                                                                        |

**Key sections (in order)**:

1. **Hero** — Headline: "Watch every release land." Subheadline: 2-sentence supporting value prop (enforcement mechanic + audit record). Primary CTA: "Start free". Secondary CTA: "See how it works". Dark-mode full-bleed background with a product screenshot or animated UI showing a blocked pass action (spec with missing artifact = pass button disabled).

2. **Pain hook** — A Notion checklist screenshot or minimal illustration with caption: "This can be checked off without evidence. NoHotfix can't." No body copy. The contrast does the work.

3. **The three guarantees** — Three columns, each corresponding to a messaging pillar:
   - "Specs don't pass until the evidence does." (Artifact enforcement)
   - "One screen. One decision. The record is sealed." (Go/no-go gate)
   - "After the decision, nothing changes." (Run immutability)
     Each with a short supporting sentence and a product UI screenshot.

4. **How it works (compressed)** — 4-step visual walkthrough: Build a playbook → Start a run → Execute specs with evidence → Make the go/no-go call. Links to `/how-it-works` for the full explanation.

5. **Who it's for** — Two cards: "For QA teams" and "For compliance-driven engineering orgs." Each card has a 2-sentence persona-specific pain statement and a link to the relevant use case page.

6. **Comparison row** — A minimal feature matrix: NoHotfix vs. Notion vs. TestRail vs. Jira. Five dimensions: enforced artifacts, role-gated approval, immutable record, release-centric UX, lightweight adoption. NoHotfix is the only tool that scores yes across all five.

7. **Pricing summary** — Three tiers: Free, Growth ($29/mo early bird), Scale ($99/mo early bird). Brief tier descriptions. CTA: "See full pricing."

8. **Final CTA** — "Start for free. No credit card required." Single button.

---

### How It Works

| Field                   | Detail                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | How It Works                                                                                                                                                                          |
| **URL path**            | `/how-it-works`                                                                                                                                                                       |
| **Purpose**             | Walk a prospect through the full core loop — from building a playbook to making an immutable go/no-go decision — so they understand exactly what they are buying before they sign up. |
| **Target audience**     | QA Lead (primary), VP Engineering (evaluating)                                                                                                                                        |
| **Primary message**     | NoHotfix is a structured release cycle, not a flexible checklist. Build it once, enforce it every time.                                                                               |
| **Supporting messages** | The playbook is a reusable template. Each run is a frozen snapshot — changes to the template do not affect in-progress runs. The record is locked the moment the decision is made.    |
| **Conversion goal**     | Start free                                                                                                                                                                            |

**Key sections (in order)**:

1. **Section intro** — One sentence: "NoHotfix has one job: answer 'are we ready to ship, and can we prove it?' Here is how it does that."

2. **Step 1 — Build a playbook** — Describe the Spec Library (org-wide, reusable specs) and playbook templates (sections + specs with drag-and-drop ordering). Show a screenshot of the playbook editor. Emphasise: playbooks are reusable. Build once, run many times.

3. **Step 2 — Configure artifact requirements** — Explain the six artifact types (file, text, checkbox, URL, measured value, table). Show a screenshot of a spec with artifact requirements configured. Key message: the spec author declares what evidence is required. The tester has no choice but to provide it.

4. **Step 3 — Start a run** — Describe snapshot behaviour: when a run starts, the playbook is frozen. Subsequent template edits do not affect the in-progress run. Optional: pre-assign sections to testers at run start.

5. **Step 4 — Execute specs** — Describe the run execution UI. Show the blocked pass action (pass button disabled with missing artifacts). Show the artifact upload / input flow. Show spec state transitions (Pending → In Progress → Passed/Failed/Skipped).

6. **Step 5 — Make the go/no-go decision** — Describe the decision screen: only accessible when all specs are terminal, Admin-only, specs sorted by severity, mandatory justification for Go with failures. Show a screenshot of the decision screen.

7. **Step 6 — The immutable record** — Show the completed run in read-only state. Explain tamper-evidence and the print-to-PDF path for auditors. Key message: "When the auditor asks, you send them this."

8. **CTA** — "Start building your first playbook" → sign up.

---

### Features — Artifact-Gated Execution

| Field                   | Detail                                                                                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | Artifact Enforcement                                                                                                                                                          |
| **URL path**            | `/features/artifact-enforcement`                                                                                                                                              |
| **Purpose**             | Convert visitors who are specifically evaluating whether NoHotfix's enforcement is real — not advisory, not configurable to be bypassed — by showing the mechanics in detail. |
| **Target audience**     | QA Lead (primary), compliance buyer (secondary)                                                                                                                               |
| **Primary message**     | The pass action is blocked. Not warned. Not reminded. Blocked.                                                                                                                |
| **Supporting messages** | Six evidence types cover every scenario your QA team encounters. Requirements are configured per spec by the author. Everything locks when the decision is made.              |
| **Conversion goal**     | Start free                                                                                                                                                                    |

**Key sections (in order)**:

1. **Hero statement** — "Specs don't pass until the evidence does." One paragraph explaining the mechanic.

2. **The six artifact types** — Grid or list. For each type: name, one-sentence description, primary use cases. File (screenshots, scan outputs), Text (log output, observed errors), Checkbox (explicit confirmations), URL (CI pipelines, deployment links), Measured Value (API response times, error rates), Table (browser compatibility matrix, API load times table).

3. **How enforcement works** — Three-step visual: spec author configures requirements → tester executes and submits evidence → system validates and unlocks the pass action. Show the blocked state clearly.

4. **What gets locked** — When the go/no-go decision is recorded: all artifacts lock, the run record locks. Show the transition from active to immutable.

5. **CTA** — "See it in action" → start free.

---

### Features — Go/No-Go Decision Gate

| Field                   | Detail                                                                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | Go/No-Go Decision Gate                                                                                                                                                                   |
| **URL path**            | `/features/go-no-go`                                                                                                                                                                     |
| **Purpose**             | Convince VP Engineering and QA Directors that the go/no-go flow is the formal, documented decision process they have been missing — not just a UI affordance but a governance mechanism. |
| **Target audience**     | VP Engineering (primary), QA Director (secondary)                                                                                                                                        |
| **Primary message**     | The release decision is a formal act. One screen. Every outcome visible. The record is permanent.                                                                                        |
| **Supporting messages** | Only Admins can make the call. A Go with failures requires written justification. The decision and justification are part of the audit record.                                           |
| **Conversion goal**     | Start free                                                                                                                                                                               |

**Key sections (in order)**:

1. **Hero statement** — "Locked on. One screen. Every factor visible. When the Admin makes the call, the record is sealed."

2. **What the decision screen shows** — Full spec list sorted by severity. Out-of-tolerance measurement warnings. Failed specs flagged. The decision action (Go / No-Go) with mandatory justification field for Go with failures.

3. **Role gating** — Only Admins can make the go/no-go decision. The decision screen is inaccessible until all specs are in a terminal state. Explain why: the decision is a formal accountability act, not a convenience.

4. **The justification requirement** — Explain the mandatory written justification for Go with failures. Show the input UI. Explain that this justification is permanently recorded and rendered in the audit trail.

5. **What happens after the decision** — Run is locked. Team is notified by email. Completed run record is available in Run History.

6. **CTA** — "Start free" → sign up.

---

### Features — Immutable Audit Trail

| Field                   | Detail                                                                                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | Immutable Audit Trail                                                                                                                                                                               |
| **URL path**            | `/features/audit-trail`                                                                                                                                                                             |
| **Purpose**             | Speak directly to compliance buyers and engineering managers who have been through a painful audit evidence reconstruction exercise. Make the case that NoHotfix eliminates that exercise entirely. |
| **Target audience**     | Compliance buyer (primary), QA Director (secondary)                                                                                                                                                 |
| **Primary message**     | When the auditor asks for evidence of testing, you send them the run record. That's it.                                                                                                             |
| **Supporting messages** | No reconstruction. No chasing screenshots. No memory. The record exists from the moment the run started. It cannot be altered after the decision is made.                                           |
| **Conversion goal**     | Book a demo (compliance buyers often need a conversation before committing)                                                                                                                         |

**Key sections (in order)**:

1. **Hero statement** — "After the decision, nothing changes. No edits. No overwrites. Just the record of what happened."

2. **What the record contains** — Full spec list with outcomes. Per-spec artifact rendering: inline images, log text, URLs, measured value comparisons, table data. The go/no-go decision with decider identity, timestamp, and justification (if applicable). Section-level skip reasons.

3. **Three-layer immutability** — Brief, technical explanation: API middleware (no edit endpoints for completed runs), service-layer state machine (rejects mutations), planned DB-level constraints. This is for the technical reader who will ask "how do you enforce this?" Don't hide the technical detail — the audience reads like engineers.

4. **Print-to-PDF for auditors** — Print-friendly layout. Browser print-to-PDF produces a compliance-ready document. Describe what that document contains.

5. **Compliance context** — SOC2, PCI-DSS, HIPAA-adjacent: teams in these programmes need evidence of testing. NoHotfix produces that evidence as a natural output of running the release process.

6. **CTA** — "Book a demo" (primary for compliance buyers) and "Start free" (secondary for self-serve).

---

### Use Cases — For QA Teams

| Field                   | Detail                                                                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | For QA Teams                                                                                                                                                                                                                          |
| **URL path**            | `/use-cases/qa-teams`                                                                                                                                                                                                                 |
| **Purpose**             | Speak directly to QA leads and senior QA engineers in the language of their daily reality — testers skipping steps, missing screenshots, inconsistency across team members — and show exactly how NoHotfix addresses each pain point. |
| **Target audience**     | QA Lead / Senior QA Engineer                                                                                                                                                                                                          |
| **Primary message**     | Stop chasing testers for screenshots. Make it impossible to close a spec without evidence.                                                                                                                                            |
| **Supporting messages** | Reusable spec library means your process is consistent across every tester. The run record exists before anyone asks for it. Adopt in a day — not a quarter.                                                                          |
| **Conversion goal**     | Start free                                                                                                                                                                                                                            |

**Key sections (in order)**:

1. **Pain acknowledgment** — 3-4 bullet points of QA-specific pain: "Testers mark specs as passed without running them." "Screenshots get uploaded after the fact — or not at all." "New team members don't know the full checklist." "Compliance auditors ask for evidence and you spend days reconstructing it."

2. **How NoHotfix addresses each pain** — Matched pairs: each pain point + the specific NoHotfix mechanic that resolves it.

3. **The spec library** — Explain reusable specs: write once, use across every playbook. Specs can be synced when the library version changes. New team members run the same spec as veterans.

4. **The artifact enforcement mechanic** — Repeat the core enforcement message in QA-specific language: "You configured the artifact requirements. The system enforces them. You don't have to chase."

5. **Adoption speed** — "Adoptable in a day. Your first playbook in under an hour." No implementation project, no dedicated admin, no training programme required.

6. **Testimonial placeholder** — Reserve space for a QA lead testimonial (add at first paying customer).

7. **CTA** — "Start building your spec library" → sign up.

---

### Use Cases — For Compliance-Driven Teams

| Field                   | Detail                                                                                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | For Compliance-Driven Teams                                                                                                                                                                                       |
| **URL path**            | `/use-cases/compliance`                                                                                                                                                                                           |
| **Purpose**             | Convert engineering and QA leaders at SOC2 / PCI-DSS / HIPAA-adjacent companies who are specifically looking for a tool that produces audit-grade evidence of testing as a natural output of the release process. |
| **Target audience**     | Compliance buyer (QA Director, VP Engineering at regulated sector SaaS)                                                                                                                                           |
| **Primary message**     | Your release runs become auditable artifacts, automatically.                                                                                                                                                      |
| **Supporting messages** | Tamper-evident by design. No reconstruction required. Send the auditor the run record URL.                                                                                                                        |
| **Conversion goal**     | Book a demo                                                                                                                                                                                                       |

**Key sections (in order)**:

1. **The compliance problem** — Describe the audit evidence reconstruction exercise: "Three days before the audit closes, your team is going through Slack threads and Jira tickets to assemble evidence of testing from six months ago."

2. **What NoHotfix produces** — Each run record contains: spec outcomes, submitted artifacts (screenshots, logs, measurements), go/no-go decision with decider identity and timestamp, written justification for any Go with failures, section-level skip reasons.

3. **Immutability** — The record cannot be altered after the decision. This is the tamper-evidence property that makes the record credible to an auditor.

4. **Relevant compliance frameworks** — SOC2, PCI-DSS, HIPAA-adjacent: brief, non-prescriptive statement about how NoHotfix evidence maps to testing evidence requirements in these frameworks. Do not make compliance certification claims NoHotfix hasn't earned.

5. **Scale tier for compliance teams** — Link to pricing. Scale tier includes audit-grade export (PDF / structured JSON), up to 40 seats, 1-day SLA.

6. **CTA** — "Book a demo" (primary) and "Start free" (secondary).

---

### Use Cases — For Engineering Managers

| Field                   | Detail                                                                                                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | For Engineering Managers                                                                                                                                                                                        |
| **URL path**            | `/use-cases/engineering-managers`                                                                                                                                                                               |
| **Purpose**             | Speak to VP Engineering and Engineering Managers who are the buyer and decision-maker — not the daily user — and frame the go/no-go decision gate as the governance mechanism they have been operating without. |
| **Target audience**     | VP Engineering / Engineering Manager                                                                                                                                                                            |
| **Primary message**     | Know your release is ready before you ship — and prove it if anyone ever asks.                                                                                                                                  |
| **Supporting messages** | The go/no-go decision is formal, documented, and permanent. The record includes what every tester submitted, what failed, and what you knew before you shipped.                                                 |
| **Conversion goal**     | Start free / Book demo                                                                                                                                                                                          |

**Key sections (in order)**:

1. **Pain framing** — "You make the go/no-go call in a Slack thread. You trust that the QA lead's spreadsheet is current. If something goes wrong, there is no record of what you collectively knew before you shipped."

2. **The decision screen** — Show the go/no-go decision interface. Explain role-gating (Admin only), the specs-by-severity sort, the mandatory justification for Go with failures.

3. **Accountability without micromanagement** — The artifact enforcement mechanic holds testers accountable without requiring the manager to chase them. The process enforces itself.

4. **Team-level visibility** — Dashboard shows active runs across the team. Run history is filterable. The VP Engineering has an overhead view of the state of any run at any time.

5. **CTA** — "Start free" → sign up.

---

### Pricing

| Field                   | Detail                                                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | Pricing                                                                                                                                                                                |
| **URL path**            | `/pricing`                                                                                                                                                                             |
| **Purpose**             | Convert visitors who are ready to evaluate commitment — by making the pricing model simple, the free tier compelling, and the upgrade triggers clear.                                  |
| **Target audience**     | All three personas (at different conversion readiness levels)                                                                                                                          |
| **Primary message**     | Start free. Pay when you invite your team.                                                                                                                                             |
| **Supporting messages** | Flat monthly fee per team — no per-seat overage. Early bird pricing for the first 100 organisations, locked for life. The enforcement triad is available on every tier including Free. |
| **Conversion goal**     | Start free (Free tier) / Start free and upgrade (Growth / Scale)                                                                                                                       |

**Key sections (in order)**:

1. **Tier table** — Three tiers (Free, Growth, Scale) plus Enterprise. Each tier: price, seat count, key inclusions, CTA. Early bird pricing prominently labeled. Annual discount available on Growth and Scale (post-early-bird).

2. **Feature gate matrix** — What each tier includes. Keep it honest: the enforcement triad (artifact gating, go/no-go decision, run immutability) is present on every tier including Free. The differentiators between tiers are seats and audit-grade export.

3. **FAQ — "Why is Free actually free?"** — Explain: Free is a solo evaluation lane. Full enforcement mechanics, 1 seat. The moment you want to invite a teammate, you move to Growth.

4. **FAQ — "What happens to my data if I downgrade?"** — Address data retention concern directly.

5. **FAQ — "Is the early bird price locked forever?"** — Yes. First 100 paying orgs. Grandfathered via Stripe price object.

6. **Enterprise contact** — "Need 40+ seats, SSO, or custom data residency? Let's talk." → contact form or email.

7. **Anchor frame** — "One failed compliance audit costs more than years of NoHotfix." Optional but effective for compliance buyers on the fence.

---

### Changelog

| Field                   | Detail                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Page name**           | Changelog                                                                                                                                  |
| **URL path**            | `/changelog`                                                                                                                               |
| **Purpose**             | Build credibility and momentum by showing the product is actively developed. Give existing users a reason to return to the marketing site. |
| **Target audience**     | Existing users (retention) and evaluating prospects (credibility)                                                                          |
| **Primary message**     | NoHotfix ships regularly. Here's what's new.                                                                                               |
| **Supporting messages** | Each entry is concrete and specific — no vague "improvements."                                                                             |
| **Conversion goal**     | No direct conversion goal — trust and credibility builder                                                                                  |

**Key sections (in order)**:

1. **Changelog entries** — Reverse-chronological. Each entry: date, version or release name (optional), what changed, and a brief explanation of why it matters. No entries before there is something real to publish. Do not launch the changelog page empty.

2. **Subscribe to updates** — Email capture: "Get notified when NoHotfix ships something new." Simple single-field form.

---

### Documentation

| Field                   | Detail                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | Documentation                                                                                                                            |
| **URL path**            | `/docs` (redirects to external docs site)                                                                                                |
| **Purpose**             | Give evaluating prospects and existing users a path to understand how to set up and use NoHotfix without requiring a sales conversation. |
| **Target audience**     | QA Lead (self-serve evaluator), new users post-signup                                                                                    |
| **Primary message**     | Everything you need to get your first playbook running.                                                                                  |
| **Supporting messages** | Start with the quickstart. Reference the spec configuration guide for artifact types.                                                    |
| **Conversion goal**     | Start free (for evaluators reading docs before signing up)                                                                               |

**Note**: Documentation is an external product (e.g., GitBook, Mintlify, or custom Next.js docs). The `/docs` path on the marketing site should redirect to the docs URL. Do not build documentation inside the marketing site.

**Minimum content for launch**:

- Quickstart (create org → build playbook → start a run → make the go/no-go decision)
- Spec configuration guide (all six artifact types with examples)
- Pricing and billing FAQ
- Roles and permissions

---

### Blog

| Field                   | Detail                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | Blog                                                                                                                                                                    |
| **URL path**            | `/blog`                                                                                                                                                                 |
| **Purpose**             | Build SEO-driven inbound traffic from QA leads and engineering managers searching for release checklist workflows, go/no-go processes, and compliance evidence tooling. |
| **Target audience**     | QA Lead (primary SEO target), VP Engineering                                                                                                                            |
| **Primary message**     | Practical thinking on release readiness, testing workflows, and compliance evidence.                                                                                    |
| **Supporting messages** | No generic content marketing. Every post addresses a specific pain the ICP experiences.                                                                                 |
| **Conversion goal**     | Start free (via inline CTAs in posts)                                                                                                                                   |

**Key sections (in order)**:

1. **Post list** — Reverse-chronological. Each post: title, date, reading time, brief description.

2. **Inline CTAs** — Each post should contain one contextual CTA. Example: a post on "how to prepare evidence for a SOC2 audit" ends with "NoHotfix produces this evidence as a natural output of your release process. Start free."

**Priority posts for launch (SEO-driven)**:

- "Why your Notion release checklist isn't good enough (and what to do instead)"
- "How to prepare release testing evidence for a SOC2 audit"
- "Go/no-go decisions: how to make the release call formally and document it"
- "The difference between a test management tool and a release readiness platform"

---

### About

| Field                   | Detail                                                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page name**           | About                                                                                                                                                                              |
| **URL path**            | `/about`                                                                                                                                                                           |
| **Purpose**             | Give evaluating buyers — especially at compliance-sensitive companies — confidence that NoHotfix is a real product built by people who understand the problem, not a side project. |
| **Target audience**     | Compliance buyers and VP Engineering doing late-stage evaluation                                                                                                                   |
| **Primary message**     | NoHotfix is built by engineers who have managed releases with informal checklists and experienced the failure modes firsthand.                                                     |
| **Supporting messages** | The product solves the exact problem we encountered ourselves. We validate on our own release process before asking anyone else to adopt it.                                       |
| **Conversion goal**     | Start free (late-stage conversion)                                                                                                                                                 |

**Key sections (in order)**:

1. **Founding story** — 2-3 paragraphs. The problem we experienced. Why existing tools didn't solve it. What we decided to build and why.

2. **The internal validation principle** — "Before we ask anyone else to use NoHotfix, we use it to manage our own releases. Every feature we ship has been through NoHotfix itself." This is a specific, verifiable credibility statement.

3. **Team** — Founder(s) with brief bios. No fabricated "team" section with stock photos.

4. **Contact** — Email address for inbound questions.
