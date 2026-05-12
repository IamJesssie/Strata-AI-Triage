---
name: search-knowledge-base
description: Retrieve relevant by-laws, AGM minutes, precedent responses, and contractor warranties for an enquiry.
type: skill
inputs:
  - query: string
  - sp_number: string | null
  - top_k: number              # default 5
outputs_schema: |
  {
    "snippets": [
      {
        "source": "by-law"|"agm"|"precedent"|"warranty"|"policy",
        "title": string,
        "doc_id": string,
        "excerpt": string,       // ≤ 320 chars
        "score": number          // 0–1, cosine similarity
      }
    ]
  }
---

# search-knowledge-base

## Indexing scope
- By-laws (per SP)
- AGM / EGM minutes (last 5 years)
- Operator-saved precedent responses
- Contractor warranty PDFs (parsed)
- Internal policy handbook

## Rules
- Restrict by `sp_number` when supplied — never leak documents from other plans.
- Return at most `top_k` snippets; sorted by `score` desc.
- Snippets are read-only; never modify in this skill.
