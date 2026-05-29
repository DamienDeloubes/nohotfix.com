# Contract: Component Interfaces

UI contracts for the new/edited components. Props shapes are defined in [data-model.md](../data-model.md);
this file records each component's responsibility, reuse, and behavioral contract. All components use
named exports, `PascalCase.tsx`, design tokens (no hardcoded hex outside the documented exceptions),
and the `.js` import extension convention.

## Reused (no change)
- **`BrowserFrame`** — hosts hero/section fragments (chrome + token styling). Pass `url` (e.g. `app.nohotfix.com/runs/…`).
- **`ScrollReveal`** — entrance motion wrapper; `delay` for staggers. Reduced-motion handled globally.
- **`Footer`** — unchanged.

## Edited
- **`Navigation` / `nav/DesktopNav`** — accept the current pathname (via `usePathname()`); apply active
  state to the "Features" trigger (Orange-600) and the matching item inside the Features mega-panel.
  Contract: active state is visual only; existing hrefs in `nav-content.tsx` are unchanged.

## New — shared (`components/features/shared/`)
- **`SectionLabel`** — all-caps Inter 500 13px pill; `tone: 'orange' | 'slate'`. Static (no entrance anim of its own).
- **`FeatureHero`** — scaffold: `SectionLabel` → `<h1>` (DM Sans 700 display) → sub-paragraph → CTA row → fragment slot.
  Contract: `<h1>` is the LCP element; fragment is passed as children and slides up after CTAs (700ms) once.
- **`FeatureFinalCTA`** — parameterized closing CTA (see `FeatureFinalCTAProps`). Contract: `swapEmphasis` makes the
  filled CTA the secondary action's label (Audit Trail "Talk to us"). Sanctioned warm radial background.
- **`FactCells`** — honest product-fact row; optional count-up (reduced-motion → final value immediately).
- **`ReservedTestimonial`** — visibly empty quote slot; `accentTone: 'orange' | 'slate'`. Contract: MUST render no
  fabricated name/company/quote; placeholder text in italic Slate.

## New — fragment primitives (`components/features/shared/fragments/`)
- **`PassButton`** — `state: 'blocked' | 'enabled'`. Blocked: lock icon, ~0.45 opacity, `aria-disabled="true"`,
  not-allowed cursor, accessible tooltip (`title` or ARIA tooltip — NOT a CSS pseudo-element), min 44×44px even
  when blocked. **No spinner, no animation** (reads as blocked, not loading). Enabled: orange fill, `cursor: pointer`.
- **`ArtifactRequirementPanel`** — renders `ArtifactRequirement[]` with inline completion state; Geist Mono on values.
- **`SpecRow`** — severity + result badges (exact v5 semantic recipes), executed-by, timestamp; optional failed-row tint.
- **`StatusBadge`** — `kind` → exact color recipe (In Progress / Awaiting / Go / No-Go / SEALED).
- **`SealedLockIcon`** — static lock glyph. **Contract: never animates** (no pulse/glow/idle) on any page. Tooltip allowed.
- **`DecisionRecordBlock`** — decision + decider + timestamp + justification; when `sealed`, renders `SealedLockIcon` +
  `SEALED` label and **no edit affordances**.

## New — Artifact Enforcement (`components/features/artifact-enforcement/`)
- **`SixTypesBento`** — the one permitted bento (2×3 → 3×2 tablet → stacked mobile); each tile `<h3>` type name + use-case +
  detail + inset fragment; staggered two-wave reveal.
- **`EnforcementSteps`** — 3-step vertical sequence; step 2 uses `PassButton state="blocked"`, step 3 `state="enabled"`;
  connector line draws top→bottom after steps settle (hidden < 768px).
- **`ActiveVsSealed`** — two-panel (editable vs sealed/read-only static lock); arrow static; link to `/features/audit-trail`.
- **`AdoptionBand`** — `FactCells` + `ReservedTestimonial` (orange accent stripe, QA persona).

## New — Go/No-Go (`components/features/go-no-go/`)
- **`DecisionScreenFragment`** — severity-sorted spec list (failed first + tint), semantic-colored counts, Go/No-Go pair
  (neither pre-selected; hover tints teach the model, not interactive), mandatory-justification field.
- **`DecisionScreenAnnotated`** — §2 paired-hover: hovering/focusing a left item highlights the matching callout
  (`aria-controls`, keyboard-accessible). ≤2 orange callouts/viewport; rest slate.
- **`RoleGateFragment`** — non-Admin inert view: static lock + informational message, no action affordance.
- **`JustificationOverlay`** — elevated card; failed-spec list; required justification textarea; Confirm button
  `disabled` until justification written (tooltip on hover).

## New — Audit Trail (`components/features/audit-trail/`)
- **`SealedRecordFragment`** — hero; **entirely static** (no animation within). `Go` badge + `SEALED` + static
  `SealedLockIcon` (tooltip: permanently sealed), decision block, read-only spec list with inline artifact preview.
- **`RecordContents`** — §2 five-item paired-hover; callouts slate (compliance register); inline artifact thumbnail hover-lift.
- **`ImmutabilityCards`** — three equal cards (API / service / database); each Geist Mono callout rendered via **`TextType`**
  (`loop={false}`, `startOnVisible`, caret removed on completion, slate caret); `disabled` (reduced-motion) → static string.
- **`PrintPreviewFragment`** — certified-document depiction: plain white sheet (no browser chrome), page-edge shadow,
  Geist Mono-dense, expanded specs, partial second-page hint; "Print" button is decorative (teaches the interaction).
- **`ComplianceContext`** — SOC2 + PCI-DSS paragraphs + visible non-buried disclaimer (Slate-600); `ReservedTestimonial`
  (slate accent, empty author block).

## New — motion primitive (`components/TextType.tsx`)
- Ported from React Bits (like `Magnet.tsx`). Props include `text`, `typingSpeed`, `initialDelay`, `startOnVisible`,
  `loop` (use `false`), `showCursor`, cursor color, and `disabled`. Contract: types once and stops; caret removed on
  completion (no idle caret); when `disabled`, renders the final text immediately as static Geist Mono.

## Cross-cutting contracts
- Light-first + dark co-equal via tokens/`dark:` (no hardcoded theme colors except documented chrome dots).
- All interactive demos keyboard-accessible with the standard orange focus ring + appropriate ARIA.
- No fragment auto-cycles or idle-animates (only `TextType` animates, once).
- ≤ 2 orange elements per viewport (overflow → slate).
