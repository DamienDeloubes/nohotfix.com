# Feature: Email Notifications

_Last updated: 2026-03-01_

> **Launch scope (updated 2026-05-29):** Only the **invitation email** ships at launch — it's the transactional invite that delivers the join link, and is part of the invite flow. The other three triggers — **run ready for go/no-go, go/no-go decision recorded, run abandoned** — are **deferred to post-launch**. The full four-trigger design below is preserved as the build spec for when the workflow notifications ship.

## Overview

Email notifications keep the right people informed at the key moments in the release workflow — when they are invited to join the team, when a run is ready for a go/no-go decision, when a decision has been recorded, and when a run is abandoned. In v1, email is the only notification channel; there is no in-app notification center and no Slack or Teams integration.

## Complexity Assessment

- **Technical Complexity**: Low — four discrete, event-triggered emails with clearly defined recipients; no templating engine complexity or preference management required in v1.
- **Design Complexity**: Low — four email templates with minimal content requirements; no rich formatting or dynamic sections needed beyond the event-specific details.
- **User Experience Complexity**: Low — recipients receive transactional emails tied to actions they already understand; no opt-in flows or notification preference UI in v1.

## Detailed Description

| Trigger                                        | Recipient        |
| ---------------------------------------------- | ---------------- |
| You've been invited to the team                | Invitee          |
| All specs are done — run is ready for go/no-go | Admins           |
| Go/no-go decision recorded                     | All team members |
| Run abandoned                                  | All team members |

No in-app notification center in v1 — email only.

### Email Content Detail

**Invitation email** — sent by WorkOS on behalf of NoHotfix:

- Subject: _"[Admin name] invited you to [Org name] on NoHotfix"_
- Body: invitation link (expires 48 hours), name of the Admin who invited them, org name

**Run ready for go/no-go** — sent when a run transitions to `Awaiting Go/No-Go`:

- Recipient: all Admins in the org
- Subject: _"[Run name] is ready for your go/no-go decision"_
- Body: run name, playbook name, environment, spec summary (X passed, Y failed, Z skipped), link to the go/no-go review screen

**Go/no-go decision recorded** — sent when an Admin records a Go or No-Go decision:

- Recipient: all team members (Admins and Members)
- Subject: _"[Go / No-Go] — [Run name]"_
- Body: decision (Go or No-Go), run name, decision maker name, timestamp, written statement (if provided), link to the run in history

**Run abandoned** — sent when an Admin abandons a run:

- Recipient: all team members (Admins and Members)
- Subject: _"Run abandoned — [Run name]"_
- Body: run name, abandoning Admin's name, timestamp, abandonment reason, link to the run in history
- Rationale for all team members: Members who were actively executing specs need to know the run they were working on is cancelled. Admins need visibility for audit purposes. The mandatory abandonment reason is included in the email body — the notification is informative, not alarming.
