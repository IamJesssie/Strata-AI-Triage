---
name: audit-log
description: Append an immutable audit entry for any state-changing action in the triage system.
type: skill
inputs:
  - enquiry_id: string
  - actor: string                # email or "system"
  - action: string               # verb: classified | drafted | sent | routed | edited | archived
  - payload: object              # JSON-serialisable
outputs_schema: |
  { "id": string, "ts": string, "checksum": string }
---

# audit-log

## Rules
- Append-only. Never update or delete an entry.
- `checksum = sha256(prev_checksum + JSON.stringify(entry))` → tamper chain.
- Mirror to write-ahead log + cold storage (S3 with object-lock).
- PII fields in `payload` are tokenised; raw values resolved only with
  legal-tier role.
