# Project Summary — NoHotfix.io

_Last updated: 2026-03-11_

---

## What We're Building

NoHotfix is a **release readiness platform** for software teams at Series A–C B2B SaaS companies. It replaces informal release checklists (Notion pages, Google Sheets, Confluence docs) with structured, enforced testing workflows that produce immutable audit records. It sits in a micro-category between QA tooling and release orchestration — answering a single question: **"Are we ready to ship, and can we prove it?"**

---

## The Problem

Growing software teams reach a point where informal release practices break down. The failure mode is not that teams lack checklists — it is that **nothing enforces them**:

- Testers check off specs they did not actually run
- Screenshots are "forgotten" or uploaded after the fact
- New team members do not know the full checklist
- Compliance auditors ask for release evidence and the team scrambles to reconstruct it

No current tool combines enforced artifact collection, role-gated approval, an immutable audit trail, and a release-centric UX in a lightweight, mid-market package.

---

## The Solution

v1 introduces a three-part enforcement model that is the core of NoHotfix's defensibility:

1. **Artifact enforcement** — A spec cannot be marked as passed until all declared evidence requirements are satisfied. Requirements are typed (file upload, structured table, measured value, or URL) and configured per spec. This is a hard gate, not advisory.
2. **Go/no-go gating** — The release decision is a formal action on a dedicated review screen, available only after all specs are executed. Only Admins can make the call. A Go decision with failed specs requires a mandatory written justification recorded in the audit trail.
3. **Run immutability** — Once a go/no-go decision is recorded, the run is permanently locked. It becomes a tamper-evident audit artifact.

---

## Target User

**Primary ICP**: QA leads, VP Engineering, and Release Managers at B2B SaaS companies (50–500 employees, Series A–C) in regulated sectors — fintech, insurtech, healthtech, legaltech. These teams ship weekly to bi-weekly with mixed automated and manual QA, face audit or compliance pressure (SOC2, PCI-DSS, HIPAA-adjacent), and currently manage releases via Notion, Confluence, or spreadsheets.

**Secondary ICP**: Mid-market QA teams wanting to standardize across product teams; software agencies needing client-facing release evidence.

---

## How It Works — The Core Loop

```
Spec Library (org-wide, reusable)
  └── Specs created once, linked into any playbook section
        └── Edits can sync across all linked playbooks or stay local

           ↓  Build a Playbook

Playbook Template
  └── Sections (grouped by product area)
        └── Specs (what to test, how, what evidence is required)

           ↓  Start a Run

Run (frozen snapshot of the playbook at start time)
  └── Testers execute specs
        └── Satisfy artifact requirements → Mark pass / fail / skip

           ↓  All specs executed (Passed / Failed / Skipped)

Go/No-Go Review Screen (Admin only)
  └── Full spec list sorted by severity
  └── Admin makes judgment call — Go or No-Go
  └── Go with failures requires mandatory written justification
  └── Run locked → Immutable audit record
```

---

## v1 Feature Set

| Module                     | Description                                                                                                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard & Navigation** | Home screen with active run overview, recent runs, playbook shortcuts, and role-appropriate quick actions; persistent sidebar navigation                                                 |
| **Billing & Subscription** | Stripe-backed subscription: 14-day trial (starts at org creation), 3-day grace period, full access block on expiry, Admin-only upgrade and billing management                            |
| **Account & Team**         | WorkOS-powered auth, org management, two roles (Admin / Member)                                                                                                                          |
| **Playbook Templates**     | Create reusable playbooks with sections and specs; inline editor with drag-and-drop reordering; preview mode; archive and duplicate                                                      |
| **Testing Specs**          | Spec library with centralised, reusable specs; three creation paths; sync across playbooks                                                                                               |
| **Start a Run**            | Snapshot a playbook into an active run; optional section-level tester pre-assignment                                                                                                     |
| **Tester Assignment**      | Section-level pre-assignment at run start (Admin); spec-level claiming during execution (any tester); "Assigned to me" filter in run overview                                            |
| **Run Execution**          | Execute specs, satisfy artifact requirements, mark pass/fail/skip, add notes; spec state machine (Pending → In Progress → terminal); concurrent tester support                           |
| **Artifact Management**    | S3-backed file storage; structured table data stored as JSON; all artifacts locked post-completion                                                                                       |
| **Go/No-Go Decision**      | Final review screen after all specs are executed; specs sorted by severity; Admin makes judgment call; Go with failures requires mandatory written justification; run locked on decision |
| **Run History & Audit**    | Full run history, filterable; read-only completed runs; full detail view with compliance-ready go/no-go record, per-spec artifact rendering, print-friendly layout                       |
| **Notifications**          | Email alerts for four events: invite, run ready for decision, decision recorded, run abandoned; all team members notified of decisions and abandonment                                   |

---

## What Makes It Different

|                        | NoHotfix | Notion / Confluence | TestRail / Zephyr | Jira |
| ---------------------- | -------- | ------------------- | ----------------- | ---- |
| Artifact-gated pass    | Yes      | No                  | No                | No   |
| Immutable run records  | Yes      | No                  | No                | No   |
| Release-centric UX     | Yes      | No                  | No                | No   |
| Go/no-go decision gate | Yes      | No                  | No                | No   |
| Lightweight adoption   | Yes      | Yes                 | No                | No   |

---

## Success Criteria for v1

Two criteria, in order of priority:

1. **Internal validation** — The founding team's own company uses NoHotfix to manage its release process end-to-end: structured playbooks, enforced artifact collection, and go/no-go decisions recorded as immutable audit records. This validates that the product solves the exact problem described in the project summary before asking anyone else to adopt it.

2. **External traction** — After public launch, at least 5 new signups per week sustained over time. This is the first signal that the market has an appetite for the product independent of the founder's network.

---

## Pricing Model

- **Model**: Flat monthly fee per team — one price regardless of seat count.
- **Trial**: 14-day free trial, full access. Mandatory upgrade after 14 days — no permanent free tier.
- **Goal**: Revenue from day one. Every signup is a potential paying customer.
- **Price points**: TBD — pending market research before first external customer conversation.

---

## What We're NOT Building in v1

- Per-spec approval workflow (replaced by go/no-go as the single human gate)
- Viewer role (no validated use case yet)
- Slack / Teams notifications (email only in v1)
- Jira / Linear integration
- CI/CD deploy gate
- SSO / SAML (WorkOS supports it; activate at first enterprise deal)
- Public API
- PDF export of run records
- AI spec suggestions
- Analytics / dashboards
- Account and organisation deletion
- Custom auth domain
- Advanced multi-org management (leaving an org, org ownership transfer)
