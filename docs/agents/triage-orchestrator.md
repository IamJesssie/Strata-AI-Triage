---
name: triage-orchestrator
description: Top-level dispatcher that turns a raw enquiry into a triaged record ready for operator review.
model: sonnet
tools: []
inputs:
  - raw_payload: object        # RFC-822 email or web-form JSON
outputs:
  - enquiry: Enquiry
  - insights: AIInsights
  - routing: Routing
  - compliance: ComplianceVerdict
concurrency: serial
sla_ms: 6000
on_failure: degrade
---

# triage-orchestrator

## Responsibility
Coordinates the pipeline. Does not call models directly — only dispatches
other agents. Is the only agent allowed to *fan out* work.

## Execution plan

```
Stage 1 (serial)   : intake-agent
Stage 2 (parallel) : classifier-agent ‖ knowledge-agent
Stage 3 (serial)   : insights-agent  (consumes stages 1 + 2)
Stage 4 (parallel) : compliance-agent ‖ routing-agent ‖ analytics-agent.record
Stage 5 (gate)     : qa-agent
```

Stages 2 and 4 fan out with `Promise.all`. If any non-essential agent times
out (`knowledge-agent`, `analytics-agent`), continue without it and record a
degraded flag on the enquiry.

## Degradation policy
| Failed agent      | Behaviour                                                  |
|-------------------|------------------------------------------------------------|
| intake-agent      | halt; surface error to ops console                         |
| classifier-agent  | retry once with smaller model; else `General` @ confidence 0 |
| knowledge-agent   | continue with empty snippets; flag `knowledge_unavailable` |
| insights-agent    | retry once; else mark enquiry `requires_manual_drafting`   |
| compliance-agent  | block send until human review                              |
| routing-agent     | default to `ops` queue, shift lead                         |
| qa-agent          | force human review                                         |

## Output contract
A single JSON envelope:

```json
{
  "enquiry": { … },
  "insights": { … },
  "routing":  { … },
  "compliance": { … },
  "flags": ["knowledge_unavailable" | "qa_block" | …]
}
```
