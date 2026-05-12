package ai.strata.triage.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ai.strata.triage.api.ActionItem;
import ai.strata.triage.api.Classification;
import ai.strata.triage.api.Priority;
import ai.strata.triage.api.TriageRequest;
import ai.strata.triage.api.TriageResponse;

@Component
public class OpenRouterClient {
    private static final Logger log = LoggerFactory.getLogger(OpenRouterClient.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final OpenRouterProperties properties;

    public OpenRouterClient(RestTemplate restTemplate, ObjectMapper objectMapper, OpenRouterProperties properties) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public boolean isConfigured() {
        return properties.apiKey() != null && !properties.apiKey().isBlank();
    }

    public TriageResponse analyze(TriageRequest request) {
        if (!isConfigured()) {
            throw new IllegalStateException("OpenRouter API key missing.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", properties.model());
        payload.put("temperature", 0.2);
        payload.put("messages", List.of(
            Map.of("role", "system", "content", PromptRules.systemPrompt()),
            Map.of("role", "user", "content", PromptRules.userPrompt(request))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(properties.apiKey());
        headers.add("X-Title", "Strata AI Triage");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        String url = properties.baseUrl() + "/chat/completions";
        try {
            String raw = restTemplate.postForObject(url, entity, String.class);
            return parseResponse(raw, properties.model());
        } catch (RestClientException ex) {
            throw new RuntimeException("OpenRouter request failed", ex);
        }
    }

    public String enhance(String rawText) {
        if (!isConfigured()) {
            throw new IllegalStateException("OpenRouter API key missing.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", properties.model());
        payload.put("temperature", 0.7);
        payload.put("messages", List.of(
            Map.of("role", "user", "content", PromptRules.enhancePrompt(rawText))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(properties.apiKey());
        headers.add("X-Title", "Strata AI Triage");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        String url = properties.baseUrl() + "/chat/completions";
        try {
            String raw = restTemplate.postForObject(url, entity, String.class);
            JsonNode root = objectMapper.readTree(raw);
            return root.path("choices").path(0).path("message").path("content").asText(rawText).trim();
        } catch (Exception ex) {
            log.warn("Failed to enhance text via OpenRouter", ex);
            return rawText;
        }
    }

    private TriageResponse parseResponse(String raw, String model) {
        if (raw == null || raw.isBlank()) {
            throw new RuntimeException("OpenRouter returned empty response");
        }
        try {
            JsonNode root = objectMapper.readTree(raw);
            String content = root.path("choices").path(0).path("message").path("content").asText("");
            if (content.isBlank()) {
                throw new RuntimeException("OpenRouter response missing content");
            }
            String json = extractJson(content);
            JsonNode data = objectMapper.readTree(json);

            Classification classification = Classification.fromLabel(data.path("classification").asText());
            Priority priority = Priority.fromLabel(data.path("priority").asText());
            int confidence = data.path("confidence").asInt(70);
            String intent = data.path("intent").asText("");
            String draft = data.path("draft").asText("");

            List<ActionItem> actions = new ArrayList<>();
            for (JsonNode actionNode : data.withArray("actions")) {
                String label = actionNode.path("label").asText();
                boolean checked = actionNode.path("checked").asBoolean(false);
                actions.add(new ActionItem(label, checked));
            }

            return new TriageResponse(classification, priority, confidence, intent, actions, draft, model, "openrouter");
        } catch (Exception ex) {
            log.warn("Failed to parse OpenRouter response, falling back", ex);
            throw new RuntimeException("OpenRouter response parse failed", ex);
        }
    }

    private String extractJson(String content) {
        String trimmed = content.trim();
        int first = trimmed.indexOf('{');
        int last = trimmed.lastIndexOf('}');
        if (first >= 0 && last > first) {
            return trimmed.substring(first, last + 1);
        }
        return trimmed;
    }
}
