# Homepage — NoHotfix.com

**URL**: `/`
**Design inspiration**: [todesktop.com](https://www.todesktop.com/) — dark-dominant, glassmorphism, premium micro-interactions
**Last updated**: 2026-03-10

---

## Page Purpose

Convert QA leads and VP Engineering who land on the homepage into Free tier signups — by making the enforcement mechanic viscerally clear in the first scroll, before any feature explanation or pricing. The page must answer "what is this and why does it matter to me" in the hero, then systematically dismantle every objection — "we already have Notion," "we already have TestRail," "this looks complex" — before the final CTA.

The page is not a feature catalog. It is an argument. The argument is: the tools you already use are advisory, and advisory is not good enough.

---

## Target Audience

- **Primary**: QA Lead / Senior QA Engineer who owns the release process but controls none of its enforcement. Has experienced at least one of: a tester skipping a spec, a compliance audit where they reconstructed evidence manually, a production incident traced to an untested scenario.
- **Secondary**: VP Engineering making the go/no-go call on a Slack thread, who has no formal record of what was known before they shipped.
- **Entry points**: Direct / word of mouth, LinkedIn ad targeting, SEO ("release checklist software", "pre-deployment checklist tool"), engineering community referrals (Rands, Ministry of Testing).

---

## Key Conversion Goal

**Primary**: "Start free" — sign up for Free tier. No credit card, no time limit.
**Secondary**: "See how it works" — navigate to `/how-it-works` for visitors who need more context before committing.

---

## Page Gradient Treatment (Global)

The page background is a single continuous vertical gradient that transitions across all sections. This is the defining visual characteristic, matching the ToDesktop reference:

```
Top (Hero): #F0F4FF — very light blue-white, near white
↓ (Pain Hook / Guarantees): Transitions through light blue-gray
↓ (How It Works): Transitions to medium indigo (#1A1640 / Base-700)
↓ (Who It's For): Deep purple (#130F2E / Base-800)
↓ (Comparison): Deep blue-purple (#0D0920 / Base-900)
↓ (Pricing / Final CTA): Near-black (#080412 / Base-950)
```

Implementation: A single `<div>` behind all sections with `background: linear-gradient(to bottom, #EEF2FF 0%, #C7D2FE 8%, #818CF8 20%, #1A1640 40%, #130F2E 60%, #0D0920 80%, #080412 100%)`. All sections sit on top of this with transparent or semi-transparent backgrounds. This creates the sensation of descending deeper into the product's world as you scroll.

---

## Page Structure

---

### Section 1: Sticky Navigation

**Purpose**: Persistent wayfinding and always-available conversion trigger. Must be present on every scroll position.

**Layout**: Full-width, fixed, `position: sticky; top: 0; z-index: 100`

**Content Elements**:

- **Left**: NoHotfix logo mark (three descending horizontal lines in `#0036FF`) + wordmark ("Release" in Inter 400, "Hawk" in Inter 700). Total height: 24px. Links to `/`.
- **Center**: Navigation links — "How It Works" (`/how-it-works`), "Features" (dropdown trigger: Artifact Enforcement, Go/No-Go Gate, Audit Trail), "Use Cases" (dropdown trigger: QA Teams, Compliance, Engineering Managers), "Pricing" (`/pricing`), "Changelog" (`/changelog`)
- **Right**: Two items — "Log in" (text link, `rgba(255,255,255,0.70)`) + "Start free" (primary blue button, `#0036FF`)

**Scroll Transform Behavior**:

- Default state (0–39px scroll): `background: transparent; border-bottom: 1px solid transparent`
- Scrolled state (40px+): Triggers `nav.scrolled`:
  - `background: rgba(13, 9, 32, 0.80)`
  - `border-bottom: 1px solid rgba(255,255,255,0.08)`
  - `backdrop-filter: blur(16px) saturate(180%)`
  - `transition: all 450ms cubic-bezier(0.6, 0.6, 0, 1)`

**Dropdown Menus**: Glass card treatment on open — `background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; backdrop-filter: blur(20px)`. Each dropdown item has an icon (linear, 2px stroke, 20px), a label, and a one-line description.

**Responsive behavior**:

- Below 957px: Center nav links collapse into hamburger icon (right side, before CTA button)
- Below 576px: "Start free" button text shortens to "Start free", "Log in" hidden (available inside hamburger menu)

**Button Styles**:

- "Start free": `background: #0036FF; color: white; padding: 8px 20px; border-radius: 10px; font: Inter 500 14px`. Has subtle inset white highlight: `box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset`. On hover: inset opacity increases to 0.24, color shifts to `#3361FF`, transition 150ms.
- "Log in": No background, just text at 70% white opacity. On hover: 100% opacity, 150ms.

---

### Section 2: Hero

**Purpose**: State the transformation in 5 seconds. The visitor must immediately understand: (1) what NoHotfix is, (2) why it matters to them, (3) what to do next. No ambiguity. No metaphors. No hedging.

**Layout**: Centered single-column, full-viewport-height (`min-height: 100vh`), content vertically centered with slight upward bias (60/40 split). Light background at the top of the page gradient — this section sits over the lightest part of the gradient.

**Color Treatment**: This section sits at the top of the gradient — near-white to light blue-indigo. Text is DARK (`#0F172A` for headlines, `#334155` for body) because this is the lightest section. This is a deliberate inversion of the ToDesktop pattern, which also opens light before going dark.

**Content Elements**:

**Pre-headline label** (above the main headline):

- Small pill badge: `border: 1px solid rgba(0,54,255,0.30); background: rgba(0,54,255,0.08); color: #0036FF; border-radius: 9999px; padding: 4px 14px; font: Inter 500 13px`
- Text: "Release readiness — built for engineering teams"
- Animation: Fades in first, 600ms after page load, `ease-out`

**Main Headline**:

- Font: Aeonik Pro 500, 74px/84px, letter-spacing: -0.03em
- Text: **"Watch every release land."**
- Color: Text gradient — `background: linear-gradient(135deg, #0F172A 0%, #1e3a5f 50%, #0036FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent`
- Animation: Loading shimmer sweeps across the text from left to right, 2.5s duration, fires once on load. After shimmer: text settles to final gradient state.
- Mobile (below 576px): 46px/52px

**Sub-headline** (below main headline, 24px gap):

- Font: Inter 400, 18px/28px, color: `#334155`
- Text: **"Your team can't mark a spec as passed without the evidence. The go/no-go decision is permanent. The record writes itself."**
- Max-width: 560px, centered
- Animation: Fades in 150ms after headline, `opacity: 0 → 1`, 600ms `ease-out`

**CTA Row** (below sub-headline, 40px gap):

- Two buttons side by side, centered, 12px gap between
- **Primary button**: "Start free — no credit card"
  - `background: #0036FF; color: white; padding: 14px 28px; border-radius: 10px; font: Inter 500 15px`
  - Inset highlight: `box-shadow: 0 1px 0 rgba(255,255,255,0.16) inset, 0 4px 16px rgba(0,54,255,0.40)`
  - On hover: `background: #3361FF`, inset increases to 0.28, lift shadow increases, scale: 1.02, transition 300ms `ease-premium`
  - Arrow icon (`→`) after text, shifts right 4px on hover, 300ms
- **Secondary button**: "See how it works"
  - `background: white; color: #0F172A; padding: 14px 28px; border-radius: 10px; font: Inter 500 15px; border: 1px solid rgba(0,0,0,0.12)`
  - `box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)`
  - On hover: `box-shadow` increases for lift, `border-color` shifts to `rgba(0,54,255,0.30)`, transition 300ms
  - Links to `/how-it-works`
- Animation: Both buttons fade in 300ms after sub-headline, sliding up 12px as they fade in

**Social proof micro-signal** (below CTAs, 24px gap):

- Font: Inter 400 13px, color: `#64748B`
- Text: "Free tier available. No credit card required. Full enforcement on every plan."
- Centered, no animation

**Product Preview** (below CTAs block, 64px gap):
This is the centerpiece visual element — equivalent to ToDesktop's animated terminal. It shows NoHotfix's core enforcement flow as a live UI simulation.

- **Container**: `max-width: 960px`, centered, `border-radius: 28px`
- **Outer frame**: Decorative browser chrome strip at the top — `background: rgba(13,9,32,0.06); border: 1px solid rgba(0,0,0,0.10); border-radius: 28px; padding: 12px 16px 0`
  - Three traffic-light dots (12px circles, `#EF4444`, `#F59E0B`, `#22C55E`)
  - Fake URL bar centered: `nohotfix.com/runs/release-v2.4.1` in Geist Mono 12px, `rgba(0,0,0,0.40)` text on `rgba(0,0,0,0.06)` pill
- **Inner UI simulation**: A faithful but simplified representation of the NoHotfix run execution view. Dark background (`#0D0920`) inside the browser frame.

**UI Simulation Content** — Three tabbed states that auto-cycle (6s per tab) with manual override:

Tab 1: "Execute specs"

- Shows a run execution view: spec list with 3 specs visible
- Spec 1: "API authentication flow" — Status badge: PASSED (green). Artifact attached: a small thumbnail labeled "auth-screenshot.png"
- Spec 2: "Payment gateway integration" — Status badge: IN PROGRESS (blue). Artifact requirement shown: "File upload required". Pass button state: DISABLED (grayed out, with tooltip "Upload required artifact to enable").
  - This is the key enforcement visual: the pass button is visually blocked. A small lock icon or blocked indicator beside it.
- Spec 3: "Error handling — 500 responses" — Status badge: PENDING (slate)
- Annotation overlay: Small tooltip pointing to the disabled pass button, text: "Blocked — artifact required"

Tab 2: "Go/No-Go decision"

- Shows the decision review screen
- Header: "Release v2.4.1 — Go / No-Go Review"
- Full spec list with outcomes — 2 passed (green badges), 1 failed (amber badge)
- Failed spec has amber "Failed" badge and severity indicator
- Go/No-Go action row: Two large buttons — "Ship it (Go)" (green, active) and "Hold (No-Go)" (amber)
- A text field below: "Justification required for Go with failures" — partially filled in
- Annotation: Small tooltip pointing to justification field: "Mandatory for Go with failures"

Tab 3: "Immutable record"

- Shows a completed, locked run in read-only state
- Header: "Release v2.4.1" with a lock icon and "LOCKED" badge (green)
- Decision block: "Go decision by Alex Chen · March 8, 2026 at 14:32 UTC"
- Justification block (Geist Mono 13px): "Minor auth token edge case in low-traffic scenario. Mitigation: server-side session invalidation on next request. Accepted risk."
- Spec list below in read-only view, artifacts rendered inline (thumbnail images visible)
- Annotation: "The record is sealed. Nothing in it can be changed."

**Tab Navigation**:

- Three tab labels at the top of the UI frame: "Execute specs", "Go/No-Go", "Record"
- Active tab: blue underline, Inter 500, white; inactive: Inter 400, `rgba(255,255,255,0.50)`
- Auto-cycles every 6s. Manual click overrides and pauses auto-cycle.
- Transition between tabs: fade out content (200ms) → swap content → fade in (300ms)

**Frame animation**:

- On initial load, the product preview slides up from 24px below while fading in (700ms after the CTAs appear)
- Subtle pulsing glow on the outer border: `box-shadow: 0 0 0 1px rgba(0,54,255,0.20), 0 24px 80px rgba(0,54,255,0.15)` that breathes (4s infinite ease-in-out) — pulse between 0.15 and 0.30 opacity on the glow

**Decorative elements around the preview** (subtle, not competing with content):

- Two small orbiting dots — abstract `border-radius: 50%` elements, 6px, `#0036FF` at 40% opacity, slowly orbiting the preview frame at different radii. One completes a revolution in 12s, the other in 18s. They are purely decorative, CSS `@keyframes rotate`.
- Fade mask at the bottom of the hero section: `mask-image: linear-gradient(to bottom, black 70%, transparent 100%)` on the preview container — it dissolves softly into the next section

**Responsive behavior**:

- Below 1040px: Preview max-width reduces to 100% with 32px horizontal padding
- Below 768px: UI simulation tabs collapse to scroll-horizontal indicator pills rather than full labels; preview shows Tab 1 only, no auto-cycle
- Below 576px: Product preview is still shown but at a reduced viewport scale (75% scale transform), so the key enforcement visual (blocked pass button) remains visible

---

### Section 3: Pain Hook

**Purpose**: Create the "yes, exactly that" recognition moment for the QA lead who has lived this. State the contrast (Notion vs. NoHotfix) in the most direct, economical language possible. No body copy — the juxtaposition does the work.

**Layout**: Centered, `max-width: 760px`, symmetric side-by-side comparison OR a before/after card pair. Background: transparent (sits over mid-gradient, transitioning from light to medium indigo).

**Color Treatment**: Section sits over the gradient transition from light blue to first indigo tones. Cards are white (for the "before" state) and glass-dark (for the "after" state).

**Content Elements**:

**Section label** (above cards):

- Font: Inter 500 13px, `#0036FF`, all-caps, letter-spacing: +0.08em
- Text: "THE PROBLEM WITH CHECKLISTS"

**Two-card contrast layout**:

**Left card — "The way it works now"**:

- Background: `white; border: 1px solid rgba(0,0,0,0.10); border-radius: 20px; padding: 32px`
- Contains a minimal representation of a Notion-style checkbox list:
  - Three rows, each with a checkbox and spec label
  - Checkboxes: two checked, one unchecked — but they are all visually identical; no enforcement signal
  - Font: Inter 400 14px, `#334155`
  - Row 1: ✅ "API authentication flow — passed"
  - Row 2: ✅ "Payment gateway — passed"
  - Row 3: ☐ "Error handling — not started"
- Below the list, a subtle caption in Inter 400 13px `#94A3B8`:
  - "Anyone can tick this. No evidence required."
- Card has a slight gray-wash tint to signal "this is the problem" — not alarming, just muted and flat
- Label above card: "Notion / Confluence checklist" in Inter 500 13px `#64748B`

**Right card — "NoHotfix"**:

- Background: `rgba(13,9,32,1.0)` (fully dark), `border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; padding: 32px`
- Contains the same three specs, but with the NoHotfix enforcement state:
  - Row 1: Green "Passed" badge — artifact thumbnail shown inline (small 40x40 image preview)
  - Row 2: Blue "In Progress" badge — pass button visible but DISABLED with lock icon
  - Row 3: Slate "Pending" badge — pass button not yet reachable
- Below the list, caption in Inter 400 13px `rgba(255,255,255,0.50)`:
  - "The pass action is blocked. Not warned. Blocked."
- Label above card: "NoHotfix" in Inter 500 13px `#6688FF`

**Visual separator between cards**: A vertical dividing element (desktop only) — thin `1px` line `rgba(0,0,0,0.15)`, with the word "VS" in a centered pill: `background: white; border: 1px solid rgba(0,0,0,0.10); border-radius: 9999px; padding: 4px 12px; font: Inter 500 12px #334155`

**Animations**:

- Cards enter with a subtle stagger: left card from -20px horizontal, right card from +20px horizontal. Both fade in from `opacity: 0`. Triggered on scroll-into-view. Duration: 500ms `ease-out`.
- Right card (NoHotfix): the disabled pass button has a very subtle amber glow pulse on the lock icon — `box-shadow: 0 0 8px rgba(245,158,11,0.50)` breathing 2s infinite. This draws the eye to the enforcement signal.

**Responsive behavior**:

- Below 768px: Stack vertically, left card on top, right card below, "VS" separator becomes a horizontal divider between them
- Below 576px: Cards reduce to 90% viewport width

---

### Section 4: The Three Guarantees

**Purpose**: State the three core product guarantees (the messaging pillars) as concrete facts. Each guarantee is paired with a product screenshot/UI demonstration. This is the first place the product's specific mechanics get named.

**Layout**: Three equal-width columns on desktop (bento grid approach), each containing a heading, a supporting sentence, and a product UI card visual. Max-width: 1100px, centered, 24px column gaps.

**Color Treatment**: Section sits over medium indigo gradient (`#1A1640` / Base-700 territory). Cards are glass-dark with subtle inner lighting (the standard glass recipe). Section has a very subtle horizontal rule at the top: `1px solid rgba(255,255,255,0.06)`.

**Section Heading** (above cards):

- Font: Aeonik Pro 500, 48px/52px, letter-spacing: -0.025em
- Color: White (`#FFFFFF`)
- Text: **"Three things we guarantee every time."**
- Centered, max-width: 600px

**Section Sub-heading**:

- Font: Inter 400, 18px/28px, color: `rgba(255,255,255,0.60)`
- Text: "Not reminders. Not suggestions. Hard constraints built into the release workflow."
- Centered, max-width: 520px, 16px below heading

**Three guarantee cards**:

**Card 1: Artifact Enforcement**

- Glass card recipe: `background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; padding: 32px; backdrop-filter: blur(12px)`
- Inset top-edge light: `box-shadow: 0 1px 0 rgba(255,255,255,0.10) inset, 0 4px 24px rgba(0,0,0,0.40)`
- **Card icon**: A lock icon (linear, 2px stroke, 32px) in `#0036FF`, inside a `48px × 48px` circle with `background: rgba(0,54,255,0.12); border: 1px solid rgba(0,54,255,0.20); border-radius: 9999px`
- **Card heading**: "Specs don't pass until the evidence does." — Inter 600 24px/32px, white, letter-spacing: -0.01em
- **Card body**: "Every spec declares exactly what evidence is required — a file, a log, a measurement, a URL. The pass action is blocked until every requirement is satisfied. No exceptions, no workarounds." — Inter 400 15px/24px, `rgba(255,255,255,0.60)`
- **Card visual**: A minimal UI fragment showing a spec row with a DISABLED pass button and a tooltip: "2 of 3 artifacts required". Blue lock icon on the button. The button has `opacity: 0.40`, cursor: not-allowed. Dimensions: full card width, `height: 140px`, sits below the body text, `border-radius: 12px`, `background: rgba(0,0,0,0.30)`
- **Card link**: "Artifact enforcement →" in Inter 500 14px `#6688FF` at card bottom. On hover: color shifts to `#99AAFF`, underline appears, arrow shifts right 4px.

**Card 2: Go/No-Go Decision Gate**

- Same glass card recipe as Card 1
- **Card icon**: A flag icon in `#00CC80` (Go green), same circle treatment with `rgba(0,204,128,0.12)` background
- **Card heading**: "One screen. One decision. The record is sealed." — same style
- **Card body**: "The release decision is formal: role-gated to Admins, only available after every spec reaches a terminal state. A Go with failures requires mandatory written justification — permanently recorded." — same style
- **Card visual**: A minimal representation of the Go/No-Go decision buttons — a green "Ship it (Go)" button and an amber "Hold (No-Go)" button side by side, with a spec severity list visible above them. Dimensions same as Card 1 visual.
- **Card link**: "Go/No-Go gate →" in `#00CC80` at card bottom. On hover: `#00E591`.

**Card 3: Run Immutability**

- Same glass card recipe
- **Card icon**: A shield-check icon in `#99AAFF` (blue-200), same circle with `rgba(153,170,255,0.12)` background
- **Card heading**: "After the decision, nothing changes." — same style
- **Card body**: "Once the go/no-go decision is recorded, the run is locked — permanently. No edits, no overwrites. The record contains every artifact submitted, the decision with decider identity and timestamp, and any written justification. Send the URL to your auditor." — same style
- **Card visual**: A read-only run record fragment — a large LOCKED status badge (green), a decision record block in Geist Mono showing the decision timestamp and decider name, and a small artifact grid showing locked thumbnails. Dimensions same as above.
- **Card link**: "Immutable audit trail →" in `#99AAFF` at card bottom.

**Animations**:

- Section heading: fades in + slides up 16px on scroll-into-view, 600ms `ease-out`
- Cards: stagger-fade-in — Card 1 at 0ms, Card 2 at 100ms, Card 3 at 200ms. Each slides up 20px while fading in. 600ms `ease-out`. Triggered when the section enters viewport.
- Cards on hover: `transform: translateY(-4px)`, `box-shadow` increases from shadow-1 to shadow-2, `border-color` shifts to `rgba(255,255,255,0.18)`. Transition 300ms `ease-premium`.
- Card visuals: The UI fragments within each card have a subtle idle animation. Card 1's disabled button has the amber lock glow. Card 2's Go button has a very faint green pulse. Card 3's LOCKED badge is static — by design (it is immutable, it does not animate).

**Responsive behavior**:

- Below 1040px: 3 columns remain but card padding reduces to 24px
- Below 768px: Collapses to single column, cards stack vertically with 16px gap
- Below 576px: Cards go full viewport width with 16px horizontal padding

---

### Section 5: How It Works (Compressed)

**Purpose**: Give the visitor a 30-second mental model of the complete core loop — enough to understand what they would be adopting, without the full detail of `/how-it-works`. This section should prompt a "that actually makes sense" reaction, not overwhelm. The link to `/how-it-works` exists for those who want depth.

**Layout**: Centered, max-width: 900px. A horizontal 4-step flow on desktop (stepper/connector pattern). Below each step, a short label and one-sentence description.

**Color Treatment**: Deep indigo / `Base-800` gradient territory. Section header in white. Step items in glass-card style, connected by thin lines.

**Section Heading**:

- Font: Aeonik Pro 500, 48px/52px, letter-spacing: -0.025em, white
- Text: **"Build once. Enforce every time."**
- Centered

**Section Sub-heading**:

- Font: Inter 400, 18px/28px, `rgba(255,255,255,0.60)`
- Text: "The core loop, from playbook to permanent record."

**4-step horizontal stepper**:

Each step is a glass card node with an icon, a number label, a step name, and a one-sentence description. Nodes are connected by horizontal dotted lines (`border-top: 1px dashed rgba(255,255,255,0.15)`).

**Step 1: Build a playbook**

- Icon: Layers icon (linear, 2px stroke, 24px) in `#6688FF`
- Step number: "01" in Inter 500 12px `rgba(255,255,255,0.30)`
- Step name: "Build a playbook" in Inter 600 16px white
- Description: "Create reusable specs in the Spec Library. Assemble them into playbook sections. Define exactly what evidence each spec requires." Inter 400 14px `rgba(255,255,255,0.55)`, max-width: 180px

**Step 2: Start a run**

- Icon: Play icon in `#6688FF`
- Step number: "02"
- Step name: "Start a run"
- Description: "The playbook is frozen at start time — a snapshot. Template changes don't affect the in-progress run."

**Step 3: Execute with evidence**

- Icon: Upload icon in `#0036FF`
- Step number: "03"
- Step name: "Execute with evidence"
- Description: "Testers work through specs. Each one requires the declared evidence before the pass action unlocks."

**Step 4: Make the call**

- Icon: Check-circle icon in `#00CC80`
- Step number: "04"
- Step name: "Make the call"
- Description: "The Admin reviews every outcome, makes the go/no-go decision, and the run locks permanently."

**Connector arrows**: Between each node, a thin arrow (`→`) in `rgba(255,255,255,0.20)`, centered vertically.

**Link below stepper**:

- "See the full walkthrough →" in Inter 500 15px `#6688FF`. Links to `/how-it-works`. On hover: color `#99AAFF`, arrow shifts right.

**Animations**:

- Stepper nodes enter with a stagger on scroll-into-view: each node delays 80ms. Fade in + slight scale up from `scale(0.96)`. 500ms `ease-spring`.
- Connector lines "draw" from left to right after nodes appear — `width: 0 → 100%` on the connecting elements, 400ms `ease-out`, triggered 400ms after node animation.
- On hover of individual nodes: `transform: translateY(-3px)`, transition 200ms. Connector to the next node gains a blue tint on the node's hover state.

**Responsive behavior**:

- Below 768px: Collapse to a vertical timeline layout. Steps stack vertically with a vertical dotted left-border instead of horizontal connectors.
- Below 576px: Same vertical layout, full width, reduced padding.

---

### Section 6: Who It's For

**Purpose**: Make each persona feel directly addressed. Two cards — one for QA teams, one for compliance-driven teams — each with a specific pain statement and a direct navigation link to the relevant use case page.

**Layout**: Two cards side by side, max-width: 880px, centered, 24px gap. Cards are larger and more content-rich than the guarantee cards — these are persona cards, not feature cards.

**Color Treatment**: Dark, `Base-900` territory. Cards are elevated glass (slightly more opaque than standard). Each card has a subtle color accent from the persona's primary concern.

**Section Heading**:

- Font: Aeonik Pro 500, 48px/52px, white, centered
- Text: **"Built for the people who own the release."**

**Card 1: For QA Teams**

- Elevated glass recipe: `background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 40px; backdrop-filter: blur(16px)`
- Blue top-edge accent: a 2px horizontal gradient stripe at the very top of the card: `background: linear-gradient(90deg, #0036FF, transparent)`, width: 60px, `border-radius: 9999px`
- **Card label**: "For QA Teams" — Inter 500 13px `#6688FF`, all-caps, letter-spacing: +0.08em
- **Card heading**: "Stop chasing testers for screenshots." — Inter 600 30px/38px, white, letter-spacing: -0.015em
- **Card body**: "You own the release process but can't control whether testers actually do the work. NoHotfix makes it impossible to close a spec without the evidence. The process enforces itself." — Inter 400 16px/26px, `rgba(255,255,255,0.65)`
- **Pain bullets** (3 items, below body):
  - "Testers marking specs as passed without running them"
  - "Screenshots uploaded after the fact — or not at all"
  - "Evidence reconstruction before every compliance audit"
  - Each prefixed with a subtle `×` in `rgba(245,158,11,0.70)` (amber — this is the "before" state, the pain)
- **CTA link**: "For QA teams →" — Inter 600 15px, `#0036FF`. Links to `/use-cases/qa-teams`. On hover: `#3361FF`, arrow shifts right.

**Card 2: For Engineering Managers**

- Same glass recipe, but with a green (`#00CC80`) top-edge accent
- **Card label**: "For Engineering Managers" — Inter 500 13px `#00CC80`
- **Card heading**: "Know your release is ready before you ship." — Inter 600 30px/38px, white
- **Card body**: "The go/no-go call happens in a Slack thread. You trust the QA spreadsheet is current. If something goes wrong, there's no record of what you knew. NoHotfix gives you a formal decision interface and an immutable record of every call you make." — Inter 400 16px/26px, `rgba(255,255,255,0.65)`
- **Pain bullets** (3 items):
  - "Go/no-go decisions with no documented basis"
  - "No single view of what has been tested and what failed"
  - "Post-incident with no record of what was known before shipping"
  - Each prefixed with `×` in `rgba(245,158,11,0.70)`
- **CTA link**: "For engineering managers →" — Inter 600 15px, `#00CC80`. Links to `/use-cases/engineering-managers`.

**Animations**:

- Cards slide in from left and right respectively on scroll-into-view, 40px of travel, 600ms `ease-out`.
- Pain bullets enter with a small stagger (80ms each) after the card is visible.
- Hover: Standard lift effect — `translateY(-4px)`, shadow-2, 300ms.

**Note**: A third persona card (Compliance Teams) is intentionally omitted here to keep the section scannable. The "Compliance" use case is surfaced in the comparison section below and in the Pricing section. Adding all three personas would dilute the impact.

**Responsive behavior**:

- Below 768px: Stack vertically, full width, 16px gap.

---

### Section 7: Comparison Row

**Purpose**: Dismantle the "we already have [X]" objection pre-emptively. Show that NoHotfix is not a checklist tool — it is the only tool that scores "yes" across all five release-critical dimensions. The comparison must be factually accurate and not gratuitously negative.

**Layout**: Centered table, max-width: 900px. Five feature rows, five columns (Feature name + NoHotfix + Notion/Confluence + TestRail + Jira). Alternating subtle row backgrounds for readability.

**Color Treatment**: `Base-900` territory, dark. The table is a glass card container. NoHotfix's column has a subtle blue highlight treatment to draw the eye.

**Section Heading**:

- Font: Aeonik Pro 500, 48px/52px, white, centered
- Text: **"This isn't a checklist tool."**

**Section Sub-heading**:

- Font: Inter 400, 18px/28px, `rgba(255,255,255,0.60)`
- Text: "Five dimensions that separate release governance from release checklists."

**Comparison table**:

Table container: `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden`

Column headers:
| — | NoHotfix | Notion / Confluence | TestRail | Jira |
|---|---|---|---|---|

NoHotfix column header has a blue top-border highlight (3px, `#0036FF`) and slightly higher background opacity.

Feature rows (5 rows):
| Feature | NoHotfix | Notion | TestRail | Jira |
|---|---|---|---|---|
| **Artifact-gated pass action** | ✅ | ✗ | ✗ | ✗ |
| **Role-gated go/no-go decision** | ✅ | ✗ | ✗ | ✗ |
| **Immutable run records** | ✅ | ✗ | ✗ | ✗ |
| **Release-centric UX** | ✅ | ✗ | ✗ | ✗ |
| **Lightweight adoption (< 1 day)** | ✅ | ✅ | ✗ | ✗ |

Check icons: `#00CC80` (Go green), 20px filled circle-check icon. Cross icons: `rgba(255,255,255,0.20)`, 20px × icon.

Row styling: `border-top: 1px solid rgba(255,255,255,0.06)`. Feature name column: Inter 500 15px white. Other cells: centered icon only.
NoHotfix column: `background: rgba(0,54,255,0.06)` — very subtle blue wash on just that column.

**Footnote below table**:

- Inter 400 13px `rgba(255,255,255,0.35)`
- "TestRail and Zephyr manage test case libraries. Jira tracks tickets. Notion holds documents. NoHotfix enforces the release gate — and they can coexist."

**Animations**:

- Table container fades in on scroll-into-view, 600ms.
- Checkmarks in the NoHotfix column animate in with `ease-spring` scale (from 0 to 1), staggered 60ms per row, 400ms each. This draws the eye down the NoHotfix column and creates a satisfying "all green" reveal.

**Responsive behavior**:

- Below 768px: TestRail and Jira columns collapse into a single "Other tools" column showing just Xs. NoHotfix and Notion columns remain.
- Below 576px: Full table becomes a card-per-feature format — each feature as a card showing NoHotfix (yes) vs. others (no).

---

### Section 8: Pricing Summary

**Purpose**: Show that getting started is free and the pricing is simple. This is not the full pricing page — it is a trust-building summary that removes the "how much does this cost?" barrier and directs interested visitors to the full pricing page.

**Layout**: Centered, max-width: 960px. Three pricing tier cards side by side (Free, Growth, Scale), plus an Enterprise note below. CTA to `/pricing` for full detail.

**Color Treatment**: `Base-950` territory, very dark. Cards are glass with progressively heavier borders to visually communicate tier levels.

**Section Heading**:

- Font: Aeonik Pro 500, 48px/52px, white, centered
- Text: **"Start free. Pay when you invite your team."**

**Section Sub-heading**:

- Font: Inter 400 18px `rgba(255,255,255,0.60)`, centered
- Text: "Flat monthly fee per team. No per-seat pricing. The enforcement triad is on every tier — including Free."

**Early Bird Banner** (above the tier cards):

- Pill badge: `background: rgba(0,204,128,0.12); border: 1px solid rgba(0,204,128,0.25); border-radius: 9999px; padding: 6px 16px; color: #00CC80; font: Inter 500 13px`
- Text: "Early bird pricing — first 100 paying organisations. Locked for life."

**Three tier cards**:

**Free tier**:

- `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px`
- **Tier label**: "Free" — Inter 500 14px `rgba(255,255,255,0.50)`, uppercase
- **Price**: "$0" — Aeonik Pro 500 48px white
- **Tagline**: "For solo evaluation" — Inter 400 14px `rgba(255,255,255,0.50)`
- **Feature list** (3 items): Full enforcement triad / 1 seat / Unlimited playbooks + runs
- **CTA**: "Start free" — secondary-light button style (white background, dark text, 14px Inter 500). Full width.
- Each feature list item: `✓` in `#00CC80`, Inter 400 14px white

**Growth tier** (featured/recommended):

- `background: rgba(0,54,255,0.10); border: 1px solid rgba(0,54,255,0.30); border-radius: 20px; padding: 32px`
- Blue top-border highlight: 3px `#0036FF` at top
- **Tier label**: "Growth" with "Most popular" pill badge beside it: `background: rgba(0,54,255,0.20); color: #6688FF; border: 1px solid rgba(0,54,255,0.30)`
- **Price**: "$29/mo" — Aeonik Pro 500 48px white; "early bird" in Inter 400 13px `#6688FF`
- **Tagline**: "For QA teams" — Inter 400 14px `rgba(255,255,255,0.60)`
- **Feature list** (4 items): Everything in Free / Up to 10 seats / Audit-grade export (PDF/JSON) / Email notifications
- **CTA**: "Start free" — primary blue button, full width
- Slightly elevated shadow: `box-shadow: 0 0 40px rgba(0,54,255,0.25)`

**Scale tier**:

- `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; padding: 32px`
- **Tier label**: "Scale"
- **Price**: "$99/mo" — Aeonik Pro 500 48px white; "early bird" in Inter 400 13px `rgba(255,255,255,0.40)`
- **Tagline**: "For compliance-driven teams" — Inter 400 14px `rgba(255,255,255,0.50)`
- **Feature list** (4 items): Everything in Growth / Up to 40 seats / 1-day SLA / Priority support
- **CTA**: "Start free" — tertiary dark button (subtle white)

**Enterprise note** (below cards):

- Centered, Inter 400 15px `rgba(255,255,255,0.55)`
- "Need 40+ seats, SSO, or custom data residency? " + "Talk to us →" link in `#6688FF`

**Link to full pricing** (below enterprise note):

- "See full pricing →" in Inter 500 15px `#6688FF`, centered. Links to `/pricing`.

**Animations**:

- Tier cards stagger-fade-in on scroll: 0ms, 100ms, 200ms offsets. Slide up 20px while fading in. 600ms `ease-out`.
- Growth card (featured): enters with a very subtle scale from 0.97 to 1.0, making it feel like it "pops" into place slightly more dramatically.

**Responsive behavior**:

- Below 768px: Stack vertically. Growth card shown first (reorder).
- Below 576px: Cards full width with 16px padding.

---

### Section 9: Final CTA

**Purpose**: The conversion close. Visitor has now seen the value proposition, the enforcement mechanic, the workflow, the competitive context, and the pricing. This section removes all remaining friction and makes the final ask with maximum clarity.

**Layout**: Centered, full-width, generous vertical padding (`120px top/bottom`). No competing elements — just the message and the CTA.

**Color Treatment**: `Base-950` — the darkest point of the page. A subtle radial glow behind the content: `radial-gradient(ellipse 800px 400px at 50% 50%, rgba(0,54,255,0.12) 0%, transparent 70%)` — creates the sensation of a spotlight on the final message.

**Content Elements**:

**Pre-CTA label**:

- Small lock icon (16px, `rgba(255,255,255,0.30)`) beside text
- Font: Inter 500 13px `rgba(255,255,255,0.40)`, centered
- Text: "Available on every plan, including Free."

**Headline**:

- Font: Aeonik Pro 500, 64px/72px, letter-spacing: -0.025em
- Color: White-to-blue gradient: `linear-gradient(135deg, #FFFFFF 0%, #99AAFF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent`
- Text: **"Watch every release land."**
- Centered

**Sub-headline**:

- Font: Inter 400, 18px/28px, `rgba(255,255,255,0.55)`, centered, max-width: 480px
- Text: "Start building your first playbook today. No credit card required. No time limit on the Free plan."

**CTA Button**:

- Primary blue, centered, slightly larger than nav version: `padding: 16px 36px; font: Inter 500 16px; border-radius: 12px`
- `background: #0036FF; color: white`
- Inset highlight: `box-shadow: 0 1px 0 rgba(255,255,255,0.16) inset, 0 8px 40px rgba(0,54,255,0.40)`
- On hover: `background: #3361FF`, lift shadow intensifies, `transform: translateY(-1px)`, scale: 1.02, 300ms
- Text: "Start free"

**Secondary link** below button:

- "See how it works →" — Inter 400 14px `rgba(255,255,255,0.40)`. Links to `/how-it-works`. On hover: `rgba(255,255,255,0.70)`.

**Animations**:

- Headline enters with the same shimmer-then-settle animation as the hero headline (shorter 1.5s version)
- CTA button fades in last, 200ms after headline settles
- The radial glow behind the section breathes subtly: opacity pulses between 0.12 and 0.18 over 4s infinite — same treatment as the hero preview glow

---

### Section 10: Footer

**Purpose**: Navigation, trust, and legal. Functional, not promotional. The footer must be present and complete, but must not compete with the final CTA above it.

**Layout**: Multi-column, max-width: 1100px, centered. Background: `#080412` (Base-950 flat, no gradient — the gradient ends above the footer).

**Color Treatment**: Flat dark, `Base-950`. Top border: `1px solid rgba(255,255,255,0.06)`.

**Content Elements**:

**Left column** (brand + legal):

- NoHotfix logo mark + wordmark, white
- Tagline below: "Watch every release land." in Inter 400 14px `rgba(255,255,255,0.40)`
- Legal text below: "© 2026 NoHotfix. All rights reserved." in Inter 400 12px `rgba(255,255,255,0.25)`
- Below legal: Privacy Policy link + Terms of Service link, Inter 400 12px `rgba(255,255,255,0.35)`, horizontal

**Center columns** (navigation — 3 sub-columns):

Column: "Product"

- How It Works
- Artifact Enforcement
- Go/No-Go Gate
- Audit Trail

Column: "Use Cases"

- For QA Teams
- For Compliance Teams
- For Engineering Managers

Column: "Resources"

- Pricing
- Changelog
- Blog
- Documentation
- About

All footer nav links: Inter 400 14px, `rgba(255,255,255,0.50)`. On hover: `rgba(255,255,255,0.90)`, transition 150ms. No underline by default; underline on hover.

**Right column** (CTA prompt):

- Small heading: "Get started today" in Inter 500 14px `rgba(255,255,255,0.70)`
- "Start free" button (smaller version of the primary CTA): `padding: 10px 20px; border-radius: 10px; background: #0036FF; color: white; font: Inter 500 14px`
- Below button: "No credit card required." in Inter 400 12px `rgba(255,255,255,0.30)`

**Footer bottom bar** (below main columns, separated by `1px solid rgba(255,255,255,0.05)`):

- Status page link: "Status" — links to external status page (Statuspage.io)
- No social icons at launch (no established social presence yet)

**Responsive behavior**:

- Below 957px: 2-column footer (brand + nav on left, use cases + resources on right; CTA column removed)
- Below 768px: Single column, stacked sections; CTA button removed from footer
- Below 576px: Compact single column; only essential nav links remain (Home, Pricing, Docs, About)

---

## Storytelling Flow

The page is a descending argument, not a feature list. The narrative arc:

1. **Hero** — "Here's the transformation: release with proof." Makes a bold claim. Proves it visually in the product preview.

2. **Pain Hook** — "You recognise this. Your current tool can be bypassed. Ours can't." Creates the contrast moment. The visitor who has lived the checklist problem sees it mirrored back exactly.

3. **Three Guarantees** — "Here is what we guarantee, specifically." Gives the claim substance. Each guarantee is a named mechanic, not a vague benefit.

4. **How It Works** — "Here is the workflow in four steps." Reduces cognitive load. The visitor can now picture what adoption looks like.

5. **Who It's For** — "This is made for you." The persona-specific acknowledgment. Makes the visitor feel the product was designed with their exact situation in mind.

6. **Comparison** — "Here's why your current tool doesn't do this." Pre-empts the "we already have X" objection with specific, factual evidence.

7. **Pricing** — "Here's what it costs — and the enforcement is on Free." Removes the price barrier. Establishes that evaluation is possible without commitment.

8. **Final CTA** — "So: start now." The logical conclusion. No new information, just the call.

The color progression reinforces this arc: the page opens in cool daylight (light blue-white) and descends into deep night (near-black). The visitor moves from the familiar (bright, open, recognizable pain) into the product's world (dark, precise, formal) — a visual metaphor for the transition from informal checklists to enforced workflows.

---

## Interaction and Animation Philosophy

The page has three layers of motion:

**Layer 1 — On-load animations (fire once)**:

- Hero label → headline shimmer → sub-headline → CTAs → product preview (sequential, total ~2.5s)
- These are load-time reveals, not scroll-triggered. They happen as the page paints.

**Layer 2 — Scroll-triggered reveals (fire once per element)**:

- Every section below the hero has scroll-triggered entrance animations.
- Pattern: fade in + translateY(20px → 0), duration 500–600ms, `ease-out`.
- Use `IntersectionObserver` with a 0.15 threshold (element 15% visible triggers the animation).
- Stagger groups (e.g., three guarantee cards) with 80–100ms delays.
- Animation fires once — do not repeat on scroll back up.

**Layer 3 — Idle/ambient animations (loop infinitely)**:

- Hero glow pulse on preview border: 4s ease-in-out infinite
- Decorative orbiting dots: 12s and 18s rotation
- Final CTA radial glow breath: 4s ease-in-out infinite
- These should be `prefers-reduced-motion` aware: disable completely when the OS accessibility setting is set.

**Hover interactions**:

- All cards: `translateY(-4px)` + shadow increase + border brightening, 300ms `ease-premium`
- All links with arrows: arrow shifts right 4px, 200ms `ease-out`
- CTA buttons: scale 1.02 + shadow intensify, 150–300ms

**What is NOT animated**:

- The "locked" state on the immutable record card — immutability is a fact, not a transition
- Table data and feature comparison checkmarks on the comparison table (only the NoHotfix column's checks animate on scroll-in)
- Error states
- Navigation links (only hover opacity change, no motion)

---

## Cross-Page Navigation

**From this page, the visitor can reach**:

- `/how-it-works` — via "See how it works" CTA (hero), "See the full walkthrough →" link (How It Works section), footer
- `/features/artifact-enforcement` — via "Artifact enforcement →" card link (Three Guarantees section), footer
- `/features/go-no-go` — via "Go/No-Go gate →" card link, footer
- `/features/audit-trail` — via "Immutable audit trail →" card link, footer
- `/use-cases/qa-teams` — via "For QA teams →" card link (Who It's For section), footer
- `/use-cases/engineering-managers` — via "For engineering managers →" card link, footer
- `/use-cases/compliance` — via pricing summary mention, footer
- `/pricing` — via "See full pricing →" link (Pricing Summary section), footer
- App signup — via all "Start free" CTAs (hero, nav, final section, footer)
- App login — via "Log in" nav link

**Primary conversion funnel**:

1. Landing → Hero → "Start free" → Signup (direct conversion, zero additional pages)
2. Landing → Hero → "See how it works" → `/how-it-works` → "Start free" → Signup (depth-seeker conversion)
3. Landing → Scroll → Three Guarantees → Feature deep-dive page → "Start free" → Signup (technical evaluator)

**The page is designed so that** a QA lead who arrives with a specific pain (e.g., "I need to make it impossible to skip screenshot submission") can confirm within 2–3 sections that NoHotfix solves exactly that, and convert without visiting any other page. The breadth visitor who arrives without a specific pain is guided through the narrative arc to discover the problem before being offered the solution.

---

## Component-Level Implementation Notes

### Product Preview UI Simulation

This is the highest-effort component on the page. It must look faithful to the real product — not a cartoon mockup. Recommendations:

- Build as a React component with three hardcoded "states" (tabs)
- Use the actual brand tokens (glass cards, badge styles, button states) from `docs/design/brand-identity.md`
- The disabled pass button state is the single most important visual element on the entire page — it must be instantly legible as "blocked" not "loading"
- Do not use screenshots of the real product (they become stale). Use a purpose-built demo component.

### Comparison Table

- Use a real HTML `<table>` (not a CSS grid) for semantic/accessibility reasons
- Scope the NoHotfix column highlight with a CSS class, not inline style, so it can be updated easily
- Checkmarks and crosses: use SVG icons (not Unicode characters) for precise rendering across platforms

### Pricing Cards

- The "early bird" label must be visually distinct but not alarm-inducing — it is a positive signal ("price locked"), not a warning
- Keep the feature list on each card to maximum 4–5 items. This is a summary, not the full feature matrix
- The Growth card being "featured" (blue border, blue glow) is the primary visual signal — do not add a "Recommended" banner that competes with the border treatment

### Page Performance

- The background gradient is a single CSS gradient on a `position: fixed` pseudo-element — one paint operation, not per-section gradients
- Product preview images/thumbnails: WebP format, lazy-loaded below the fold
- Aeonik Pro font: load via `font-display: swap`, subset to used glyphs only
- All scroll animations: use `IntersectionObserver` API, not scroll event listeners
- Decorative orbiting dots: pure CSS `@keyframes transform: rotate()`, no JS
