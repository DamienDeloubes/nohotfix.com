# Product Vision — NoHotfix.com

_Last updated: 2026-05-28_

> **Relationship to other docs:** This is the north-star vision. It describes where
> NoHotfix is going beyond v1. It does **not** change v1 scope — see
> [project-scope.md](project-scope.md) and [project-summary.md](project-summary.md)
> for what is shipped / in-build today. Next-phase feature briefs live under
> [`development/features/vision/`](development/features/vision/).

---

## The thesis: ship it once

Every emergency hotfix is a confession. It means something reached production that
should have been caught first. NoHotfix exists to make that the rare exception, not
the monthly ritual.

The promise is in the name: **catch every issue before production does, so you ship
it once.** No 11pm rollback. No "we'll patch it tomorrow." No surprises in prod.

That promise is bigger than a single release gate. It spans everything a team does to
be sure a change is safe before it goes out — structured QA, evidence-backed sign-off,
user acceptance testing, and the integrations that wire all of it into how the team
already works. NoHotfix is becoming **the QA/test tooling choice for teams who refuse
to learn about bugs from production.**

---

## Positioning: a platform anchored by the gate, not a flat test suite

NoHotfix is **not** repositioning into a generic test-management suite competing
feature-for-feature with TestRail or Xray. The differentiation that makes the product
defensible — **enforced artifact collection, a role-gated go/no-go decision, and an
immutable audit record** — stays the flagship and the entry wedge.

The vision is to *expand from that wedge*. The enforced release gate is the core; QA
authoring, UAT, and integrations are the platform that grows around it. Each addition
serves the same single promise — ship it once — rather than diluting it into a feature
checklist.

```
        ┌─────────────────────────────────────────────┐
        │              SHIP IT ONCE                     │
        │   catch it before production does             │
        └─────────────────────────────────────────────┘
                          │
   ┌──────────────────────┼──────────────────────┐
   │                      │                       │
  TODAY (v1)         NEXT PHASE              LATER VISION
  the wedge          the expansion          the platform
   │                      │                       │
  • Artifact gating   • UAT test authoring    • Standing QA layer
  • Go/no-go gate     • Partner sign-off        across every change
  • Run immutability    links                 • Deeper ecosystem
  • Spec library      • Jira integration        integrations
  • Playbooks / runs    (tests as subtasks)
                      • Planned releases
                        (release-readiness
                        gate)
```

---

## Where we're going

### Phase: Now (v1 — shipped / in-build)

The enforcement triad plus everything that supports the core loop: spec library,
playbook templates, runs, tester assignment, run execution, run history & audit
trail, dashboard, billing, auth, email notifications. Fully described in
[project-summary.md](project-summary.md). **Unchanged by this vision.**

### Phase: Next (vision — not yet in scope)

**1. UAT test authoring + external partner sign-off**
A QA or test owner configures user-acceptance tests directly in NoHotfix: ordered
steps, the test data to use, what the tester needs to watch for, and the expected
outcome. The output is a **shareable link** a partner, client, or stakeholder can open
without a NoHotfix account — they walk the steps, leave feedback, and mark each test
as a success or a failure. This extends the wedge from *internal* enforced testing to
*external* evidence-backed acceptance. Brief:
[uat-test-authoring.md](development/features/vision/uat-test-authoring.md).

**2. Jira integration**
Attach NoHotfix-configured tests to Jira issues as subtasks, and reflect their status
back into the ticket. This meets teams where their work already lives and turns
NoHotfix into the verification layer over the Atlassian workflow rather than a
separate island. This is the deliberate resolution of the v1 "Jira integration —
deferred" line. Brief:
[jira-integration.md](development/features/vision/jira-integration.md).

**3. Planned releases (release-readiness gate)**
A planned release is the shippable unit a team actually cuts — a named, dated milestone
that groups the test runbooks (runs) which must pass before it goes out. It lifts the
enforced go/no-go from a single run up to the release: the release can't be marked
*shipped* until everything attached to it has cleared, and a thin roadmap view shows
what's coming and whether it's ready. It reuses the existing spec → playbook → run model
— a release is a parent container over runs, not a new testing mechanic — and it composes
with the other two items (a release can require UAT sign-off, and maps to a Jira
version/fix-version). Brief:
[planned-releases.md](development/features/vision/planned-releases.md).

### Phase: Later (directional, not committed)

A standing QA layer that sits over every change — not just the named release moment —
and deeper ecosystem integrations (CI/CD gates, Linear, Slack/Teams, public API).
These are aspirations, not commitments; they are recorded here only so near-term
decisions don't foreclose them.

---

## New people the vision brings in

The v1 personas (QA lead, VP Engineering, compliance buyer) are all **internal**. The
next-phase vision introduces **external** participants for the first time:

| Persona | Who they are | What they do in NoHotfix |
| --- | --- | --- |
| **UAT partner / client stakeholder** | An external reviewer with no NoHotfix account — a client contact, a partner integrator, a business stakeholder | Opens a shared link, walks a UAT test step-by-step, leaves feedback, marks success/failure |
| **Agency delivery lead** (strengthened) | Runs client deliveries that require formal sign-off before handoff | Sends clients a UAT link as the professional, shareable proof that the work was accepted |

The external partner is the first user who interacts with NoHotfix **without
authenticating into an org**. That is a genuinely new surface (a public, scoped,
shareable link) and a viewer-like external role — both currently out of v1 scope.

---

## What this does NOT mean

- It does **not** widen v1 scope. The next-phase features are not promised for v1
  and are not in `must-have/` or `should-have/`.
- It does **not** soften the enforcement differentiation. "Ship it once" is delivered
  by enforcement, not by breadth. Breadth without the gate would just be another test
  tool.
- It does **not** commit the "Later" items. They are directional only.

---

## Open strategic questions (to resolve before next-phase build)

- **External link security**: how is a public UAT link scoped, expired, and revoked
  without an account behind it?
- **Evidence model for UAT**: does partner feedback become part of an immutable record
  the way run artifacts do? Should a partner-marked "success" carry the same weight as
  an internally enforced pass?
- **Jira sync direction**: one-way (push status to Jira) first, or two-way from the
  start? Which NoHotfix entity maps to a subtask — a spec, a run, or a UAT test?
- **Release-gate aggregation**: is a release's readiness strictly "all attached runs
  green," or are some runs required and others optional? Can a release ship with a
  recorded, role-gated override, and does that override join the immutable record? And
  how thin does the roadmap/calendar stay before it drifts into generic release/PM
  tooling (Positioning Principle 6)?
- **Packaging**: are UAT and Jira broad-access capabilities or paid-tier
  differentiators? (Current lean: likely Scale/Enterprise differentiators — see
  [pricing-model.md](marketing/pricing-model.md).)
