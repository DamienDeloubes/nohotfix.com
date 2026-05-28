# Feature: WorkOS-Powered Authentication

## Overview

Authentication in NoHotfix is handled entirely by WorkOS + AuthKit — not built in-house. This covers signup, login, magic auth (OTP-based passwordless), email verification, invitation acceptance, password reset, organisation management, role assignment, and the multi-org switcher. The choice to use WorkOS eliminates the auth complexity and security burden from the v1 build entirely.

## Complexity Assessment

- **Technical Complexity**: Medium — WorkOS handles the hard auth logic (MFA, HaveIBeenPwned, token refresh, invitation flows), but integrating the Next.js SDK, wiring the callback routes, scoping all application data to the active org, and handling edge cases (removed members, multi-org users, last-Admin protection) requires careful implementation.
- **Design Complexity**: Medium — the AuthKit hosted UI handles the auth screens themselves; the in-app surfaces (onboarding, org switcher, settings pages, role-gated UI) must handle multiple states cleanly across two roles.
- **User Experience Complexity**: Low — auth flows are industry-standard and familiar; the main UX challenges are the multi-org context switch and the last-Admin protection messaging, both of which are edge cases rather than daily interactions.

## Detailed Description

### Auth Provider

Authentication is handled by **WorkOS + AuthKit** — not built in-house.

---

### Signup Flow

1. User lands on the AuthKit hosted UI at `nohotfix.authkit.app` (v1; custom domain deferred to v1.5)
2. User provides: full name, email, password
3. Password strength enforced automatically — WorkOS checks against HaveIBeenPwned and enforces minimum requirements
4. Verification email sent immediately by WorkOS — unverified users cannot complete authentication
5. User clicks verification link — redirected back to the app via the callback route
6. On first login, the app checks the JWT for any org membership — if the user belongs to no orgs, they are shown the team creation prompt (this check runs on every authenticated request to handle the edge case of a user who verified their email but closed the browser before naming their team)
7. User enters their team/company name — org created via WorkOS API, JWT refreshed with the new org as the active org
8. User lands on the empty dashboard.

**Magic Auth alternative:** User can choose passwordless login — enters email, receives a 6-digit OTP code valid for 10 minutes, enters it, lands in the app. No password required. (WorkOS calls this "Magic Auth" — preferred over clickable magic links.)

**Unverified login attempt:** If a user tries to log in before verifying their email, WorkOS blocks authentication and displays a prompt to check their inbox, with an option to resend the verification email.

**Resend verification email:** Available on the unverified login screen and from within the AuthKit UI — user can request a new verification email if the original expired or was not received. Verification links expire after 24 hours.

---

### Invitation Acceptance Flow

This flow is distinct from signup — an invited Member is joining an existing organisation, not creating one.

**Invited user with no existing account:**

1. Admin sends an invitation — WorkOS emails a join link to the invitee (expires after 48 hours)
2. Invitee clicks the link — lands on the AuthKit UI pre-filled with their email
3. Invitee sets a password (or uses Magic Auth) — account created
4. Email verification completed automatically as part of the invitation acceptance (the invitation itself validates the email)
5. User is added to the org with the Member role — no team creation prompt shown
6. User lands on the inviting org's dashboard — the org switcher shows this new org as the active context

**Invited user with an existing account (the multi-org case):**

1. Invitee clicks the join link — AuthKit detects an existing account for that email
2. User authenticates normally
3. User is added to the new org with the Member role — their existing org memberships are unaffected
4. JWT is refreshed; the new org becomes the active context
5. User lands on the inviting org's dashboard
6. The org switcher in the navigation now lists both orgs — user can switch freely between them at any time

**Expired invitation:** Admin can resend or revoke invitations from the team settings. If an invitee clicks an expired link, they see a clear error and are advised to ask the admin to resend.

---

### Login Flow

1. User lands on the AuthKit hosted UI at `nohotfix.authkit.app`
2. Enters email + password → WorkOS validates → JWT issued → callback route
3. App checks how many orgs the user belongs to:
   - **1 org** → JWT issued with that org as active context → dashboard
   - **Multiple orgs** → JWT issued with the last active org as default → dashboard; org switcher visible in nav
   - **0 orgs** → team creation prompt shown (edge case: account exists but user was removed from all orgs)
4. "Forgot password" link available on the login screen
5. Magic Auth available as passwordless alternative
6. Failed login: generic error — "Incorrect email or password" — WorkOS does not enumerate whether the email exists
7. Session managed via access + refresh token pair — the Next.js SDK handles silent token refresh automatically; users stay logged in across browser sessions without re-authenticating
8. **Removed member handling:** if a user's membership in their only org is revoked, the app detects no valid active org on the JWT and shows a "your access has been removed — contact your admin" screen. If the user still belongs to other orgs, the app switches to the next available org automatically.

