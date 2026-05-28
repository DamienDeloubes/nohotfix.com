# Homepage — NoHotfix.com

**URL**: `/`
**Version**: 2.0
**Last updated**: 2026-05-28
**Design reference**: Cloudflare (light-first confidence), Linear (card discipline), Stripe (screenshot-as-argument). Glass model A per brand-identity.md — nav/overlays only, solid cards both themes.

---

## Page Purpose

Convert QA leads and VP Engineering who land on the homepage into Free tier signups — by making the enforcement mechanic viscerally clear in the first scroll, before any feature explanation or pricing. The page must answer "what is this and why does it matter to me" in the hero, then systematically dismantle every objection — "we already have Notion," "we already have TestRail," "this looks complex" — before the final CTA.

The page is not a feature catalog. It is an argument. The argument is: the tools you already use are advisory, and advisory is not good enough.

---

## Target Audience

- **Primary**: QA Lead / Senior QA Engineer who owns the release process but controls none of its enforcement. Has experienced at least one of: a tester skipping a spec, a compliance audit where they reconstructed evidence manually, a production incident traced to an untested scenario.
- **Secondary**: VP Engineering making the go/no-go call on a Slack thread, who has no formal record of what was known before they shipped.
- **Entry points**: Direct / word of mouth, LinkedIn ad targeting, SEO ("release checklist software", "pre-deployment checklist tool"), engineering community referrals.

---

## Key Conversion Goal

**Primary**: "Start free" — sign up for Free tier. No credit card, no time limit.
**Secondary**: "See how it works" — navigate to `/how-it-works` for visitors who need more context before committing.

---

## Theme and Background Treatment

The page is light-first. Light mode is the canonical design state for the marketing site. Dark mode is equally designed and switches automatically from `prefers-color-scheme`.

### Light mode — clean page background

Page background: `var(--bg-page)` — `#FAFAFA`. No vertical gradient. Sections differentiate via card surfaces, section-alt backgrounds, and whitespace — not a dark descent. The warm-white ground lets orange CTAs read as architectural details, not alarms.

Section alternation (light):
- Default sections: `#FAFAFA` background, transparent
- Alternate sections (e.g. Three Guarantees, Pricing): `var(--bg-section-alt)` — `#F4F4F5`
- Feature cluster / bento cards: `#FFFFFF` with 1px `rgba(0,0,0,0.08)` border

### Dark mode — warm near-black

Page background: `var(--bg-page)` — `#111110` (Dark-900, warm near-black; replaces retired violet `#0D0920`). No vertical gradient. Cards sit on `#1E1D1B` (solid, no glass). Nav and modals use frosted glass per the nav recipe in brand-identity.md.

---

## Page Structure

---

### Section 1: Sticky Navigation

**Purpose**: Persistent wayfinding and always-available conversion trigger.

**Layout**: Full-width, fixed, `position: sticky; top: 0; z-index: 100`

**Content Elements**:

- **Left**: NoHotfix logo wordmark — fire-in-the-o mark. Light mode: letterforms `#111110`, fire glyph gradient (`#FF8D28 → #FF0000`). Dark mode: letterforms `#FFFFFF`, fire glyph gradient. Height: 24px. Links to `/`. On page load, the fire glyph kindles once (600ms opacity/gradient-reveal from flat `#E05C00` to full gradient, `ease-out`) — fires once per session, never repeats.
- **Center**: Navigation links — "How It Works" (`/how-it-works`), "Features" (dropdown), "Use Cases" (dropdown), "Pricing" (`/pricing`), "Changelog" (`/changelog`)
- **Right**: "Log in" (text link) + "Start free" (primary orange button)

**Scroll Transform Behavior**:

- Default state (0–39px): `background: transparent; border-bottom: 1px solid transparent`
- Scrolled state (40px+):
  - Light mode: `background: rgba(250, 250, 250, 0.90); border-bottom: 1px solid rgba(0,0,0,0.08); backdrop-filter: blur(12px); transition: all 300ms cubic-bezier(0.4,0,0.2,1)`
  - Dark mode: `background: rgba(17, 17, 16, 0.85); border-bottom: 1px solid rgba(255,255,255,0.07); backdrop-filter: blur(12px); transition: all 300ms cubic-bezier(0.4,0,0.2,1)`

