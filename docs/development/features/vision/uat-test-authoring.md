# Feature (Vision): UAT Test Authoring + Partner Sign-Off

_Last updated: 2026-05-28_

> **Status: NEXT-PHASE VISION — not in v1 scope.** This is a directional brief, not a
> committed spec. It captures intent and open questions so near-term decisions don't
> foreclose it. See [product-vision.md](../../../product-vision.md).

## Overview

UAT (user acceptance testing) authoring lets a QA or test owner build acceptance tests
directly in NoHotfix and share them with people **outside** the organisation — clients,
partners, business stakeholders — who walk the test and sign off without needing a
NoHotfix account.

This extends the core wedge (enforced, evidence-backed internal testing) to the
external acceptance moment: the same "ship it once" promise, but covering the
"did the customer actually accept this?" question that today lives in email threads and
shared spreadsheets.

## Why it fits the wedge

NoHotfix already knows how to express "what to test, how, and what counts as proof"
(specs, steps, artifact requirements). A UAT test is that same idea pointed at an
external reviewer instead of an internal tester. It reuses the product's core mental
model rather than bolting on an unrelated workflow.

## Detailed Description (intended shape)

### Authoring (internal QA/test owner)

A test owner configures a UAT test made up of:

- **Ordered steps** — what the partner should do, in sequence.
- **Test data** — credentials, sample records, URLs, or values the tester should use.
- **What to watch for** — the things the reviewer should pay attention to / verify at
  each step.
- **Expected outcome** — what "correct" looks like, so the reviewer can judge.

Multiple tests can be grouped (e.g. by feature or release) into a shareable set.

### Sharing + execution (external partner)

- Authoring produces a **shareable link** that opens without authentication into the
  org.
- The partner walks each step, can leave **feedback** (per step and overall), and marks
  each test as **success / failure**.
- The author sees results come back in NoHotfix and can act on the feedback.

## New surface area this introduces

- A **public, scoped, shareable link** — the first NoHotfix surface used by someone who
  is not authenticated into an org.
- A **viewer-like external role** (currently explicitly out of v1 scope).

## Open questions (resolve before build)

- **Link security**: how is the link scoped, expired, and revoked? Optional passcode?
  Per-partner links vs. one shared link?
- **Evidence model**: does partner feedback / a partner-marked "success" become part of
  an immutable record the way run artifacts do? Does it carry the same weight as an
  enforced internal pass, or is it advisory?
- **Mapping to the core loop**: is a UAT test its own entity, or a flavour of spec/run?
  Can a UAT sign-off feed a go/no-go decision?
- **Identity**: do we capture who the external reviewer was (name/email) for the audit
  trail, and how without an account?
