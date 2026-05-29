# Quickstart: Feature Marketing Pages

How to run, build, and verify the three feature pages. All work is in `apps/web`.

## Run locally

```bash
# from repo root
npm run dev --workspace=web
# or: cd apps/web && npm run dev
```

Then open:
- http://localhost:3000/features/artifact-enforcement
- http://localhost:3000/features/go-no-go
- http://localhost:3000/features/audit-trail

(Signup CTA targets `NEXT_PUBLIC_API_URL` — set in `apps/web/.env.local` if you need the live host;
defaults to `https://api.nohotfix.com`.)

## Quality gates

```bash
cd apps/web
npm run typecheck     # tsc --noEmit
npm run lint          # eslint src --ext .ts,.tsx
npm run build         # next build (catches metadata / RSC issues)
```

E2E (marketing site):

```bash
npm run e2e --workspace=web-e2e   # or the repo's configured Playwright command
```

## Manual verification checklist (maps to spec Success Criteria)

For each of the three pages:

- [ ] **SC-001** Route returns 200 (no longer 404); footer + Features mega-menu links resolve to it.
- [ ] **SC-002** The core mechanic is understandable from the hero alone (blocked pass / locked decision / sealed record), no scroll.
- [ ] **SC-003** Keyboard-only operable; visible orange focus ring; axe/Lighthouse a11y has no critical violations; AA contrast on text + interactive states (incl. disabled Pass button).
- [ ] **SC-004** Exactly one `<h1>`; no skipped heading levels; `<main>` + `<section aria-labelledby>`; JSON-LD (`SoftwareApplication` + `ItemPage` + `BreadcrumbList`) validates with zero errors.
- [ ] **SC-005** Disable images in the browser → artifact-type names, badge states, button labels, field names remain readable (fragments are DOM, not rasters).
- [ ] **SC-006** Enable `prefers-reduced-motion` → no animation plays anywhere; the Audit Trail §3 callouts render as static Geist Mono text (TextType not mounted).
- [ ] **SC-007** No layout breakage at ≥1040px / 768–1039px / <768px / <576px; blocked Pass button keeps ≥44×44px touch target on mobile.
- [ ] **SC-008** From the page, reach the other two feature pages + `/how-it-works`, `/pricing`, and the relevant `/use-cases/*` without returning home.
- [ ] **SC-009** LCP element is the hero headline; below-fold fragments lazy-loaded with explicit dimensions (verify in a perf trace).
- [ ] **SC-010** No fabricated logos/stats/testimonials; reserved testimonial slots are visibly empty; no roadmap capability shown as current (Audit Trail §4 honesty note present).

### Page-specific spot checks
- **Artifact Enforcement**: hero Pass button reads blocked (lock, not-allowed, tooltip), not loading; six `<h3>` type names present; §3 step 2 blocked vs step 3 enabled contrast; §4 active→sealed with static lock.
- **Go/No-Go**: severity-sorted spec list with failed-first tint; §2 paired hover highlights callouts via keyboard too; §4 Confirm disabled until justification typed; CTA secondary is "Talk to us".
- **Audit Trail**: hero entirely static (lock never animates, tooltip works); §3 callouts type once and stop (no idle caret); §4 certified-document print preview + honesty note linking `/platform`; §5 visible SOC2/PCI-DSS disclaimer; final CTA primary "Talk to us" (filled), secondary "Start free" (bordered).

## Notes
- Branch: work is on `feature/homepage` per instruction (spec numbered `032-feature-pages`).
- No DB/migrations/API — nothing to seed or migrate.