---

### Logout Flow

1. User clicks "Sign out" — available in the user menu throughout the app
2. WorkOS session is terminated — access and refresh tokens are revoked
3. User is redirected to the AuthKit login screen

---

### Password Reset Flow

1. User clicks "Forgot password" on the AuthKit login screen
2. Enters email — WorkOS sends a reset email regardless of whether the account exists (prevents email enumeration)
3. Reset link expires after 1 hour
4. User sets a new password — strength requirements enforced automatically
5. All active sessions invalidated on password reset
6. User redirected to login

---

### Onboarding Flow (post-signup)

First-time experience after email verification and team naming:

1. The user lands on the dashboard — which is pre-populated with a **demo playbook** created automatically for every new organisation.
2. The demo playbook is a realistic, fully configured example: it has sections, specs with test steps, and at least one artifact requirement of each type (file upload, table, measured value, URL). It is labelled clearly as a demo (e.g., "Example — Pre-production release checklist").
3. The user can explore the demo playbook, start a run from it, duplicate it and use it as a template for their own playbook, or delete it when they no longer need it.
4. No forced wizard, no modal prompts. The product speaks for itself through the example.

**Implementation notes:**

- The demo playbook is seeded at org creation time, not displayed as a UI overlay.
- It must be deletable — the user should never be stuck with it.
- It should be realistic enough to show the product's full capability but scoped to a single domain so it is easy to understand at a glance (e.g., a web app pre-production checklist, not an abstract "sample" with placeholder text).

---

### Organisation Switcher

A user can belong to multiple organisations simultaneously — WorkOS natively supports many-to-many user-to-org membership. The active org determines which dashboard, playbooks, runs, and team the user sees.

- The current active org is displayed in the navigation (org name)
- A dropdown lists all orgs the user belongs to — clicking one switches the active context
- Switching org refreshes the JWT with the newly selected org as the active `org_id`
- All application data (playbooks, runs, specs, members) is scoped to the active org — switching orgs is a full context switch
- Users with only one org do not see a switcher — the org name is displayed as static text

---

### Organisation Settings

Scoped to the currently active organisation. The page is visible to all roles but renders differently based on role.

**General**

|                       | Admin | Member |
| --------------------- | ----- | ------ |
| See organisation name | Yes   | Yes    |
| Rename organisation   | Yes   | No     |

**Members**

|                                         | Admin | Member |
| --------------------------------------- | ----- | ------ |
| See member list (name, email, role)     | Yes   | Yes    |
| See pending invitations                 | Yes   | No     |
| Invite a member by email                | Yes   | No     |
| Resend or revoke a pending invitation   | Yes   | No     |
| Change a member's role (Admin ↔ Member) | Yes   | No     |
| Remove a member                         | Yes   | No     |

Member removal note: completed run work is preserved and attributed to the removed member's name; they lose access immediately.

**Last Admin protection:** The system must enforce a minimum of one Admin per organisation at all times. The following actions are blocked when only one Admin exists in the org:

- The last Admin cannot remove themselves
- The last Admin cannot demote themselves to Member
- No other Admin can remove or demote the last remaining Admin

In all three cases, the action is blocked with a clear explanation: "You are the only Admin in this organisation. Assign another Admin before making this change." This is enforced at the application level on every write action, not just in the UI — the API endpoint must reject the request regardless of how it is triggered.

**Self-role demotion (when multiple Admins exist):** An Admin may demote themselves to Member if at least one other Admin remains in the org. The action requires a confirmation step: "You will lose admin access to this organisation. This cannot be undone by yourself." — making clear that they cannot reverse it without another Admin's help.

**Roles**

- Two roles:
  - **Admin** — create/edit playbooks, manage spec library, start runs, execute specs, make go/no-go decisions, manage organisation settings and members
  - **Member** — start runs, execute specs, upload artifacts, mark specs as passed/failed, add comments
- Admin is a superset of Member — Admins can do everything a Member can, plus oversight and sign-off

---

### Account Settings

Personal to the logged-in user. Accessible to all roles. Applies across all organisations the user belongs to — account settings are not org-scoped.

- **Change display name** — updates the name shown on run activity, spec sign-offs, and go/no-go records
- **Change email address** — triggers a re-verification email to the new address; the old address remains active until the new one is verified
- **Change password** — available only if the account was created with a password; not applicable to Magic Auth-only accounts. Changing password invalidates all active sessions.

_Note: account deletion and organisation deletion are deliberately out of v1 — these require careful data handling (run history, audit trail preservation) and are added once retention and export policies are defined._
