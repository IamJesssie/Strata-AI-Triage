---
name: ui-component-build
description: Build or modify a React component that strictly conforms to docs/design-system/Guidelines.md.
type: skill
inputs:
  - component_name: string
  - spec: string                # natural-language description
  - file_path: string
---

# ui-component-build

## Process
1. Read `docs/design-system/Guidelines.md` first. Do not begin coding without it.
2. Identify which Section(s) of the spec map to existing tokens / patterns —
   prefer reuse over invention.
3. Use only:
   - `lucide-react` for icons.
   - `motion/react` for any animation.
   - Tailwind v4 utilities + inline `style` for values that aren't in the
     default palette (sizes 11.5, 12.5, etc).
4. Output the file as a single TSX with one named export.
5. Run `design-system-lint` on the diff before reporting done.

## Forbidden
- Any new colour outside the token table.
- `text-2xl`, `font-bold`, `leading-none` (overrides the base typography).
- Inline `<style>` blocks. Use the `style={{ … }}` prop or a token.
- Decorative drop shadows, glassmorphism, gradients except where Guidelines
  explicitly allow.
