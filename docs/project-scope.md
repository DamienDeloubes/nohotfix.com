# Project Scope — v1

_Last updated: 2026-05-28_

> **This document is v1 scope only.** The product's broader direction — the QA/test
> platform vision, UAT authoring, and Jira integration — is **next-phase** and lives in
> [product-vision.md](product-vision.md). Nothing in the vision changes the v1 scope
> below; items below marked "next-phase vision" were deferred from v1 and are now
> captured there.

---

## Overview

NoHotfix is a release readiness platform that replaces informal release checklists with structured, enforced testing workflows and immutable audit records. V1 covers 20 must-have modules. The critical path — the thing that makes the product defensible from day 1 — is the **artifact enforcement + go/no-go gate + run immutability** triad. Everything else supports that core loop.

v1 is the **wedge**. The vision is to expand from it into the QA/test tooling choice (UAT authoring, Jira integration) without diluting the enforcement core — see [product-vision.md](product-vision.md).

---

## Target User

**Primary**: QA leads, VP Engineering, and Release Managers at B2B SaaS companies (50–500 employees, Series A–C) in regulated sectors — fintech, insurtech, healthtech, legaltech. Teams shipping weekly to bi-weekly with mixed automated and manual QA, under SOC2 / PCI-DSS / HIPAA-adjacent compliance pressure, currently managing releases via Notion, Confluence, or spreadsheets.

**Secondary**: Mid-market QA teams standardizing across product teams; software agencies providing client-facing release evidence.

---

## Core Problem Statement

Growing software teams have release checklists — but nothing enforces them. Testers mark specs as passed without running them. Screenshots are uploaded after the fact. New team members miss steps. When compliance auditors ask for evidence of testing, teams scramble to reconstruct it from memory and scattered files. The failure mode is not a missing checklist; it is the absence of any mechanism that makes the checklist enforceable and its results tamper-evident.

---

## Feature Documentation

Individual features are documented under `docs/development/features/must-have/` and `docs/development/features/should-have/`.

## In Scope (v1)

### Must Have Features

