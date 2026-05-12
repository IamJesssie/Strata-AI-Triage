---
name: ingest-email
description: Parse a raw RFC-822 email or web-form payload into a normalised Enquiry record.
type: skill
outputs_schema: |
  {
    "id": string,                  // ENQ-XXXX
    "sender": string,
    "email": string,
    "subject": string,
    "body": string,                // plain text, signature stripped
    "received_at": string,         // ISO-8601
    "channel": "email"|"web-form"|"portal",
    "attachments": [ { "name": string, "mime": string, "size": number } ],
    "headers_verified": { "spf": boolean, "dkim": boolean, "dmarc": boolean }
  }
---

# ingest-email

## Pipeline
1. RFC-822 parse → header verification (SPF/DKIM/DMARC).
2. Strip quoted history (`On … wrote:` and `>` lines).
3. Strip operator signatures using regex + ML classifier.
4. Detect & flag auto-replies (`Auto-Submitted`, `X-Autoreply`) → drop.
5. Assign next `ENQ-####` id.

## Hard rules
- Never persist the email if `dmarc == false` and `spf == false` — quarantine.
- Bodies > 12 KB are truncated with `[…truncated]` marker; full body kept in
  cold storage referenced by `id`.
