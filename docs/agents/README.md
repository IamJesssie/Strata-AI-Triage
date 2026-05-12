# Agents

Each `.md` file in this folder declares one agent. The frontmatter is the
machine-readable contract; the body is the operating manual.

## Shared frontmatter schema

```yaml
---
name: kebab-case-id
description: one-line purpose
model: opus|sonnet|haiku       # cost/latency target
tools: [skill-id, …]           # skills the agent may invoke
inputs: [field: type, …]
outputs: [field: type, …]
concurrency: parallel|serial   # may it run in parallel with peers?
sla_ms: number                 # soft deadline
on_failure: degrade|retry|halt
---
```

## Agent → Skill matrix

| Agent                  | Skills used                                                                 |
|------------------------|------------------------------------------------------------------------------|
| intake-agent           | ingest-email, extract-entities, audit-log                                    |
| classifier-agent       | classify-enquiry, detect-priority, audit-log                                 |
| knowledge-agent        | search-knowledge-base                                                        |
| insights-agent         | summarise-intent, suggest-actions, draft-response, tone-match                |
| compliance-agent       | compliance-check, audit-log                                                  |
| routing-agent          | route-to-team, audit-log                                                     |
| response-agent         | tone-match, compliance-check, audit-log                                      |
| qa-agent               | compliance-check (read-only), audit-log                                      |
| design-system-agent    | ui-component-build, design-system-lint                                       |
| analytics-agent        | audit-log                                                                    |
| triage-orchestrator    | (dispatches all of the above; no skills of its own)                          |