- **[Dashboard / Home Screen](features/must-have/dashboard-home.md)** — The landing screen for all users: sidebar navigation, at-a-glance active run status, recent run summary, playbook shortcuts, and role-appropriate quick actions. Entry point for all primary workflows.
- **[Billing & Subscription Management](features/must-have/billing-subscription.md)** — Stripe-backed subscription on the seat-banded model: permanent Free tier, invite-gate upgrade to a paid plan via Stripe Checkout, seat-ceiling enforcement, billing management via Stripe Customer Portal (Admin-only). _Current build still implements the prior 14-day-trial model; migration to the free-tier model is pending — see [pricing-model.md](marketing/pricing-model.md)._
- **[Tester Assignment](features/must-have/tester-assignment.md)** — Two-level assignment model: optional section-level pre-assignment by Admins at run start; spec-level claiming (self-service) by any tester during execution. "Assigned to me" filter in run overview.
- **[Artifact-gated spec execution](features/must-have/artifact-gated-spec-execution.md)** — A spec cannot be marked passed until all declared evidence requirements (file upload, text, checkbox, URL, measured value, or table) are satisfied. This enforcement cannot be bypassed.
- **[Go/no-go decision gate](features/must-have/go-no-go-decision-gate.md)** — A dedicated review screen, accessible only after all specs are executed, where only Admins can make the release decision. A Go with failed specs requires mandatory written justification, recorded in the audit trail.
- **[Run immutability](features/must-have/run-immutability.md)** — Once a go/no-go decision is recorded, the run and all its artifacts are permanently locked. No edit endpoint exists for completed runs.
- **[Playbook Templates](features/must-have/playbook-templates.md)** — Create, edit, archive, and duplicate reusable playbooks with sections and specs. Inline editor with section and spec management, drag-and-drop reordering, and preview mode. Playbook is snapshotted when a run starts; subsequent edits do not affect in-progress runs.
- **[Spec Library](features/must-have/spec-library.md)** — A centralised, organisation-wide library of reusable specs. Specs are linked across playbooks; edits can be synced or kept local. Three creation methods: inline in a section, from the library picker, or directly in the library.
- **[Run execution UI](features/must-have/run-execution-ui.md)** — The core daily-use surface: view spec detail, complete test steps, satisfy artifact requirements, mark pass/fail/skip, add notes. Includes spec state machine (Pending → In Progress → terminal), concurrent tester behaviour, and two early-termination flows (No-Go and Abandonment).
- **[WorkOS-powered authentication](features/must-have/authentication.md)** — Signup, login, password reset, magic auth (OTP), email verification, invitation flow, organisation switcher, two roles (Admin / Member).
- **[Run History & Audit Trail](features/must-have/run-history-audit-trail.md)** — Full run history, filterable; completed runs are read-only. Full run detail view with go/no-go decision record, per-spec artifact rendering, and print-friendly layout for browser print-to-PDF.
- **[Email Notifications](features/must-have/email-notifications.md)** — **At launch: the invitation email only** (the transactional invite that delivers the join link). The three workflow triggers — run ready for go/no-go, go/no-go decision recorded, run abandoned — are **deferred to post-launch**. See the feature doc for the full four-trigger design.
- **[App Shell & Dashboard Layout](features/must-have/dashboard-layout.md)** — The styled application shell for the `apps/app` SPA: production-ready sidebar, navigation, and layout following the brand identity system.
- **[Managed Environments](features/must-have/managed-environments.md)** — Org-level environment definitions (e.g. Production, Acceptance, Test) maintained on a settings page; referenced by playbooks (optional default) and required at run creation for naming consistency.
- **[Playbook & Sections Configuration](features/must-have/playbook-configuration.md)** — The foundational playbook authoring experience: creating playbooks, organising them into sections, and populating them with specs from the library; optional playbook-level default environment.
- **[Spec Library Overview Page](features/must-have/spec-library-overview.md)** — The primary surface for admins to browse, search, filter, sort, and manage every spec: a paginated table with live search, severity filtering, and row-level actions.
- **[Edit Spec](features/must-have/edit-spec.md)** — A dedicated edit page for existing library specs, reachable from the spec detail page and the overview row actions.
- **[Archive Spec](features/must-have/archive-spec.md)** — Archive a spec to retire it without deletion (hidden from active search, non-editable) and unarchive to restore it; both actions recorded in the changelog.
- **[Spec History](features/must-have/spec-history.md)** — A complete, read-only audit trail of every change to a library spec — creation, field edits, artifact requirement changes — with who changed what and when.
- **[Archive & Unarchive Playbook](features/must-have/archive-playbook.md)** — Archive a playbook to remove it from the active list without deletion, and unarchive to restore it; archived playbooks remain accessible on the Archived tab.

### Should Have Features

These features are fully specified in the individual feature files linked below. They are scoped as "Should Have" because they add significant value but are not blocking the core enforcement triad. If time-constrained, they are the first candidates for a v1.1 release — but the intent is to ship all of them in v1.

- **[Section-level skip](features/should-have/section-level-skip.md)** — An entire section can be skipped for a run with a required written reason. Skipped sections count as executed.
- **[Playbook and Spec change history](features/should-have/playbook-spec-change-history.md)** — Append-only changelogs for playbook template edits and library spec edits. Read-only; accessible from the editor.
- **[Bulk spec insert](features/should-have/bulk-spec-insert.md)** — Paste a list of spec titles to scaffold a section quickly.
- **[Copy section from another playbook](features/should-have/copy-section-from-playbook.md)** — Picks a section from another playbook and copies it (with all specs linked to their library entries) into the current playbook.

---

## Out of Scope (v1)

