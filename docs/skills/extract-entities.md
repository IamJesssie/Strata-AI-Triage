---
name: extract-entities
description: Pull structured entities (SP numbers, lot IDs, parties, dates, contractors) from raw enquiry text.
type: skill
outputs_schema: |
  {
    "strata_plan": string | null,        // e.g. "SP 89421"
    "lot_numbers": string[],             // ["Lot 14"]
    "building_refs": string[],           // ["Building 4B", "Cedar Grove"]
    "parties": [
      { "name": string, "role": "owner"|"tenant"|"agent"|"solicitor"|"contractor"|"committee"|"unknown", "email": string|null }
    ],
    "dates": [ { "iso": string, "context": string } ],
    "contractors": string[],
    "warranty_refs": string[],
    "attachments_referenced": string[]
  }
---

# extract-entities

Deterministic regex first, LLM second. Run regex pass for `SP\s?\d{4,6}`, `Lot\s?\d+`, ISO/long-form dates. Hand the remainder to the model with this rubric.

## Rules
- Never hallucinate an `SP` number. If not present in text, set `null`.
- Normalise SP refs to `SP #####` (uppercase, single space).
- `parties[].role` must be from the closed set; otherwise use `unknown`.
- Resolve relative dates against `now` (caller injects ISO timestamp).
- Strip honorifics from `name` (`Mr`, `Ms`, `Dr`).

## Output
Strict JSON. Empty arrays for "none found" — never `null` on array fields.
