# AI Enquiry Triage — Design System Rules

> Source of truth for visual & interaction design across the **Strata Triage**
> product. Treat these rules as binding. If a rule conflicts with an ad-hoc
> request, surface the conflict before deviating.

---

## 1. Design Philosophy

**Linear.app meets professional B2B Enterprise SaaS.**
We prioritise *information density without noise*, *calm hierarchy*, and
*surgical accent colour*. No skeuomorphism, no AI clichés, no decorative
flourish.

### Hard "Nevers"
- No rounded chat-bubble interfaces.
- No "AI sparkles", gradients-on-everything, glassmorphism, or neon glow.
- No emoji in UI copy.
- No drop shadows larger than `0 4px 16px rgba(0,0,0,0.18)`.
- No border-radius greater than `8px` on container surfaces.
- No font other than **Inter** (UI) and **Source Serif 4** (long-form email body).
- No `text-2xl`, `font-bold`, `leading-none` Tailwind utilities unless explicitly required — typography is governed by tokens.

### Hard "Alwayses"
- Strict 4px / 8px spacing grid.
- 1px borders, `zinc-800` on dark, `zinc-200` on light.
- Subtle elevation only — depth is conveyed via border + background, not shadow.
- Tabular numerals (`tabular-nums`) for all metrics, counts, timestamps.
- Every interactive element has a hover state and a focus-visible ring.

---

## 2. Colour Tokens

