package ai.strata.triage.api;

import java.util.List;

public record TriageResponse(
    Classification classification,
    Priority priority,
    int confidence,
    String intent,
    List<ActionItem> actions,
    String draft,
    String model,
    String source
) {}
