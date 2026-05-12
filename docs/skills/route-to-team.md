---
name: route-to-team
description: Decide which internal team or named owner should handle an enquiry.
type: skill
outputs_schema: |
  {
    "queue": "ops"|"bd"|"finance"|"legal"|"building-management"|"compliance",
    "assignee_email": string | null,
    "cc": string[],
    "sla_hours": number,
    "rationale": string
  }
---

# route-to-team

## Routing matrix
| Classification | Priority | Queue              | Default assignee          |
|----------------|----------|--------------------|---------------------------|
| Support        | Low      | ops                | first available           |
| Support        | High     | ops                | shift lead                |
| New Client     | any      | bd                 | Sarah Pillay              |
| Complaint      | High     | compliance         | Compliance Officer        |
| Complaint      | Medium   | building-management| building manager for SP   |
| General        | any      | ops                | first available           |
| Records / S184 | any      | finance            | records clerk             |
| Solicitor mail | any      | legal              | legal coordinator         |

Always populate `cc` with the standing watch list for the queue.
