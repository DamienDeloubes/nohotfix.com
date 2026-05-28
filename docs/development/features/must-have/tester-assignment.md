# Feature: Tester Assignment

_Last updated: 2026-03-01_

## Overview

Tester assignment in NoHotfix operates at two distinct levels: **run-level pre-assignment** (optional, Admin-initiated when starting a run) and **spec-level claiming** (self-service, by any tester during execution). Both mechanisms coexist and are complementary. Pre-assignment communicates intent and organises work up front; claiming handles the real-time, ad-hoc reality of who picks up what during a live run.

## Complexity Assessment

- **Technical Complexity**: Low — assignment is attribution metadata on run-section and run-spec records; no locking or queue semantics required in v1.
- **Design Complexity**: Low — the pre-assignment step at run start is a simple form field; the claiming action during execution is a single button.
- **User Experience Complexity**: Low — both mechanisms are familiar; the key UX task is making it immediately visible who is working on what without adding friction to the core execution workflow.

---

## Detailed Description

### Two Assignment Mechanisms

#### 1. Run-Level Pre-Assignment (at run start)

When an Admin starts a run, the run start form includes an **optional** section-level assignment step:

- After entering the run name and optional description, the Admin sees a list of all sections in the playbook snapshot
- For each section, the Admin can optionally select one member from a dropdown of all org members
- Pre-assigning a section communicates intent — it is not a hard lock. Other testers can still claim and execute specs in a pre-assigned section.
- The dropdown shows all org members (Admins and Members) — anyone can be pre-assigned to a section
- Pre-assignment can be left blank for some or all sections — it is always optional
- Pre-assignment is visible on the run overview for all participants immediately when the run starts

**What pre-assignment does:**

- The assigned member's name is shown next to the section in the run overview
- The section is included in the "Assigned to me" filter for that member
- It communicates expected ownership — not a technical lock

**What pre-assignment does not do:**

- It does not prevent other testers from claiming or executing specs in that section
- It does not send a notification in v1 (assignment is visible on the dashboard and in the run)
- It does not grant any additional permissions

#### 2. Spec-Level Claiming (during execution)

During a run, any tester (Admin or Member) can claim any individual spec. Claiming is the real-time, self-service mechanism for expressing "I am working on this spec."

- A "Claim it" button is shown on each unclaimed spec in the run overview and inside the spec execution panel
- Clicking "Claim it" assigns that spec to the current user
- A claimed spec shows the assignee's name next to it in the run overview
- A tester can claim as many specs as they like
- Claiming is not exclusive — another tester can also open and complete a claimed spec; see Concurrent Execution below

**Unclaiming:** A tester can unclaim a spec they have previously claimed, provided it has not yet been marked Passed, Failed, or Skipped. Admins can unclaim any spec in the run.

---

### Concurrent Execution

Two testers may open the same spec simultaneously. NoHotfix does not implement spec-level locking in v1 — there is no exclusive lock that prevents a second tester from opening or working on a spec another tester has claimed or is executing.

**Rationale:** Spec-level locking adds implementation and UX complexity that is not warranted for v1. In practice, teams using pre-assignment and the claiming mechanism naturally avoid collisions. The enforcement model (artifact requirements, pass/fail actions) is the critical gate — attribution is secondary.

**Concurrent behaviour:**

- Both testers can complete artifact requirements and check test steps; all actions are attributed to the acting user individually
- The last tester to mark the spec Passed, Failed, or Skipped determines the final outcome — the result is not averaged or merged
- Artifacts uploaded by both testers are preserved in the run record and attributed separately
- If one tester marks the spec Passed and a second tester opens it immediately after, the spec is shown as Passed; the second tester cannot change the result without Admin intervention (no re-open in v1)

---

### Run Overview — Assignment Visibility

The run overview shows assignment status alongside each spec:

- **Unclaimed specs**: no assignee shown; "Claim it" button visible
- **Claimed specs**: assignee avatar + name shown; "Claim it" replaced with a smaller "Claimed by [name]" label
- **Pre-assigned sections**: section header shows "Assigned to [name]" in a muted label

**Filter:** The run overview includes an **"Assigned to me"** filter option (alongside the existing status and severity filters). Selecting it shows only specs in sections pre-assigned to the current user, plus any specs individually claimed by the current user.

---

### Notifications

In v1, **no notification is sent when a section is pre-assigned** at run start. Assignment is visible immediately in the run overview; team members are expected to check their active runs.

For run-level notifications generally, see email-notifications.md.
