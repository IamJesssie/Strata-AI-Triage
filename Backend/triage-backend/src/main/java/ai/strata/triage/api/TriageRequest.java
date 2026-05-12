package ai.strata.triage.api;

public record TriageRequest(String sender, String email, String subject, String body, String tone, String signature) {
    public String combinedText() {
        String safeSubject = subject == null ? "" : subject;
        String safeBody = body == null ? "" : body;
        return safeSubject + "\n" + safeBody;
    }
}
