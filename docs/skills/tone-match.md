---
name: tone-match
description: Rewrite a draft to match a target tone preset without changing facts.
type: skill
inputs:
  - draft: string
  - preset: "Professional" | "Empathetic" | "Firm" | "Brief"
outputs_schema: |
  { "draft": string, "preset_applied": string, "changes_summary": string }
---

# tone-match

## Presets
| Preset       | Effect                                                          |
|--------------|-----------------------------------------------------------------|
| Professional | default; neutral, courteous, declarative                        |
| Empathetic   | leads with acknowledgment of impact; soft hedges                |
| Firm         | concise, action-led; used for compliance / repeat complaints    |
| Brief        | ≤ 60 words; bullet-friendly                                     |

## Hard rules
- **Never** change facts, names, lot numbers, SP numbers, dates, monetary
  figures.
- **Never** change the sign-off line.
- If `preset = Brief` and source draft has unique commitments per action,
  keep all of them — drop pleasantries, not promises.
