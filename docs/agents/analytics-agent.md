---
name: analytics-agent
description: Records operator behaviour to drive the model feedback loop and dashboards.
model: haiku
tools: [audit-log]
concurrency: parallel
sla_ms: 400
on_failure: degrade
---

# analytics-agent

## Events captured
- `triage.created`           — pipeline finished, surfaced to UI
- `draft.edited`              — operator-modified character count + diff hash
- `draft.sent`                — final send w/ time-to-send
- `action.toggled`            — checkbox change (which suggestion accepted)
- `classification.overridden` — operator changed AI classification
- `priority.overridden`       — operator changed AI priority
- `feedback.thumbs`           — explicit operator rating

## Output
Flush events in batches to the warehouse every 30 seconds. Tag each event
with `enquiry_id`, `model_version`, `prompt_version` for reproducibility.

## Feedback loop
Override and edit events feed the nightly evaluation set used to tune
`classify-enquiry`, `suggest-actions`, and `draft-response` prompts.
