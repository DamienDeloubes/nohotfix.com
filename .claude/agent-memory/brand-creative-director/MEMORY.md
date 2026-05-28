# Brand Creative Director — Memory Index

## Source of truth

The brand is defined in the repo docs — treat these as canonical and read them before
acting; do not rely on remembered brand specs:

- `docs/design/brand-identity.md`, `docs/marketing/messaging.md`,
  `docs/marketing/positioning.md`, `docs/product-vision.md`.

See [[brand-identity]] for a quick pointer + anchors.

## Quick anchors — v5.0 (CANONICAL)

- Product: **NoHotfix** · Domain: nohotfix.com · Tagline: **"Ship it once."**
- Hero headline (marketing): **"The release gate that holds."**
- Vocabulary: ship it once · caught before production · no surprises in prod · proof before you ship
- Light CTA orange `#EA6B04` (Orange-600); light inline link `#9A3F05` (Orange-800, AA on `#FAFAFA`)
- Dark primary orange `#F97316` (Orange-500); fire gradient `#FF8D28 → #FF0000` (logo only)
- Light bg `#FAFAFA`; dark bg `#111110` (warm near-black, replaces retired `#0D0920` violet)
- Display: **DM Sans** 600–700 (replaces unlicensed Aeonik Pro) · UI: Inter · Mono: Geist Mono
- Glass model A: nav + overlays only (both themes); cards SOLID both themes
- Go `#00CC80`; No-Go yellow `#EAB308`; Error crimson `#F43F5E`; logo: unchanged
- Blue `#0036FF` RETIRED. Violet base palette RETIRED.
- Token file: `packages/design-tokens/src/tokens.css` (authoritative)

## User Preferences

- Wants sparring / opinionated dialogue, not diplomatic hedging
- Rejected: indigo palette, hexagon logo, checkmark-plane hybrid, cartoonish/mascot references
- Rejected: blue `#0036FF` direction; violet base palette; dark-dominant as the only mode
- Approved: orange as brand color, fire-in-the-"o" logo, light-first + co-equal dark, DM Sans display
- Reference sites (v5): Cloudflare / Linear / Stripe (todesktop retired as primary reference)

## Key decisions made (v5.0, 2026-05-28)

Supersedes v4. Canonical docs updated: brand-identity.md v5.0, website-vision.md v2.0, pages/homepage.md v2.0.
- Light-first + co-equal dark; OS `prefers-color-scheme` drives default; light = no `dark` class
- Violet Base palette retired; replaced by Surface scale (light) and Dark scale (dark)
- Light bg `#FAFAFA`; light cards `#FFFFFF`; dark bg `#111110`; dark cards `#1E1D1B` (solid)
- Light primary: `#EA6B04` CTA; `#9A3F05` inline links. Dark primary: `#F97316` unchanged
- Display: Aeonik Pro → DM Sans (free/OFL). 700 hero, 600 H1/H2. H2 face: Inter→DM Sans on marketing
- Glass model A: backdrop-filter on nav/overlays only; cards solid in both themes
- `--ease-page` added (`cubic-bezier(0.4,0,0.2,1)`); `--duration-deliberate` 450ms→400ms
- Semantic colors, Inter, Geist Mono, logo, fire gradient: unchanged
- Rebrand proposal files (`docs/design/rebrand-proposal/`) are superseded — read-only reference