**Dropdown Menus**: Glass overlay treatment — `background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; backdrop-filter: blur(20px)`. Each item: icon (linear, 2px stroke, 20px), label, one-line description.

**Button styles**:

- "Start free" — light: `background: #EA6B04; color: #FFFFFF; padding: 8px 20px; border-radius: 10px; font: Inter 500 14px`. Hover: `background: #C05A00`. Dark: `background: #F97316`. Hover: `background: #FB923C`.
- "Log in" — Inter 400 14px, `rgba(0,0,0,0.55)` light / `rgba(255,255,255,0.70)` dark. Hover: full opacity, 150ms.

**Responsive behavior**:
- Below 957px: center nav links collapse to hamburger
- Below 576px: "Log in" hidden (available in hamburger menu)

---

### Section 2: Hero

**Purpose**: State the transformation in 5 seconds. Immediate understanding of: (1) what NoHotfix is, (2) why it matters, (3) what to do next.

**Layout**: Centered single-column, full-viewport-height (`min-height: 100vh`), content vertically centered with slight upward bias (60/40 split).

**Color Treatment — light mode**: White/warm-white background. Text is dark (`#111110` for headline, `#52514c` for body). Orange is the accent — CTAs, focus elements, the logo fire glyph. No dark overlay, no gradient backdrop.

**Color Treatment — dark mode**: `#111110` near-black. Text is light (`#F5F4F0` headline, `rgba(255,255,255,0.65)` body). Orange-500 for CTAs.

**Content Elements**:

**Pre-headline label** (above the main headline):

- Small pill badge
- Light mode: `border: 1px solid rgba(234,107,4,0.30); background: rgba(234,107,4,0.10); color: #EA6B04; border-radius: 9999px; padding: 4px 14px; font: Inter 500 13px`
- Dark mode: `border: 1px solid rgba(249,115,22,0.30); background: rgba(249,115,22,0.10); color: #F97316`
- Text: "QA & release readiness — built for engineering teams"
- Animation: fades in first, 600ms after page load, `ease-out`

**Main Headline**:

- Font: DM Sans 700, 74px/1.08, letter-spacing: -0.04em
- Text: **"The release gate that holds."**
- Light mode: `color: #111110` — solid near-black on warm white. The weight and face carry the authority; no text gradient needed.
- Dark mode: optional warm-to-light gradient — `background: linear-gradient(135deg, #FFFFFF 0%, #FED7AA 60%, #F97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent`
- Animation: fades in 300ms after pre-headline, 500ms `ease-out`. No shimmer in light mode (the dark headline on white is already high-contrast and deliberate). Dark mode may retain a single shimmer sweep (amber-white `rgba(255,220,150,0.35)`, 2.5s, fires once).
- Mobile (below 576px): 46px/1.1

**Sub-headline** (below main headline, 24px gap):

- Font: Inter 400, 18px/1.6, color: `#52514c` (light) / `rgba(255,255,255,0.65)` (dark)
- Text: **"Your team can't mark a spec as passed without the evidence. The go/no-go decision is permanent. The record writes itself."**
- Max-width: 560px, centered
- Animation: fades in 150ms after headline, 600ms `ease-out`

**CTA Row** (below sub-headline, 40px gap):

- Two buttons, centered, 12px gap
- **Primary button**: "Start free — no credit card"
  - Light: `background: #EA6B04; color: #ffffff; padding: 14px 28px; border-radius: 10px; font: Inter 500 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(234,107,4,0.25)`
  - Hover: `background: #C05A00`, shadow deepens, `transform: translateY(-1px)`, 150ms
  - Dark: `background: #F97316`. Hover: `background: #FB923C`
  - Arrow icon (`→`) after text, shifts right 4px on hover
- **Secondary button**: "See how it works"
  - Light: `background: #FFFFFF; color: #111110; border: 1px solid rgba(0,0,0,0.12); padding: 14px 28px; border-radius: 10px; font: Inter 500 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.06)`
  - Hover: `background: #F4F4F5`, border `rgba(0,0,0,0.18)`, 150ms
  - Dark: `background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.14)`
  - Links to `/how-it-works`
