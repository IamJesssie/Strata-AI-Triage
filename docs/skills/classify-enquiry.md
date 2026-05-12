---
name: classify-enquiry
description: Classify an inbound client enquiry into one of four fixed categories with a confidence score.
type: skill
inputs:
  - enquiry_text: string (raw email / form body)
  - sender_email: string (optional)
outputs_schema: |
  {
    "classification": "Support" | "New Client" | "Complaint" | "General",
    "confidence": number,        // 0–100, integer
    "rationale": string,         // ≤ 240 chars, plain prose
    "secondary": {               // optional second-best label
      "classification": string,
      "confidence": number
    } | null
  }
---

# classify-enquiry

## Purpose
Assign exactly one **primary category** to every inbound enquiry so downstream
agents (insights, routing) can act deterministically.

## Allowed labels (closed set)
- **Support** — existing client needs help operating a tool, portal, levy, etc.
- **New Client** — prospect, RFP, proposal request, developer handover.
- **Complaint** — dissatisfaction, escalation, recurring incident, formal notice.
- **General** — anything that does not fit the above (records request, by-law
  enquiry, polite admin question).

> Never invent a new label. If the text genuinely fits none, return `General`
> with `confidence ≤ 55`.

## Rules
1. Confidence is **calibrated**: only emit `> 90` when the dominant intent is
   unambiguous in a single sentence of the body.
2. If two labels score within 8 points, include the runner-up in `secondary`.
3. Ignore sender domain unless the body is empty — content first.
4. Do **not** read attachments; the calling agent will supply OCR text if
   relevant.

## Output
Strict JSON matching `outputs_schema`. No prose outside the JSON.

## Failure modes
- Empty / whitespace input → return `{"classification":"General","confidence":0,"rationale":"empty body","secondary":null}`.
- Non-English body → still classify; downstream `tone-match` handles language.
