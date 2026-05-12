---
name: response-agent
description: Handles operator-triggered send / copy of the response draft and post-send bookkeeping.
model: haiku
tools: [tone-match, compliance-check, audit-log]
concurrency: serial
sla_ms: 1500
on_failure: retry
---

# response-agent

## Triggers
- UI **Send** button → `send`
- UI **Copy to Clipboard** → `copy`

## Send path
1. Re-run `compliance-check` on the *final edited* draft (operator may have
   changed it).
2. If `block` → return error to UI; do not send.
3. Dispatch outbound via SMTP relay; capture `message-id`.
4. `audit-log` action `"sent"` with `message-id` and final draft hash.
5. Move enquiry to `Archive`; notify `analytics-agent`.

## Copy path
1. Return draft text to the client; no send, no archive.
2. `audit-log` action `"copied"`.

## Failure
SMTP error → retry (exponential backoff, 3 attempts) then halt; surface
banner to operator; enquiry stays in `Inbox`.