- Animation: both buttons fade in 300ms after sub-headline, sliding up 12px

**Social proof micro-signal** (below CTAs, 24px gap):

- Font: Inter 400 13px
- Light: `color: #78776f`
- Dark: `color: #64748b`
- Text: "Free tier available. No credit card required. Full enforcement on every plan."

**Product Preview** (below CTAs block, 64px gap):

This is the centerpiece visual element. A product UI screenshot or faithful simulation showing the enforcement mechanic.

- **Container**: `max-width: 960px`, centered, `border-radius: 28px`
- **Light mode treatment**: Screenshot in a clean browser chrome strip. Outer frame: `background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); border-radius: 28px; padding: 12px 16px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)`. No glow effect. The product UI screenshot sits inside on a white card surface.
- **Dark mode treatment**: Glass chrome frame — `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 28px; padding: 12px 16px 0; box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 80px rgba(249,115,22,0.08)`. Three traffic-light dots. Fake URL bar in Geist Mono 12px.
- **Inner UI simulation** (both themes): Three tabbed states — same content as before, now using v5 badge colors. In Progress: slate `#94A3B8` (dark) / `#475569` (light). Blue is retired.

**UI Simulation Content** — Three tabbed states that auto-cycle (6s per tab):

Tab 1: "Execute specs" — spec list with blocked pass button (artifact required). The key enforcement visual.

Tab 2: "Go/No-Go decision" — decision review screen, Go/No-Go buttons, mandatory justification field.

Tab 3: "Immutable record" — locked run in read-only state. Static — no animation (immutability is a fact, not a transition).

**Tab Navigation**:
- Light mode active tab: `#EA6B04` underline (2px), Inter 500, `#111110` text; inactive: Inter 400, `rgba(0,0,0,0.45)`
- Dark mode: `#F97316` underline, Inter 500, white; inactive: `rgba(255,255,255,0.50)`
- Auto-cycles every 6s. Manual click overrides.

**Frame animation**:
- On initial load: preview slides up from 24px below while fading in, 700ms after CTAs appear
- Dark mode only: subtle pulsing glow on outer border — `0 24px 80px rgba(249,115,22,0.08)` breathing between 0.06–0.10, 4s infinite ease-in-out. Light mode: no glow — the shadow provides the presence.

**Decorative elements** (dark mode only):
- Two small orbiting dots: 6px, `#F97316` at 40% opacity, CSS `@keyframes rotate`. 12s and 18s periods. These are not used in light mode — unnecessary against a white background.

**Responsive behavior**:
- Below 1040px: max-width reduces to 100%, 32px horizontal padding
- Below 768px: tabs collapse to scroll-horizontal indicator pills; preview shows Tab 1 only
- Below 576px: preview visible at 75% scale, blocked pass button remains legible

---

### Section 3: Pain Hook

**Purpose**: "Yes, exactly that" recognition moment for the QA lead.

**Layout**: Centered, `max-width: 760px`, two-card contrast pair.

**Color Treatment (light)**: Page background `#FAFAFA`. Cards on `#FFFFFF` with `rgba(0,0,0,0.08)` borders. The "before" card uses `#F4F4F5` background — subtly depressed vs. the white NoHotfix card.

**Color Treatment (dark)**: Surfaces stay on `#111110`. The "before" card uses `rgba(255,255,255,0.06)` for subtle lift.

**Section label** (above cards):
- Light mode: Inter 500 13px, `#EA6B04`, all-caps, letter-spacing: +0.08em
- Dark mode: `#F97316`
- Text: "THE PROBLEM WITH CHECKLISTS"

**Two-card contrast layout**:

**Left card — "The way it works now"**:

- Light: `background: #F4F4F5; border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; padding: 32px`
- Dark: `background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; padding: 32px`
- Minimal Notion-style checkbox list (unchanged content). No top-edge highlight — flat, deliberately uninspiring (the "before" state).
- Caption: "Anyone can tick this. No evidence required."

**Right card — "NoHotfix"**:

