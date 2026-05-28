# NoHotfix — Screen Index

_Last updated: 2026-03-01_

This document is the master table of contents for every screen in NoHotfix v1. Screens are grouped by domain area. Each link leads to the detailed screen specification.

---

## Screen Map

### Authentication (`/auth/`)

These screens live on the WorkOS-hosted AuthKit domain (`nohotfix.authkit.app`) or are in-app post-auth flows. Auth UI is not built in-house.

| Screen                | File                                                           | Description                                              |
| --------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| Sign Up               | [auth/sign-up.md](auth/sign-up.md)                             | New user registration (hosted by WorkOS AuthKit)         |
| Log In                | [auth/log-in.md](auth/log-in.md)                               | Returning user authentication (hosted by WorkOS AuthKit) |
| Magic Auth (OTP)      | [auth/magic-auth.md](auth/magic-auth.md)                       | Passwordless login via 6-digit OTP                       |
| Email Verification    | [auth/email-verification.md](auth/email-verification.md)       | Post-signup email verification prompt                    |
| Password Reset        | [auth/password-reset.md](auth/password-reset.md)               | Forgotten password flow (hosted by WorkOS AuthKit)       |
| Invitation Acceptance | [auth/invitation-acceptance.md](auth/invitation-acceptance.md) | Accepting a team invitation                              |
| Team Creation         | [auth/team-creation.md](auth/team-creation.md)                 | First-time org naming after signup                       |
| Access Removed        | [auth/access-removed.md](auth/access-removed.md)               | Shown when a user's only org membership is revoked       |

---

### Dashboard (`/dashboard/`)

| Screen                     | File                                                             | Description                             |
| -------------------------- | ---------------------------------------------------------------- | --------------------------------------- |
| Dashboard — New Org        | [dashboard/dashboard-new-org.md](dashboard/dashboard-new-org.md) | First login state with demo playbook    |
| Dashboard — Active Use     | [dashboard/dashboard-active.md](dashboard/dashboard-active.md)   | Established org with runs and playbooks |
| Dashboard — Empty Fallback | [dashboard/dashboard-empty.md](dashboard/dashboard-empty.md)     | Edge case: no playbooks, no demo        |

---

### Playbooks (`/playbooks/`)

| Screen                | File                                                           | Description                                              |
| --------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| Playbook List         | [playbooks/playbook-list.md](playbooks/playbook-list.md)       | All active playbooks; archived tab                       |
| Playbook Editor       | [playbooks/playbook-editor.md](playbooks/playbook-editor.md)   | Create and edit playbook sections and specs              |
| Playbook Preview Mode | [playbooks/playbook-preview.md](playbooks/playbook-preview.md) | Read-only preview of the playbook as testers will see it |
| New Playbook Form     | [playbooks/new-playbook.md](playbooks/new-playbook.md)         | Create a new playbook (name, description, environment)   |

---

### Spec Library (`/spec-library/`)

| Screen                  | File                                                         | Description                                      |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| Spec Library            | [spec-library/spec-library.md](spec-library/spec-library.md) | Browse, search, filter, and manage all org specs |
| Spec Detail / Editor    | [spec-library/spec-detail.md](spec-library/spec-detail.md)   | View and edit a single spec from the library     |
| New Spec Form (Library) | [spec-library/new-spec.md](spec-library/new-spec.md)         | Create a spec directly in the library            |

---

### Runs (`/runs/`)

| Screen                 | File                                                 | Description                                                   |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| Active Runs List       | [runs/active-runs-list.md](runs/active-runs-list.md) | All runs currently In Progress or Awaiting Go/No-Go           |
| Start a Run            | [runs/start-run.md](runs/start-run.md)               | Run start form: name, description, section pre-assignment     |
| Run Overview           | [runs/run-overview.md](runs/run-overview.md)         | The in-progress run: spec list, progress, filters, assignment |
| Spec Execution Panel   | [runs/spec-execution.md](runs/spec-execution.md)     | Execute a single spec: steps, artifacts, pass/fail/skip       |
| Go/No-Go Review Screen | [runs/go-no-go-review.md](runs/go-no-go-review.md)   | Final review before the release decision                      |

