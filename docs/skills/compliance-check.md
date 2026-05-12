---
name: compliance-check
description: Flag legal, regulatory, or by-law concerns in an enquiry or draft response before send.
type: skill
inputs:
  - enquiry_text: string
  - draft_text: string | null
outputs_schema: |
  {
    "verdict": "clear" | "review" | "block",
    "issues": [
      {
        "type": "legal_advice"|"defamation"|"pii_leak"|"unauthorised_commitment"|"by_law_reference"|"insurance_admission",
        "severity": "low"|"medium"|"high",
        "snippet": string,
        "explanation": string
      }
    ],
    "required_human_review": boolean
  }
---

# compliance-check

## Triggers (non-exhaustive)
- Any text that *interprets* legislation (Strata Schemes Management Act, NCAT).
- Admissions of liability ("we caused", "we are responsible for…").
- PII of third parties (other lot owner names, contact details).
- Unauthorised commitments (refunds, waivers, fee reversals).
- By-law numbers cited without retrieval evidence.

## Verdicts
- `clear` — no issues, send freely.
- `review` — at least one `medium`; operator must review before send.
- `block` — at least one `high`; UI must disable Send and surface reason.
