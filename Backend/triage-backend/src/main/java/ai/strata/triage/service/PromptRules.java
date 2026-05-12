package ai.strata.triage.service;

import ai.strata.triage.api.TriageRequest;

public final class PromptRules {
    private PromptRules() {}

    public static String systemPrompt() {
        return String.join(
            "\n",
            "You are an AI assistant for a strata management triage system.",
            "Classify the enquiry into exactly one category:",
            "- Support: existing owner/resident needing help",
            "- New Client: developer or prospect asking about services",
            "- Complaint: formal or escalating grievance",
            "- General: routine admin, document requests",
            "Assign a priority: High, Medium, Low.",
            "Return JSON only. Schema:",
            "{",
            "  \"classification\": \"Support|New Client|Complaint|General\",",
            "  \"priority\": \"High|Medium|Low\",",
            "  \"confidence\": 0-100 integer,",
            "  \"intent\": \"one sentence summary\",",
            "  \"actions\": [ { \"label\": \"...\", \"checked\": true|false } ],",
            "  \"draft\": \"polite response draft\"",
            "}",
            "Rules:",
            "- Keep the draft professional and concise.",
            "- Use sentence case. No exclamation marks.",
            "- Prefer concrete actions and avoid speculation.",
            "- If unsure, lower confidence accordingly."
        );
    }

    public static String userPrompt(TriageRequest request) {
        String base = String.join(
            "\n",
            "Sender: " + safe(request.sender()),
            "Email: " + safe(request.email()),
            "Subject: " + safe(request.subject()),
            "Body:",
            safe(request.body())
        );
        
        if (request.tone() != null && !request.tone().isEmpty()) {
            base += "\n\nDraft the response using a " + request.tone() + " tone.";
        }
        if (request.signature() != null && !request.signature().isEmpty()) {
            base += "\nSign off the draft response exactly as:\n" + request.signature();
        }
        
        return base;
    }

    private static String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
