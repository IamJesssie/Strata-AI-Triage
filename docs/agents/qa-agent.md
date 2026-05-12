---
name: qa-agent
description: Sanity-checks the assembled triage output before it surfaces in the operator UI.
model: sonnet
tools: [compliance-check, audit-log]
concurrency: serial
sla_ms: 1200
on_failure: halt
---

# qa-agent

## Checks
| Check                          | Action on fail              |
|--------------------------------|-----------------------------|
| `confidence` between 0–100     | clamp + flag                |
| `priority` in allowed set      | force `Medium` + flag       |
| Draft does not contain PII not present in source | redact + flag |
| Draft references only entities present in enquiry/snippets | strip sentence |
| Draft length 80–200 words      | regenerate via insights     |
| Compliance verdict not `block` | block send                  |

## Output
Augments the envelope with:

```json
{ "qa": { "passed": true, "flags": [], "redactions": 0 } }
```
