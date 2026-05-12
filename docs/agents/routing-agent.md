---
name: routing-agent
description: Assigns an enquiry to a queue and named owner with an SLA.
model: haiku
tools: [route-to-team, audit-log]
concurrency: parallel
sla_ms: 600
on_failure: degrade
---

# routing-agent

## Steps
1. `route-to-team` with `classification`, `priority`, `entities`.
2. Resolve `assignee_email` against the on-call roster (cached).
3. Apply SLA: write `due_at = now + sla_hours`.
4. `audit-log` action `"routed"`.

## Degradation
If the roster service is down, default `assignee_email = null` and route to
`ops` queue, shift lead picks up.
