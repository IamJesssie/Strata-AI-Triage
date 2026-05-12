---
name: detect-priority
description: Score urgency and risk to produce a High / Medium / Low priority with an explanation.
type: skill
outputs_schema: |
  {
    "priority": "High" | "Medium" | "Low",
    "urgency_signals": string[],   // explicit textual cues
    "risk_signals": string[],      // legal, safety, financial
    "sla_hours": number,           // suggested response window
    "rationale": string            // ≤ 160 chars
  }
---

# detect-priority

## Heuristics
| Signal                                                  | Bump to |
|---------------------------------------------------------|---------|
| Mentions safety (water, electrical, fire, injury)       | High    |
| Legal action, solicitor, tribunal, NCAT                 | High    |
| Recurring complaint (≥ 3rd incident)                    | High    |
| Time word: "urgent", "asap", "today", "by EOD"          | High    |
| Settlement / handover in ≤ 14 days                      | Medium  |
| New client RFP                                          | Medium  |
| General question with no deadline                       | Low     |
| Pet / by-law / records request                          | Low     |

## SLA mapping
- `High` → `sla_hours: 4`
- `Medium` → `sla_hours: 24`
- `Low` → `sla_hours: 72`

## Output
Strict JSON. `urgency_signals` and `risk_signals` must quote ≤ 6-word snippets
from the source text. Never invent quotes.
