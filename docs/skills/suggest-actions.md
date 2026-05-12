---
name: suggest-actions
description: Produce a checkbox list of concrete next actions for the triaging operator.
type: skill
outputs_schema: |
  {
    "actions": [
      {
        "id": string,                  // stable slug, e.g. "dispatch-inspection"
        "label": string,               // imperative verb-first, ≤ 90 chars
        "confidence": number,          // 0–100
        "owner_hint": "operator"|"building_manager"|"finance"|"legal"|"bd",
        "default_checked": boolean
      }
    ]
  }
---

# suggest-actions

## Rules
- 2 to 5 actions. Never more. Quality > quantity.
- Always start with an imperative verb (`Dispatch`, `Verify`, `Notify`, `Log`,
  `Issue`, `Route`, `Attach`, `Schedule`).
- Pre-check (`default_checked: true`) only the top-2 highest-confidence items.
- Each action must be **executable today** by a human operator — no vague
  "Investigate further".
- Never propose actions outside the company's remit (e.g. don't promise legal
  advice).
