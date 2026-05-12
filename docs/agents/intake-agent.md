---
name: intake-agent
description: Normalises a raw email or form payload into a structured Enquiry record.
model: haiku
tools: [ingest-email, extract-entities, audit-log]
concurrency: serial
sla_ms: 800
on_failure: halt
---

# intake-agent

## Steps
1. Invoke `ingest-email` on the payload.
2. If `headers_verified.dmarc` is false **and** `spf` is false → quarantine,
   `audit-log` action `"quarantined"` and stop.
3. Invoke `extract-entities` on the cleaned body.
4. Merge into an `Enquiry` record.
5. `audit-log` action `"ingested"` with the entity summary.

## Guarantees
- The output `Enquiry.id` is unique and monotonic per day.
- `body` is plain text. No HTML survives this stage.