| Token              | Value                | Usage                                   |
|--------------------|----------------------|-----------------------------------------|
| `--bg-canvas`      | `zinc-900` (#18181b) | Primary app background                  |
| `--bg-panel`       | `zinc-950` (#09090b) | Side rails (nav, list, insights)        |
| `--bg-elevated`    | `zinc-900`           | Cards, popovers                         |
| `--bg-input`       | `zinc-950`           | Text inputs, textareas                  |
| `--bg-source`      | `#ffffff`            | Source email card (intentional contrast)|
| `--fg-primary`     | `zinc-100`           | Primary text on dark                    |
| `--fg-secondary`   | `zinc-300`           | Body copy                               |
| `--fg-muted`       | `zinc-500`           | Labels, captions, timestamps            |
| `--fg-disabled`    | `zinc-600`           | Disabled / placeholder                  |
| `--border-default` | `zinc-800`           | Default 1px borders                     |
| `--border-strong`  | `zinc-700`           | Hover state on bordered controls        |
| `--accent`         | `indigo-600` (#4f46e5) | Primary actions, selection bar        |
| `--accent-hover`   | `indigo-500`         | Hover on accent                         |
| `--accent-soft-bg` | `indigo-500/10`      | Accent badge background                 |
| `--accent-soft-fg` | `indigo-300`         | Text on accent-soft background          |

### Semantic / Status

| Category    | Dot          | Pill bg          | Pill fg        |
|-------------|--------------|------------------|----------------|
| Support     | `amber-500`  | `amber-500/10`   | `amber-300`    |
| New Client  | `emerald-500`| `emerald-500/10` | `emerald-300`  |
| Complaint   | `rose-500`   | `rose-500/10`    | `rose-300`     |
| General     | `zinc-500`   | `zinc-800`       | `zinc-300`     |

**Never** introduce a new hue. New categories reuse the four above.

---

## 3. Typography

| Role               | Font         | Size  | Weight | Line-height |
|--------------------|--------------|-------|--------|-------------|
| App brand          | Inter        | 13    | 600    | 1.0         |
| Section header     | Inter        | 13    | 600    | 1.4         |
| Body / row title   | Inter        | 12.5  | 500    | 1.45        |
| Caption / metadata | Inter        | 11    | 500    | 1.4         |
| Eyebrow label      | Inter, UPPER | 10–10.5 | 500  | tracking-wider |
| Tabular metric     | Inter        | 11.5  | 500    | `tabular-nums` |
| Email body         | Source Serif 4 | 14.5 | 400   | 1.7         |
| KBD                | Inter        | 10    | 500    | 1.0         |

Fonts are imported **only** in `src/styles/fonts.css`. Never inline an `@import`
elsewhere.

---

## 4. Spacing & Grid

- Base unit: **4px**. All paddings, gaps, margins must be multiples.
- Standard rhythm: `4 / 8 / 12 / 16 / 20 / 24 / 32`.
- Column widths (fixed):
  - Nav rail: `232px`
  - Enquiry list: `320px`
  - AI Insights: `400px`
  - Source view: flexes to fill.
- Row heights:
  - Top bars: `56px` (`h-14`)
  - Nav item: `32px` (`h-8`)
  - Toolbar button: `28px` (`h-7`)
  - Inline pill: `24px`

---

## 5. Borders, Radius, Elevation

- Border width: **1px only**. No 2px borders. Selection indicator may use a 2px
  *left bar* (not a border).
- Radius scale: `3 / 4 / 5 / 6 / 999`. Containers ≤ `6`. Pills = `999`.
- Elevation:
  - Resting: `none`.
  - Source card: `0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.18)`.
  - Primary button: `inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.4)`.

---

## 6. Component Rules

### Buttons
- **Primary**: `bg-indigo-600` / hover `indigo-500`, `border-indigo-500`, white text, `h-7`, `px-2.5`, `radius 5`.
- **Secondary**: `bg-zinc-900` / hover `zinc-800`, `border-zinc-700`, `text-zinc-300`.
- **Ghost / Icon**: transparent, `text-zinc-500`, hover `text-zinc-200 bg-zinc-900`. Size `28×28`, icon `13–15px` `strokeWidth 1.75`.

### Inputs / Textareas
- Background `zinc-950`, border `zinc-800`, hover border `zinc-700`,
  focus border `indigo-500` with `ring-1 ring-indigo-500/40`.
- Placeholder `zinc-600`. Never use a fill that matches the panel.

### Pills
- `radius 999`, `px 2.5`, `py 1`, `fontSize 11.5`, weight 500.
- Soft variants only — never solid status colour as background.

### Cards
- 1px border, no shadow (except the Source Card).
- Internal padding: `16–20px`.
- Section dividers use `border-zinc-800/80`.

### Checkboxes
- `14×14`, `radius 3`, unchecked: `bg-zinc-900 border-zinc-700`,
  checked: `bg-indigo-600` with white `Check` icon, `strokeWidth 3`.

### Confidence Bar
- Track: `h-1.5`, `bg-zinc-900 border-zinc-800`, `radius 999`.
- Fill: `bg-indigo-500`, glow `0 0 12px rgba(99,102,241,0.4)`.
- Animate `0 → target` over `700ms ease-out` on mount/change.

### Selection / Active state
- Row: `bg-zinc-900` + left 2px `bg-indigo-500` bar.
- Nav item: `bg-zinc-800/80 text-zinc-100`.

---

## 7. Iconography

- Library: **lucide-react** only.
- Stroke width: `1.75` default; `2.25–3` for filled / accent contexts.
- Icon size scale: `10 / 12 / 13 / 14 / 15`.

---

## 8. Motion

- Duration: `120ms` micro, `200ms` standard, `700ms` data viz.
- Easing: `ease-out` for entrance, `ease-in-out` for state swaps.
- Respect `prefers-reduced-motion`.

---

## 9. Content & Voice

- Sentence case for everything except `UPPERCASE EYEBROWS`.
- No exclamation marks. No "AI" framing.
- Confidence expressed as `## % Certain` (e.g., `94% Certain`).
- Priority words: `High / Medium / Low`.
- Time: relative under 24h (`12m`, `2h`), absolute thereafter.

---

## 10. Accessibility

- WCAG AA minimum.
- Focus-visible: 2px `ring-indigo-500/60` offset 1px.
- Icon-only buttons require `aria-label`.
- Keyboard: `⌘K` search, `J/K` list traversal, `E` archive, `R` reply, `⌘↵` send.

---

## 11. File & Component Conventions

- Components live in `src/app/components/*.tsx`, one component per file.
- Domain data in `src/app/data.ts`.
- No new HTML files. Entry point is `src/app/App.tsx`.
- Extend tokens via CSS variables in `src/styles/theme.css` — never edit Tailwind config.
