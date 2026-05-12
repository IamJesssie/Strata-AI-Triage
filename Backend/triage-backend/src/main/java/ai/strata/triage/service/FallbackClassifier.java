package ai.strata.triage.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import ai.strata.triage.api.ActionItem;
import ai.strata.triage.api.Classification;
import ai.strata.triage.api.Priority;
import ai.strata.triage.api.TriageRequest;
import ai.strata.triage.api.TriageResponse;

@Component
public class FallbackClassifier {
    private final ScriptedRulesProvider scriptedRulesProvider;

    public FallbackClassifier(ScriptedRulesProvider scriptedRulesProvider) {
        this.scriptedRulesProvider = scriptedRulesProvider;
    }

    public TriageResponse classify(TriageRequest request) {
        String text = request.combinedText().toLowerCase(Locale.ROOT);
        List<RuleDefinition> rules = scriptedRulesProvider.loadRules();
        if (rules.isEmpty()) {
            rules = defaultRules();
        }

        RuleDefinition best = null;
        for (RuleDefinition rule : rules) {
            if (rule.pattern().matcher(text).find()) {
                if (best == null || rule.confidence() > best.confidence()) {
                    best = rule;
                }
            }
        }

        if (best == null) {
            best = new RuleDefinition(Pattern.compile(".*"), Classification.GENERAL, Priority.LOW, 55,
                "General enquiry requiring standard follow-up.",
                List.of(
                    new ActionItem("Log enquiry and acknowledge receipt", true),
                    new ActionItem("Confirm any required documents or forms", false)
                ),
                defaultDraft(request.sender())
            );
        }

        String intent = best.intent();
        if (intent == null || intent.isBlank()) {
            intent = String.format("%s request from %s regarding %s.",
                best.classification().label(), safe(request.sender()), safe(request.subject()));
        }

        return new TriageResponse(
            best.classification(),
            best.priority(),
            best.confidence(),
            intent,
            best.actions(),
            best.draft(),
            "fallback-rule",
            "fallback"
        );
    }

    private List<RuleDefinition> defaultRules() {
        List<RuleDefinition> rules = new ArrayList<>();
        rules.add(new RuleDefinition(
            Pattern.compile("urgent|water ingress|leak|flood|damage|complaint|noise|escalate"),
            Classification.COMPLAINT,
            Priority.HIGH,
            86,
            "Escalating complaint requiring urgent attention.",
            List.of(
                new ActionItem("Dispatch inspection within 48 hours", true),
                new ActionItem("Notify building manager and insurer", false),
                new ActionItem("Log in compliance register", false)
            ),
            complaintDraft()
        ));

        rules.add(new RuleDefinition(
            Pattern.compile("proposal|quote|tender|new development|services|management proposal"),
            Classification.NEW_CLIENT,
            Priority.MEDIUM,
            83,
            "Prospective client requesting service proposal.",
            List.of(
                new ActionItem("Route to business development", true),
                new ActionItem("Send fee schedule and capability statement", true)
            ),
            newClientDraft()
        ));

        rules.add(new RuleDefinition(
            Pattern.compile("login|portal|password|reset|maintenance|repair|support"),
            Classification.SUPPORT,
            Priority.LOW,
            80,
            "Resident requesting assistance with support issue.",
            List.of(
                new ActionItem("Verify account and resolve access issue", true),
                new ActionItem("Confirm resolution with resident", false)
            ),
            supportDraft()
        ));

        rules.add(new RuleDefinition(
            Pattern.compile("minutes|agm|records|ledger|pet|by-law|certificate"),
            Classification.GENERAL,
            Priority.MEDIUM,
            75,
            "General admin or records request.",
            List.of(
                new ActionItem("Acknowledge request and outline next steps", true),
                new ActionItem("Prepare requested documents", false)
            ),
            generalDraft()
        ));

        return rules;
    }

    private String complaintDraft() {
        return "Hi there,\n\nThanks for flagging this. We have logged the complaint as high priority and will arrange an inspection within the next 48 hours. We will confirm a time shortly and keep you updated as the assessment progresses.\n\nRegards,\nJessie Noel D. Lapure";
    }

    private String newClientDraft() {
        return "Hi there,\n\nThanks for reaching out. We would be happy to provide a proposal and outline our service scope. I will share our fee schedule and arrange a time to discuss your requirements.\n\nRegards,\nJessie Noel D. Lapure";
    }

    private String supportDraft() {
        return "Hi there,\n\nThanks for letting us know. We will look into this support issue and confirm the next steps shortly. If any additional details are needed, we will reach out.\n\nRegards,\nJessie Noel D. Lapure";
    }

    private String generalDraft() {
        return "Hi there,\n\nThanks for your enquiry. We have logged your request and will prepare the required documents. We will confirm timelines and any fees shortly.\n\nRegards,\nJessie Noel D. Lapure";
    }

    private String defaultDraft(String sender) {
        return "Hi " + safe(sender) + ",\n\nThanks for your enquiry. We have received your request and will follow up with the next steps shortly.\n\nRegards,\nJessie Noel D. Lapure";
    }

    private String safe(String value) {
        return value == null || value.isBlank() ? "there" : value.split(" ")[0];
    }

    public record RuleDefinition(
        Pattern pattern,
        Classification classification,
        Priority priority,
        int confidence,
        String intent,
        List<ActionItem> actions,
        String draft
    ) {}
}
