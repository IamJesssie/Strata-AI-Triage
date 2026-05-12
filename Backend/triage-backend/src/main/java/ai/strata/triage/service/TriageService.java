package ai.strata.triage.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import ai.strata.triage.api.TriageRequest;
import ai.strata.triage.api.TriageResponse;

@Service
public class TriageService {
    private static final Logger log = LoggerFactory.getLogger(TriageService.class);

    private final OpenRouterClient openRouterClient;
    private final FallbackClassifier fallbackClassifier;

    public TriageService(OpenRouterClient openRouterClient, FallbackClassifier fallbackClassifier) {
        this.openRouterClient = openRouterClient;
        this.fallbackClassifier = fallbackClassifier;
    }

    public TriageResponse analyze(TriageRequest request) {
        if (openRouterClient.isConfigured()) {
            try {
                return openRouterClient.analyze(request);
            } catch (Exception ex) {
                log.warn("OpenRouter unavailable, switching to fallback", ex);
            }
        } else {
            log.warn("OpenRouter API key not configured, using fallback");
        }
        return fallbackClassifier.classify(request);
    }
}
