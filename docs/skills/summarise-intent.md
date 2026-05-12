---
name: summarise-intent
description: Produce a single-sentence operator-facing summary of what the sender wants.
type: skill
outputs_schema: |
  { "intent": string }   // 1 sentence, 18–32 words, no opinion
---

# summarise-intent

## Rules
- One sentence, third-person, present tense.
- Lead with the role: `Owner …`, `Developer …`, `Solicitor …`.
- State the *ask*, not the situation. "Requesting urgent inspection of …" not
  "There is water in the basement".
- No adjectives ("kindly", "politely"). No interpretation of mood.
- Hard limit 32 words.