- Light: `background: #FFFFFF; border: 1px solid rgba(0,0,0,0.10); border-radius: 20px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)`
- Dark: `background: #1E1D1B; border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; padding: 32px; box-shadow: 0 1px 0 rgba(255,255,255,0.09) inset, 0 4px 20px rgba(0,0,0,0.35)`
- Label: "NoHotfix" — `#EA6B04` (light) / `#F97316` (dark), Inter 500 13px
- Enforcement-state spec list with correct v5 badge colors
- Caption: "The pass action is blocked. Not warned. Blocked."

**VS separator**: thin `1px` rule + centered pill: `background: white (light) / #1E1D1B (dark); border: 1px solid rgba(0,0,0,0.10); border-radius: 9999px; padding: 4px 12px; font: Inter 500 12px`

**Animations**: left card from -20px horizontal, right card from +20px, both fade in from `opacity: 0` on scroll-into-view, 500ms `ease-out`.

**Responsive**: below 768px stack vertically; "VS" becomes a horizontal divider.

---

### Section 4: Mechanism Triad ("Three Guarantees")

**Purpose**: Three core product mechanics — concrete facts, not vague benefits.

**Layout**: Three equal-width columns, max-width: 1100px, centered, 24px gaps.

**Color Treatment**: Section uses `var(--bg-section-alt)` — `#F4F4F5` (light) / `#161513` (dark). Subtle top rule: `1px solid rgba(0,0,0,0.06)` (light) / `rgba(255,255,255,0.06)` (dark).

**Section Heading** (above cards):

- Font: DM Sans 600, 48px/1.1, letter-spacing: -0.03em
- Light: `color: #111110`. Dark: `color: #F5F4F0`
- Text: **"Three things we guarantee every time."**

**Section Sub-heading**:

- Font: Inter 400, 18px/1.6, color: `#52514c` (light) / `rgba(255,255,255,0.60)` (dark)
- Text: "Not reminders. Not suggestions. Hard constraints built into the release workflow."

**Three guarantee cards** — solid card recipe, both themes:

- Light: `background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)`
- Dark: `background: #1E1D1B; border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; padding: 32px; box-shadow: 0 1px 0 rgba(255,255,255,0.09) inset, 0 4px 20px rgba(0,0,0,0.35)`
- Hover (both themes): `transform: translateY(-4px)`, shadow-2, border brightens, 300ms `--ease-premium`

**Card 1: Artifact Enforcement**

- Icon: lock, 32px, `#EA6B04` (light) / `#F97316` (dark), in 48px circle with `rgba(234,107,4,0.12)` bg
- Heading: "Specs don't pass until the evidence does." — Inter 600 24px/1.35, `#111110` (light) / white (dark)
- Body: Inter 400 15px/1.6, `#52514c` (light) / `rgba(255,255,255,0.60)` (dark)
- UI fragment: disabled pass button with lock icon; `opacity: 0.40`, `cursor: not-allowed`
- Card link: "Artifact enforcement →" — `#EA6B04` (light) / `#FB923C` (dark), Inter 500 14px. Hover: `#C05A00` (light) / `#FDBA74` (dark), underline, arrow shifts right 4px.

**Card 2: Go/No-Go Decision Gate**

- Icon: flag, 32px, `#00CC80`, circle with `rgba(0,204,128,0.12)` bg
- Heading: "One screen. One decision. The record is sealed."
- Card link: `#00CC80`, hover `#00E591`

**Card 3: Run Immutability**

- Icon: shield-check, 32px, `#94A3B8` (dark) / `#64748B` (light), circle with `rgba(148,163,184,0.12)` bg
- Heading: "After the decision, nothing changes."
- Card link: `#94A3B8` (dark) / `#64748B` (light), hover Slate-300 / Slate-500

**Animations**:
- Section heading: fade in + slide up 16px, 600ms `--ease-page`
- Cards: stagger-fade-in — 0ms, 100ms, 200ms offsets, each slides up 20px, 600ms `--ease-page`
- Card 1 UI fragment: faint orange lock glow breathing 2s infinite. Card 2 Go button: faint green pulse. Card 3 LOCKED badge: static — by design.

