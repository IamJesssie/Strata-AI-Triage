---
name: knowledge-agent
description: Retrieves relevant by-laws, precedents, AGM minutes for an Enquiry via RAG.
model: haiku
tools: [search-knowledge-base]
concurrency: parallel
sla_ms: 1200
on_failure: degrade
---

# knowledge-agent

## Query construction
- Concatenate `subject + " " + intent_hint + " " + entity_keywords`.
- If `extract-entities` returned `strata_plan`, scope retrieval to that SP.
- `top_k = 5` for `Complaint` / `Support`, `3` otherwise.

## Output
Pass-through `snippets[]` to caller. Never paraphrase — paraphrasing happens
inside `draft-response` with citations.

## Degradation
If the vector store is unreachable, emit `{ "snippets": [] }` and a
`knowledge_unavailable` flag; do not block the pipeline.
