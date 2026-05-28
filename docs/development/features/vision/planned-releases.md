# Feature (Vision): Planned Releases (Release-Readiness Gate)

_Last updated: 2026-05-28_

> **Status: NEXT-PHASE VISION — not in v1 scope.** This is a directional brief, not a
> committed spec. It captures intent and open questions so near-term decisions don't
> foreclose it. See [product-vision.md](../../../product-vision.md).

## Overview

A **planned release** is the shippable unit a team actually cuts — a named, dated
milestone (e.g. "v2.4") that groups the test runbooks which must pass before it goes
out. It is **gate-first**: a release cannot be marked _shipped_ until every runbook
attached to it has cleared its go/no-go. A lightweight roadmap/calendar view sits on
top so the team can see what is coming and whether it is ready.

This lifts the enforced go/no-go decision from a single run up to the release — the
thing the team is actually trying to ship safely. "Ship it once" stops being a per-run
property and becomes a property of the whole release: it ships only when everything
attached to it was caught and cleared first.

## Why it fits the wedge

NoHotfix already enforces "what to test, how, and what counts as proof" at the run
level (spec → playbook → run, with artifact gating, a role-gated go/no-go, and run
immutability). A planned release reuses that mental model exactly — it is a **parent
container over existing runs**, not a new testing mechanic. The differentiator simply
moves up a level: instead of "this run was verified," the team gets "this release was
verified, and here is the immutable evidence for every part of it."

It also makes the other two next-phase items compose cleanly: a release's readiness can
require **UAT partner sign-off** in addition to internal runs, and a release maps
naturally to a **Jira version / fix-version** with its attached runs as the subtasks.

## Detailed Description (intended shape)

### The release entity

- **Name / version**, **target date**, **owner**, and a **status** that moves through
  something like `planned → in testing → ready → shipped`.
- A release **groups one or more existing runs** (instantiated from playbooks). Attaching
  is a link, not a copy — the runs are the same first-class entities used today.

### The release-readiness gate

- The release's readiness is **aggregated from the go/no-go state of its attached runs**.
- A release **cannot transition to _shipped_** until the attached runbooks have cleared
  (or a role-gated override is recorded — see open questions).
- The act of marking a release shipped — who, when, against which run evidence — joins
  the **immutable audit record**, consistent with run immutability today.

### The roadmap / calendar view (thin)

- A list/timeline of upcoming releases with their target dates and readiness at a glance.
- Deliberately thin — enough to answer "what's coming and is it ready," not a full
  project-planning surface (see scope guard below).

## New surface area this introduces

- A **new top-level entity (release)** that sits above runs.
- A **release-level go/no-go** that aggregates run-level decisions.
- A **roadmap/calendar surface**.

## Open questions (resolve before build)

- **Aggregation semantics**: is the gate strictly "all attached runs green," or are some
  runs **required** and others optional? Can a release ship with a recorded, role-gated
  **override**, and does that override carry the same immutable weight as a run pass?
- **Date model**: a single target date, or **planned vs. actual** ship dates? Do slipped
  dates need history?
- **Status model**: what are the canonical release states, and which transitions are
  role-gated?
- **Cardinality / lifecycle**: can a run belong to more than one release? Can a shipped
  release be re-opened (e.g. for a follow-up fix), or is "shipped" terminal?
- **Scope guard**: how much roadmap/calendar is enough before this drifts toward generic
  release / project management? Keep it thin enough to stay anchored to the gate —
  Positioning Principle 6 (don't become a flat test/PM suite).
- **Packaging**: broad-access capability or a paid-tier (Scale/Enterprise) differentiator
  — see [pricing-model.md](../../../marketing/pricing-model.md).