**Responsive**: below 768px → single column, 16px gap.

---

### Section 5: How It Works (Compressed)

**Purpose**: 30-second mental model of the complete core loop.

**Layout**: Centered, max-width: 900px. Horizontal 4-step flow on desktop.

**Section Heading**:

- Font: DM Sans 600, 48px/1.1, letter-spacing: -0.03em
- Text: **"Build once. Enforce every time."**

**4-step horizontal stepper**: glass card nodes (nav-level glass treatment for the step cards, as elevated interactive elements) connected by dotted lines. Steps and content identical to v1. Step icons in `#FB923C` (Orange-400) steps 1–3, `#00CC80` step 4. Connector arrows `rgba(0,0,0,0.20)` (light) / `rgba(255,255,255,0.20)` (dark).

**Animations**: stagger-fade-in per node, 80ms delays. Connector lines draw left-to-right, `width: 0 → 100%`, 400ms `--ease-out`. Triggered 400ms after node animation.

**Responsive**: below 768px → vertical timeline layout.

---

### Section 6: Who It's For

**Purpose**: Make each persona feel directly addressed.

**Layout**: Two cards, max-width: 880px, centered, 24px gap.

**Section Heading**:

- Font: DM Sans 600, 48px/1.1, white (`#111110` light)
- Text: **"Built for the people who own the release."**

**Card 1: For QA Teams**

- Same solid card recipe as guarantee cards.
- Orange top-edge accent: 2px horizontal gradient stripe at card top — `background: linear-gradient(90deg, #EA6B04, transparent)` (light) / `linear-gradient(90deg, #F97316, transparent)` (dark), width: 60px
- Pain bullets: `×` prefix in `rgba(234,107,4,0.60)` (light) / `rgba(249,115,22,0.60)` (dark)
- CTA link: `#EA6B04` (light) / `#F97316` (dark)

**Card 2: For Engineering Managers**

- Green top-edge accent: `linear-gradient(90deg, #00CC80, transparent)`
- Pain bullets: same `×` treatment
- CTA link: `#00CC80` both themes

**Animations**: slide in from left/right (40px travel), 600ms `ease-out`. Pain bullets stagger 80ms each.

---

### Section 7: Comparison Row

**Purpose**: Dismantle the "we already have [X]" objection.

**Layout**: Centered table, max-width: 900px.

**Color Treatment**:
- Table container: `background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06)` (light)
- Dark: `background: #1E1D1B; border: 1px solid rgba(255,255,255,0.09)`

**Section Heading**:

- Font: DM Sans 600, 48px/1.1, letter-spacing: -0.03em
- Text: **"This isn't a checklist tool."**

**NoHotfix column highlight**: `rgba(234,107,4,0.06)` (light) / `rgba(249,115,22,0.06)` (dark) — very subtle warm wash.

**Table header row** — NoHotfix column: `border-top: 3px solid #EA6B04` (light) / `3px solid #F97316` (dark).

Check icons: `#00CC80`, 20px filled circle-check. Cross icons: `rgba(0,0,0,0.20)` (light) / `rgba(255,255,255,0.20)` (dark).

Row dividers: `1px solid rgba(0,0,0,0.06)` (light) / `rgba(255,255,255,0.06)` (dark).

Feature rows (5 rows, unchanged content from v1).

**Animations**: table fades in on scroll-into-view. NoHotfix column checkmarks animate in with `--ease-spring`, staggered 60ms per row.

---

### Section 8: Pricing Summary

**Purpose**: Remove the "how much does this cost?" barrier.

**Layout**: Centered, max-width: 960px. Three tier cards. Section uses `var(--bg-section-alt)`.

**Section Heading**:

- Font: DM Sans 600, 48px/1.1
- Text: **"Start free. Pay when you invite your team."**

**Three tier cards** — solid card recipe, both themes.

**Free tier card**:
- Light: `background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08)`
- Dark: `background: #1E1D1B; border: 1px solid rgba(255,255,255,0.08)`
- Price: "**$0**" — DM Sans 600 48px, `#111110` (light) / white (dark)
- CTA: "Start free" — secondary button style

