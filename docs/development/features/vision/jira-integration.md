# Feature (Vision): Jira Integration

_Last updated: 2026-05-28_

> **Status: NEXT-PHASE VISION — not in v1 scope.** This is a directional brief, not a
> committed spec. It is the deliberate resolution of the "Jira / Linear integration —
> deferred" line in [project-scope.md](../../../project-scope.md). See
> [product-vision.md](../../../product-vision.md).

## Overview

Jira integration lets teams attach NoHotfix-configured tests to Jira issues as
**subtasks**, and reflects each test's status back into the ticket. The goal is to meet
teams where their work already lives: instead of asking them to leave Jira, NoHotfix
becomes the verification layer over their existing Atlassian workflow.

## Why it fits the wedge

A huge share of the ICP (and the indirect competitors NoHotfix displaces — Jira
checklists, Zephyr, Xray) already live in Jira. Letting a NoHotfix test ride along as a
subtask turns "we ship it once because it was verified" into something visible on the
ticket the rest of the team is watching — without breaking the enforcement that makes
NoHotfix different (the verification and evidence still live in NoHotfix; Jira just
mirrors the state).

## Detailed Description (intended shape)

- From a Jira issue (or from NoHotfix), attach one or more NoHotfix tests as **subtasks**
  of that issue.
- Subtask status mirrors the NoHotfix test state (e.g. pending → in progress →
  passed/failed).
- A link from the Jira subtask deep-links into the corresponding NoHotfix test/run.
- Connection is configured once per org (Atlassian app / OAuth).

## Open questions (resolve before build)

- **Auth model**: Atlassian Connect/Forge app vs. OAuth 2.0 vs. API token? (Affects
  Marketplace distribution and security review.)
- **Sync direction**: one-way (NoHotfix → Jira status push) first, or two-way from the
  start?
- **Entity mapping**: which NoHotfix entity becomes a subtask — a spec, a run, or a UAT
  test? Likely needs to support more than one.
- **Cloud vs. Data Center**: Jira Cloud only at first, presumably.
- **Packaging**: broad-access or a paid-tier (Scale/Enterprise) differentiator — see
  [pricing-model.md](../../../marketing/pricing-model.md).
