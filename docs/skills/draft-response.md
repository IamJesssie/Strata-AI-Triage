---
name: draft-response
description: Generate a professional reply draft addressed to the sender, ready for operator review.
type: skill
inputs:
  - enquiry: Enquiry
  - intent: string                # from summarise-intent
  - actions: SuggestedAction[]    # from suggest-actions (filtered to checked)
  - knowledge_snippets: string[]  # optional, from knowledge-agent
  - operator_signature: string
outputs_schema: |
  { "draft": string, "word_count": number, "reading_grade": number }
---

# draft-response

## Voice
- Warm-professional, sentence case, Australian English.
- First-person plural for the firm (`we will`, `our team`).
- Never use: `Dear valued client`, `Please do not hesitate`, `Thank you for
  your patience`, em-dash flourishes for stylistic effect, exclamation marks.

## Structure
1. One-line acknowledgment, by name.
2. One paragraph: what we will do, mapped 1:1 to the *checked* actions.
3. One short sentence on what to expect next (timeframe, who follows up).
4. Sign-off: operator name + "Strata Management Consultants".

## Constraints
- 80–160 words.
- Never invent figures, deadlines, contractor names, or warranty terms not
  present in `enquiry` or `knowledge_snippets`. If the model would need to
  guess — omit that sentence.
- Quote SP numbers exactly as supplied.

## Output
Strict JSON.