| Feature                                                                                   | Why deferred                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Per-spec approval workflow                                                                | Replaced by go/no-go as the single human gate; revisit if customers request it                                                                                                                                                                                        |
| Spec optional flag                                                                        | Removed entirely — redundant. Every spec in a playbook is implicitly required. Any spec can be skipped by any tester at any time, but skipping always requires a written reason. The skip mechanic is universal, not gated by an optional flag set at authoring time. |
| Viewer role                                                                               | No validated use case in v1; add when a customer asks for it. **Next-phase vision**: UAT partner sign-off needs an external viewer-like role — see [product-vision.md](product-vision.md)                                                                              |
| Team logo                                                                                 | Vanity feature with no functional value until client-facing views or exports exist                                                                                                                                                                                    |
| Timezone setting                                                                          | Browser renders timestamps in local timezone automatically; team-level setting only needed for exports (v2)                                                                                                                                                           |
| Slack / Teams integration                                                                 | Nice to have, not blocking adoption                                                                                                                                                                                                                                   |
| Jira / Linear integration                                                                 | Complexity; webhooks/API first. **Next-phase vision**: Jira integration (tests as subtasks) is planned — see [product-vision.md](product-vision.md) and [jira-integration.md](features/vision/jira-integration.md)                                                       |
| CI/CD gate (block deploy)                                                                 | High-value but significant integration work                                                                                                                                                                                                                           |
| SSO / SAML                                                                                | Enterprise gate; WorkOS already supports it — activate at first enterprise deal, no re-architecture needed                                                                                                                                                            |
| Public API                                                                                | Build internal first, expose later                                                                                                                                                                                                                                    |
| PDF export of run                                                                         | V1.5 — basic browser print-to-PDF works for now                                                                                                                                                                                                                       |
| AI spec suggestions                                                                       | Premature without usage data                                                                                                                                                                                                                                          |
| Selective sync (per-playbook spec update control)                                         | All-or-nothing sync covers the v1 use case; per-playbook selection is a natural v2 refinement                                                                                                                                                                         |
| Library edit propagation (library edits auto-push to linked chapters)                     | Potentially surprising behaviour; admins push from chapters to library in v1, not the reverse                                                                                                                                                                         |
| Analytics / dashboards                                                                    | V2 — need usage data first                                                                                                                                                                                                                                            |
| Multi-org advanced features (create org from switcher, leave org, transfer org ownership) | Core switcher is v1; these management actions are v1.5                                                                                                                                                                                                                |
| Account deletion                                                                          | Requires defined data retention and audit trail preservation policy before implementing                                                                                                                                                                               |
| Organisation deletion                                                                     | Same as above — run history and immutable audit records complicate hard deletion                                                                                                                                                                                      |
| Slug / vanity URLs                                                                        | Aesthetic complexity with no v1 user value                                                                                                                                                                                                                            |
| Custom auth domain (`auth.nohotfix.com`)                                                  | $99/month — not justified for early adopters; `nohotfix.authkit.app` is acceptable in v1                                                                                                                                                                              |

---

## Pricing Model

- **Model**: Seat-banded tiers with a permanent free tier. The value metric is seats (active org members). No per-seat overage — hitting a tier's seat ceiling means upgrading to the next tier.
- **Tiers**: **Free** (1 seat, permanent, full enforcement, no time limit) → **Growth** ($29/mo early-bird, $49 standard; up to 10 seats) → **Scale** ($99/mo early-bird, $149 standard; up to 40 seats) → **Enterprise** (custom). Annual billing is 20% off on paid tiers.
- **Conversion**: no trial on paid plans — the free tier is the evaluation vehicle. The free → paid trigger is the invite gate (adding a second member). No credit card at signup.
- **Early bird**: the first ~100 paying orgs are grandfathered at early-bird pricing for life (separate Stripe price objects). The standard price is the reference anchor in copy.
- **Goal**: Revenue from day one via paid tiers; anchor value to the cost of one compliance incident or failed audit.
- Full model, feature gates, scaling path, and rationale: [pricing-model.md](marketing/pricing-model.md).
- _Build note: the shipped billing implements the prior flat-fee + 14-day-trial model; migration to this seat-banded free-tier model is pending — see the billing feature spec._

---

## Key Constraints

- **Authentication**: WorkOS + AuthKit is the auth provider. Auth is not built in-house. Custom auth domain deferred (cost: $99/month).
- **Frontend**: Next.js with the WorkOS Next.js SDK for session management (silent token refresh, JWT handling).
- **Roles**: Two roles only in v1 — Admin and Member. No Viewer role. No per-resource permissions.
- **Notifications**: At launch the only email is the transactional **invitation** email; workflow notifications (run ready, decision recorded, run abandoned) are post-launch. No in-app notification center. No Slack/Teams integration.
- **Immutability is non-negotiable**: Once a run is completed, no edit endpoint may exist for that run's data. This is the core audit trail guarantee and cannot be relaxed for any reason, including admin convenience.
- **SSO / SAML**: Not in v1. WorkOS supports it; plan to activate at the first enterprise deal. Budget $125/month per enterprise SSO connection.
