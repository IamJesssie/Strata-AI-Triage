package ai.strata.triage.api;

import java.util.Locale;

public enum Priority {
    HIGH("High"),
    MEDIUM("Medium"),
    LOW("Low");

    private final String label;

    Priority(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static Priority fromLabel(String value) {
        if (value == null) {
            return MEDIUM;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "high" -> HIGH;
            case "low" -> LOW;
            default -> MEDIUM;
        };
    }
}
