package ai.strata.triage.api;

import java.util.Locale;

public enum Classification {
    SUPPORT("Support"),
    NEW_CLIENT("New Client"),
    COMPLAINT("Complaint"),
    GENERAL("General");

    private final String label;

    Classification(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static Classification fromLabel(String value) {
        if (value == null) {
            return GENERAL;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "support" -> SUPPORT;
            case "new client", "new_client", "newclient" -> NEW_CLIENT;
            case "complaint" -> COMPLAINT;
            case "general" -> GENERAL;
            default -> GENERAL;
        };
    }
}
