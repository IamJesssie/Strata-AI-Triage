package ai.strata.triage.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "openrouter")
public record OpenRouterProperties(
    String baseUrl,
    String apiKey,
    String model,
    int timeoutMs
) {}
