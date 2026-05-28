# Project Strategist — Persistent Memory

_NoHotfix.com — Last updated: 2026-03-11_

## Project Identity

- **Product**: NoHotfix.com — release readiness platform broadening to the QA/test tooling choice (see docs/product-vision.md)
- **Domain**: nohotfix.com (acquired). Auth subdomain: auth.nohotfix.com. AuthKit subdomain: nohotfix.authkit.app.
- **Core question it answers**: "Are we ready to ship, and can we prove it?"
- **Core defensibility triad**: artifact enforcement + go/no-go gate + run immutability
- **ICP**: QA leads, VP Eng, Release Managers at Series A–C B2B SaaS, 50–500 employees, regulated sectors (fintech, insurtech, healthtech, legaltech)
- **Key competitor framing**: no tool currently combines enforced artifact collection + role-gated approval + immutable audit trail + release-centric UX in a mid-market package

## Key Architecture Decisions (Locked)

- Auth: WorkOS + AuthKit (not in-house). Custom domain deferred ($99/month).
- File storage: S3, signed URLs, 50MB max per file
- Frontend: Next.js with WorkOS Next.js SDK
- Roles: Admin and Member only in v1. No Viewer.
- Notifications: Email only in v1. No in-app center.
- Immutability is non-negotiable: no edit endpoint may exist for completed runs

## Resolved Decisions (as of 2026-03-01)

1. **Success criteria**: (1) Founding team uses NoHotfix end-to-end internally; (2) 5+ new signups/week after public launch.
2. **Onboarding**: Demo playbook seeded at org creation. Fully configured, deletable, no wizard.
3. **Run termination**: Two scenarios — No-Go (test-driven, uses existing go/no-go gate) vs Abandonment (external cause, action menu, mandatory written reason). Both Admin-only, both immutable. Abandonment notification sent to all team members.
4. **Table artifact columns**: Each column has a Required/Optional flag set by admin. Required columns must be filled; optional columns may be blank. Visual distinction in column headers.
5. **Spec optional flag**: Removed entirely. All specs are implicitly required. Skip is always available on any spec but always requires a mandatory written reason.
6. **Pricing model**: Flat monthly fee per team. 14-day free trial, then mandatory upgrade. No permanent free tier. Revenue from day one. Price points TBD.

## Minor Remaining Open Items

- Actual price points — model decided, amounts pending market research

## Document Structure

- `docs/project-summary.md` — Executive-level summary. Canonical format. Updated 2026-03-11.
- `docs/project-scope.md` — Detailed module spec (12 modules). Includes: Overview, Target User, Core Problem, In Scope (Must/Should), Out of Scope, Key Constraints, Open Questions, then module detail. Updated 2026-03-11.
- `docs/features/features/{must-have|should-have}/{feature-name}.md` — Detailed spec for every feature. 12 must-have, 4 should-have.
- `docs/design/screens/index.md` — Master table of contents for all 34 screens. Created 2026-03-01.
- `docs/design/screens/{auth|dashboard|playbooks|spec-library|runs|history|settings|access-gates}/*.md` — Individual screen specs. 8 subdirectories, 34 screen files. Created 2026-03-01.
- `docs/marketing/ideal-customer-profile.md` — ICP detail, buying journey, messaging. Last updated 2026-02-26.
- `docs/marketing/competitors.md` — Competitive landscape. Last updated 2026-02-26.

## Scope Boundaries (Firm Deferreds)

SSO/SAML, Viewer role, Slack/Teams, Jira/Linear integration, CI/CD gate, public API, PDF export, AI suggestions, analytics/dashboards, account/org deletion, custom auth domain, advanced multi-org management, per-spec approval, selective sync, library-to-chapter edit propagation, spec optional flag (removed — redundant with universal skip).

## Patterns to Maintain

- project-summary.md = concept level only; no implementation detail
- project-scope.md = authoritative source for implementation detail
- Every deferral must appear in Out of Scope with a rationale
- Open Questions must be named explicitly, never silently ignored
