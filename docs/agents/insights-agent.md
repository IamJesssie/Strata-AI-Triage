---
name: insights-agent
description: Generates the operator-facing AI Insights panel — intent, suggested actions, response draft.
model: opus
tools: [summarise-intent, suggest-actions, draft-response, tone-match]
concurrency: serial
sla_ms: 3500
on_failure: retry
---

# insights-agent

## Inputs
- `Enquiry`
- `classification`, `priority`, `confidence` (from classifier-agent)
- `snippets[]` (from knowledge-agent — may be empty)

## Steps
1. Run `summarise-intent` and `suggest-actions` **in parallel**.
2. Filter `actions` to those with `default_checked: true` for the draft.
3. Run `draft-response` with intent + filtered actions + snippets.
4. Run `tone-match` with preset = `Empathetic` for `Complaint`,
   `Brief` for `Support / Low`, otherwise `Professional`.
5. Assemble `AIInsights`:
   ```json
   {
     "classification": "...",
     "confidence": 94,
     "priority": "High",
     "intent": "...",
     "actions": [...],
     "draft": "...",
     "tone_preset": "..."
   }
   ```

## Hallucination guardrails
- `draft` must not contain SP numbers, dates, money values, or contractor
  names absent from `Enquiry.body` or `snippets[]`. Strip the offending
  sentence before emit.
