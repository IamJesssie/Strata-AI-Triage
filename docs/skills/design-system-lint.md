---
name: design-system-lint
description: Lint a TSX diff against docs/design-system/Guidelines.md and report violations.
type: skill
inputs:
  - diff: string                # unified diff or full file
outputs_schema: |
  {
    "verdict": "pass" | "warn" | "fail",
    "violations": [
      {
        "rule": string,          // e.g. "no-non-token-color"
        "severity": "warn"|"error",
        "line": number | null,
        "snippet": string,
        "fix_hint": string
      }
    ]
  }
---

# design-system-lint

## Rule set (must all be checked)

| Rule id                        | Severity | Detection                                                                 |
|-------------------------------|----------|---------------------------------------------------------------------------|
| `no-non-token-color`           | error    | any hex / rgb / hsl that is not in the colour token table                |
| `no-disallowed-typography`     | error    | use of `text-2xl`, `font-bold`, `leading-none` without explicit allow    |
| `no-rounded-bubble`            | error    | `border-radius` > 8px on container surfaces                              |
| `border-width-1px-only`        | error    | `border-2` / `border-4` / `border-width > 1px`                          |
| `icons-lucide-only`            | error    | import from any icon lib other than `lucide-react`                       |
| `no-decorative-emoji`          | warn     | emoji code points inside JSX text nodes                                  |
| `respects-reduced-motion`      | warn     | animated component lacks `prefers-reduced-motion` handling               |
| `aria-on-icon-buttons`         | error    | icon-only `<button>` without `aria-label`                                |
| `four-px-spacing-grid`         | warn     | padding/margin values not in `{0,2,4,6,8,12,16,20,24,32}`               |
| `tabular-nums-on-metrics`      | warn     | numerical metric without `tabular-nums`                                  |

## Output
JSON only. `fail` if any `error`. `warn` if only warnings. Otherwise `pass`.