**Growth tier** (featured):
- Light: `background: rgba(234,107,4,0.08); border: 1px solid rgba(234,107,4,0.30); border-radius: 20px` with 3px orange top-border
- Dark: `background: rgba(249,115,22,0.10); border: 1px solid rgba(249,115,22,0.30)` with 3px top-border
- Price: "**$29/mo**" — DM Sans 600 48px
- CTA: "Start free" — primary orange button
- Warm glow: `box-shadow: 0 0 40px rgba(234,107,4,0.15)` (light) / `rgba(249,115,22,0.15)` (dark)

**Scale tier**:
- Light: `background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08)`
- Dark: `background: #1E1D1B; border: 1px solid rgba(255,255,255,0.09); box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset`

**Animations**: stagger-fade-in on scroll, 0ms / 100ms / 200ms. Growth card scales subtly from 0.97 → 1.0.

**Responsive**: below 768px → stack vertically, Growth card first.

---

### Section 9: Final CTA

**Purpose**: The conversion close.

**Layout**: Centered, full-width, `120px top/bottom` padding.

**Color Treatment (light)**: `var(--bg-page)` — `#FAFAFA`. A subtle warm radial gradient behind the content: `radial-gradient(ellipse 800px 400px at 50% 50%, rgba(234,107,4,0.08) 0%, transparent 70%)` — barely there, just warmth.

**Color Treatment (dark)**: `#111110`. Radial glow `rgba(249,115,22,0.10) 0%, transparent 70%`.

**Headline**:

- Font: DM Sans 700, 64px/1.08, letter-spacing: -0.04em
- Light: `color: #111110` — solid, heavy, no gradient required. The weight is the authority.
- Dark: warm gradient — `linear-gradient(135deg, #FFFFFF 0%, #FED7AA 60%, #F97316 100%)` — visual bookend with the dark-mode hero
- Text: **"Ship it once."**

**Sub-headline**:

- Font: Inter 400, 18px/1.6, `#52514c` (light) / `rgba(255,255,255,0.55)` (dark), max-width: 480px
- Text: "Start building your first playbook today. No credit card required. No time limit on the Free plan."

**CTA Button**:

- Primary orange, centered
- Light: `background: #EA6B04; color: #ffffff; padding: 16px 36px; border-radius: 12px; font: Inter 500 16px`
- Hover: `background: #C05A00`, `transform: translateY(-1px)`, shadow deepens, 150ms
- Dark: `background: #F97316`. Hover: `background: #FB923C`
- Text: "Start free"

**Secondary link** below button: "See how it works →" — Inter 400 14px, muted color. Links to `/how-it-works`.

**Animations**:
- Headline: fade in + slide up 16px, 600ms `--ease-page`
- CTA button fades in 200ms after headline
- Dark mode only: radial glow breathes subtly between 0.08–0.13, 4s infinite

---

### Section 10: Footer

**Purpose**: Navigation, trust, legal.

**Layout**: Multi-column, max-width: 1100px. Background: `#111110` (Dark-900) — footer is always dark on both light and dark themes. It is a deliberate ground anchor.

Top border: `1px solid rgba(255,255,255,0.06)`.

**Left column**:
- NoHotfix logo — white variant (letterforms `#FFFFFF`, fire glyph gradient)
- Tagline: "Ship it once." — Inter 400 14px `rgba(255,255,255,0.40)`
- Legal: "© 2026 NoHotfix. All rights reserved." — Inter 400 12px `rgba(255,255,255,0.25)`
- Privacy Policy + Terms links — Inter 400 12px `rgba(255,255,255,0.35)`

**Center columns** (navigation):

Product: How It Works / Artifact Enforcement / Go/No-Go Gate / Audit Trail

Use Cases: For QA Teams / For Compliance Teams / For Engineering Managers

Resources: Pricing / Changelog / Blog / Documentation / About

All footer nav links: Inter 400 14px, `rgba(255,255,255,0.50)`. Hover: `rgba(255,255,255,0.90)`, 150ms. Underline on hover.

