---
name: classifier-agent
description: Produces classification + priority + confidence for an Enquiry.
model: sonnet
tools: [classify-enquiry, detect-priority, audit-log]
concurrency: parallel
sla_ms: 1500
on_failure: retry
---

# classifier-agent

## Steps
1. Run `classify-enquiry` and `detect-priority` **in parallel**.
2. Reconcile: if `priority == High` but `classification == General`, downgrade
   priority to `Medium` unless explicit safety signals exist.
3. Emit:
   ```json
   {
     "classification": "...",
     "confidence": 94,
     "secondary": null,
     "priority": "High",
     "sla_hours": 4,
     "rationale": "..."
   }
   ```
4. `audit-log` action `"classified"`.

## Retry
On `JSON_PARSE_ERROR` or `MODEL_ERROR`, retry once with a smaller model.
After two failures, emit `General / 0% / Low` and flag `classifier_failed`.
