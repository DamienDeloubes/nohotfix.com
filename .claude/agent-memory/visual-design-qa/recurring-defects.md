---
name: recurring-defects
description: Patterns of defects found repeatedly across this codebase during v5 rebrand QA
metadata:
  type: feedback
---

## Scaffold route pages — hardcoded hex everywhere

**Pattern:** Route-level UI files in `apps/app/src/routes/` that were built as feature scaffolds contain inline styles with raw Tailwind-gray hex values: `#6b7280`, `#374151`, `#e5e7eb`, `#2563eb` (blue — retired), `#ef4444` (non-brand red), `#fef3c7`/`#fcd34d` (amber).

**Files confirmed:** `playbooks/$playbookId.tsx`, `spec-library/$specId.index.tsx`, `spec-library/$specId.edit.tsx`, `spec-library/new.tsx`, `playbooks/new.tsx`, `accept-invite/$token.tsx`.

**Pattern in web:** Same in `apps/web/src/app/invite/[token]/page.tsx` (blue link, gray text) and `apps/web/src/app/docs/account/email-password/page.tsx` (blue + amber hardcoded).

**Why:** These are scaffold/stub pages not yet migrated to the design system.

**How to apply:** When reviewing any new surface, grep for `#[hex]` in route files — these are the highest-probability locations for off-brand hardcoded values. Check UI components (`ConfirmDialog`, `AppButton`) next.

---

## ConfirmDialog — fully off-brand

**Pattern:** `apps/app/src/components/ui/ConfirmDialog.tsx` is entirely implemented with inline styles and hardcoded values. Notably it uses `#2563eb` (Tailwind blue-600) as the default confirm button color — blue is a **retired brand color** in v5.

**Other hardcoded values in this file:** `#dc2626`, `#b91c1c`, `#1d4ed8`, `#111827`, `#6b7280`, `#374151`, `#d1d5db`. Border-radius `8px` is off the token scale (spec: 6, 10, 16, 20, 28, 9999px). No dark mode support.

**Why:** Not yet migrated to token system. This component surfaces in user-facing destroy/archive flows.

---

## AppButton ghost variant — invisible on light mode

**Pattern:** `apps/app/src/components/ui/AppButton.tsx` ghost variant sets `text-white/60` on a `--glass-4` background (`rgba(255,255,255,0.04)`). In light mode, this renders near-white text on a near-white background — effectively invisible, failing WCAG AA by a large margin.

**Why:** Ghost was designed for dark-mode overlay contexts (e.g., glass panels) but the component is theme-agnostic.

---

## AppButton border-radius — off-token

**Pattern:** `AppButton` uses `rounded-sm` (6px = `--radius-sm`). Spec prescribes `--radius-md` (10px) for buttons.

---

## Footer logo — hardcoded light variant

**Pattern:** `apps/web/src/components/Footer.tsx` always renders `<NoHotfixLogo variant="light" />` regardless of active theme. In dark mode, the logo letterforms are `#111110` (near-black) on a near-black page shell — rendering the wordmark invisible.

**Why:** Footer is a server component; dark-mode detection is client-side. Acknowledged in a code comment.

---

## FinalCTA h2 — wrong weight

**Pattern:** `apps/web/src/components/FinalCTA.tsx` renders the "Ship it once." heading at `text-[48px]` (H1 scale) with `font-bold` (700). Spec says H1 = 600 weight (`font-semibold`). Display (74px) is the only level that takes 700.

---

## ease-page token missing from apps/app @theme

**Pattern:** `tokens.css` defines `--ease-page: cubic-bezier(0.4, 0, 0.2, 1)` but `apps/app/src/app.css` `@theme` block omits it (only defines `ease-premium`, `ease-spring`, `ease-out`). Tailwind utility `ease-page` is unavailable in the dashboard surface.

---

## color-primary as decorative text — semantic role mismatch

**Pattern:** Multiple marketing components (`PainHook.tsx`, `WhoItsFor.tsx`, `PricingSummary.tsx`) use `text-[var(--color-primary)]` on small 13px labels/eyebrow text. In light mode `--color-primary` resolves to Orange-600 (#EA6B04). Contrast passes (~4.5:1 AA) but the spec role for Orange-600 is CTAs and UI components, not body text. In dark mode this resolves to Orange-500 (#F97316) which is correct for dark-mode links/text.

**Why this matters:** The semantic intent is misaligned even if contrast is borderline acceptable. Orange-800 (#9A3F05) would be a more deliberate choice for body-weight text on light.