**Right column**:
- "Get started today" — Inter 500 14px `rgba(255,255,255,0.70)`
- "Start free" button — `background: #F97316; color: white; padding: 10px 20px; border-radius: 10px; font: Inter 500 14px` (footer always dark, so dark-mode orange)
- "No credit card required." — Inter 400 12px `rgba(255,255,255,0.30)`

**Responsive**:
- Below 957px: 2-column (brand + nav; CTA column removed)
- Below 768px: single column; CTA button removed
- Below 576px: compact single column, essential nav links only

---

## Storytelling Flow

The page is a descending argument:

1. **Hero** — "The release gate that holds." Bold claim. Proved visually by the blocked pass button in the product preview.
2. **Pain Hook** — "Your current tool can be bypassed. Ours can't." The "yes, exactly that" moment.
3. **Mechanism Triad** — "Here is what we guarantee." Concrete mechanics, not vague benefits.
4. **How It Works** — "Here is the workflow in four steps." Mental model in 30 seconds.
5. **Who It's For** — "This is made for you." Persona-specific acknowledgment.
6. **Comparison** — "Here's why your current tool doesn't do this." Pre-empts "we already have X."
7. **Pricing** — "Here's what it costs, and enforcement is on Free." Removes price barrier.
8. **Final CTA** — "So: start now." Logical conclusion.

The visitor enters the product's world from the first pixel — clean, confident, legible. The orange accents (logo, CTAs, section labels, card highlights) provide all the warmth and energy. The structured light page communicates that this product was built by people who do not waste words.

---

## Interaction and Animation Philosophy

**Layer 1 — On-load (fire once)**: pre-headline → headline → sub-headline → CTAs → product preview. Sequential, ~2.5s total.

**Layer 2 — Scroll-triggered reveals (fire once per element)**: `opacity: 0 → 1` + `translateY(24px) → 0`, 400ms `--ease-page`. `IntersectionObserver` threshold 0.15. Stagger groups with 80–100ms delays. Do not replay on scroll-back.

**Layer 3 — Idle/ambient (dark mode only, loop)**: hero preview border glow pulse (4s), final CTA radial glow breath (4s). Light mode has no ambient loops — unnecessary against a clean white surface. `prefers-reduced-motion` disables all layers.

**Hover**:
- Cards: `translateY(-4px)` + shadow-2 + border brightening, 300ms `--ease-premium`
- Links with arrows: arrow shifts right 4px, 200ms `--ease-out`
- CTA buttons: `translateY(-1px)` + shadow intensify, 150ms

**What is NOT animated**: the locked state on the immutable record card, table data, error states, navigation links (hover opacity only).

---

## Component-Level Implementation Notes

### Product Preview UI Simulation

Build as a React component with three hardcoded states (tabs). Use exact brand tokens from brand-identity.md. The disabled pass button state is the single most important visual element on the entire page. Do not use screenshots of the real product — they become stale.

### Comparison Table

Use a real HTML `<table>` for semantic/accessibility reasons. Scope the NoHotfix column highlight with a CSS class. Checkmarks and crosses: SVG icons (not Unicode).

### Pricing Cards

Feature list: 4–5 items maximum. The Growth card's border treatment is the recommended signal — do not add a "Recommended" banner. Early bird label: positive, not alarming.

### Page Performance

- Background is a flat CSS color per section — no fixed-position gradient element
- Product preview images: WebP, lazy-loaded below fold
- DM Sans: load via Google Fonts or `@fontsource-variable/dm-sans`, `font-display: swap`
- All scroll animations: `IntersectionObserver` API, not scroll listeners
- Orbiting dots (dark mode only): pure CSS `@keyframes transform: rotate()`, no JS

---

## Cross-Page Navigation

**From this page**:
- `/how-it-works` — hero secondary CTA, How It Works "See the full walkthrough →", footer
- `/features/artifact-enforcement`, `/features/go-no-go`, `/features/audit-trail` — guarantee card links, footer
- `/use-cases/qa-teams`, `/use-cases/engineering-managers` — persona card links, footer
- `/pricing` — Pricing Summary "See full pricing →", footer
- App signup — all "Start free" CTAs
- App login — "Log in" nav link

**Primary conversion funnel**: Landing → Hero → "Start free" → Signup (zero additional pages).
