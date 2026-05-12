# Strata Triage — Skills & Agents

This folder defines the orchestration layer that makes the AI Enquiry Triage
system work end-to-end. Skills are **reusable capabilities** (short, narrowly
scoped prompts). Agents are **autonomous workers** that compose skills to
deliver a workflow.

## Folder map

```
docs/
├── design-system/
│   └── Guidelines.md            # visual & interaction rules (binding)
├── skills/
│   ├── README.md                # this file
│   ├── classify-enquiry.md      # categorise inbound message
│   ├── extract-entities.md      # pull lot/SP/dates/parties
│   ├── detect-priority.md       # urgency & risk scoring
│   ├── summarise-intent.md      # 1-sentence intent for operators
│   ├── suggest-actions.md       # checkbox action list
│   ├── draft-response.md        # operator-tone reply draft
│   ├── tone-match.md            # adapt draft to brand voice
│   ├── compliance-check.md      # by-law / legal scan
│   ├── route-to-team.md         # owner / inbox routing
│   ├── search-knowledge-base.md # retrieve precedents & by-laws
│   ├── ingest-email.md          # parse raw email → structured Enquiry
│   ├── audit-log.md             # append immutable audit entries
│   ├── ui-component-build.md    # build UI per design system
│   └── design-system-lint.md    # lint a diff against Guidelines.md
└── agents/
    ├── README.md
    ├── triage-orchestrator.md   # top-level dispatcher
    ├── intake-agent.md          # email → Enquiry record
    ├── classifier-agent.md      # category + priority + confidence
    ├── insights-agent.md        # intent, actions, draft
    ├── compliance-agent.md      # legal/by-law guardrails
    ├── routing-agent.md         # assignment + SLA
    ├── response-agent.md        # send/copy + post-send actions
    ├── knowledge-agent.md       # RAG over by-laws, AGMs, precedents
    ├── design-system-agent.md   # enforces Guidelines.md on UI work
    ├── qa-agent.md              # sanity-checks model output
    └── analytics-agent.md       # operator metrics & feedback loop
```

## How they work together (happy path)

```
   ┌────────────────────────────────────────────────────────────────┐
   │  Email / web form arrives                                       │
   └────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌─────────────────────┐
                  │   intake-agent      │ uses: ingest-email, extract-entities
                  └─────────┬───────────┘
                            ▼
                  ┌─────────────────────┐
                  │  classifier-agent   │ uses: classify-enquiry, detect-priority
                  └─────────┬───────────┘
                            ▼
                  ┌─────────────────────┐
                  │  knowledge-agent    │ uses: search-knowledge-base
                  └─────────┬───────────┘
                            ▼
                  ┌─────────────────────┐
                  │   insights-agent    │ uses: summarise-intent, suggest-actions, draft-response, tone-match
                  └─────────┬───────────┘
                            ▼
                  ┌─────────────────────┐
                  │  compliance-agent   │ uses: compliance-check
                  └─────────┬───────────┘
                            ▼
                  ┌─────────────────────┐
                  │   routing-agent     │ uses: route-to-team
                  └─────────┬───────────┘
                            ▼
                   ┌──────────────────┐
                   │ qa-agent (gate)  │  hallucination, PII, tone, length
                   └────────┬─────────┘
                            ▼
            ┌──────────── operator UI ────────────┐
            │  Triage Workspace (3-column)        │
            └────────┬────────────────────────────┘
                     ▼
              ┌────────────────┐
              │ response-agent │  send / copy → audit-log → analytics-agent
              └────────────────┘
```

## Concurrency model

Steps inside the same row of the table below can run **in parallel**:

| Stage     | Parallel skills/agents                                                  |
|-----------|--------------------------------------------------------------------------|
| Stage 1   | `intake-agent` (single)                                                  |
| Stage 2   | `classifier-agent` ‖ `knowledge-agent` ‖ `compliance-agent (pre-scan)`   |
| Stage 3   | `insights-agent` (consumes stage 2 outputs in one prompt)                |
| Stage 4   | `qa-agent` ‖ `routing-agent` ‖ `analytics-agent (record)`                |
| Stage 5   | `response-agent` (operator-triggered)                                    |

`design-system-agent` runs out-of-band on every UI change and blocks merges
that fail `design-system-lint`.

## Conventions

- Skills are deterministic when possible; LLM-backed skills always emit JSON
  matching the schema declared at the top of each `.md`.
- Agents must never invent file paths, lot numbers, or owner names — they
  retrieve them via `knowledge-agent` or fail loudly.
- Every write-side agent (response, routing) must call `audit-log`.