---

### Run History & Audit Trail (`/history/`)

| Screen                  | File                                               | Description                                        |
| ----------------------- | -------------------------------------------------- | -------------------------------------------------- |
| Run History List        | [history/history-list.md](history/history-list.md) | Filterable list of all completed/abandoned runs    |
| Run Detail (Audit View) | [history/run-detail.md](history/run-detail.md)     | Full read-only run record — compliance-facing view |

---

### Settings (`/settings/`)

| Screen                   | File                                                         | Description                                       |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------- |
| Settings — General (Org) | [settings/settings-general.md](settings/settings-general.md) | Organisation name; Admin only for edits           |
| Settings — Members       | [settings/settings-members.md](settings/settings-members.md) | Member list, invitations, role management         |
| Settings — Account       | [settings/settings-account.md](settings/settings-account.md) | Personal account settings (name, email, password) |
| Settings — Billing       | [settings/settings-billing.md](settings/settings-billing.md) | Subscription status, upgrade, manage via Stripe   |

---

### Access Gates (`/access-gates/`)

These are not navigation destinations — they are full-page states that replace the app when access is restricted.

| Screen                        | File                                                                             | Description                                                    |
| ----------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Trial Expired — Admin         | [access-gates/trial-expired-admin.md](access-gates/trial-expired-admin.md)       | Full-page upgrade prompt for Admin after trial ends            |
| Trial Expired — Member        | [access-gates/trial-expired-member.md](access-gates/trial-expired-member.md)     | Full-page access suspended screen for Members                  |
| Grace Period Banner           | [access-gates/grace-period-banner.md](access-gates/grace-period-banner.md)       | Persistent top-of-page banner during the 3-day grace period    |
| Trial Countdown Banner        | [access-gates/trial-countdown-banner.md](access-gates/trial-countdown-banner.md) | Non-blocking banner in final 3 days of trial                   |
| Subscription Cancelled Banner | [access-gates/cancellation-banner.md](access-gates/cancellation-banner.md)       | Banner shown after subscription is cancelled but before expiry |

---

## Screen Count Summary

| Domain         | Screen Count |
| -------------- | ------------ |
| Authentication | 8            |
| Dashboard      | 3            |
| Playbooks      | 4            |
| Spec Library   | 3            |
| Runs           | 5            |
| History        | 2            |
| Settings       | 4            |
| Access Gates   | 5            |
| **Total**      | **34**       |

---

## Navigation Model

NoHotfix uses a **persistent left sidebar** for all primary navigation. The sidebar is visible on every authenticated, unblocked screen.

| Nav Item     | Roles         | Destination     |
| ------------ | ------------- | --------------- |
| Dashboard    | Admin, Member | `/dashboard`    |
| Playbooks    | Admin, Member | `/playbooks`    |
| Runs         | Admin, Member | `/runs`         |
| History      | Admin, Member | `/history`      |
| Spec Library | Admin only    | `/spec-library` |
| Settings     | Admin, Member | `/settings`     |

The active org name appears at the top of the sidebar. Users in multiple orgs can click it to open the org switcher dropdown.

---

## Key User Journeys (Cross-Screen Flows)

**Admin first use:**
Sign Up → Email Verification → Team Creation → Dashboard (new org with demo) → Playbook Editor → Start a Run → Run Overview → Go/No-Go Review → Run Detail (History)

**Tester daily use:**
Log In → Dashboard → Run Overview → Spec Execution Panel → (repeat) → [run completes] → History

**Admin release decision:**
Dashboard / Email notification → Go/No-Go Review Screen → [decision recorded] → Run Detail (read-only, locked)

**Admin billing upgrade:**
Trial Expired (Admin gate) → Settings — Billing → [Stripe Checkout] → Dashboard (restored)
