package ai.strata.triage.service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

import org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory;
import org.openjdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import ai.strata.triage.api.ActionItem;
import ai.strata.triage.api.Classification;
import ai.strata.triage.api.Priority;

@Component
public class ScriptedRulesProvider {
    private static final Logger log = LoggerFactory.getLogger(ScriptedRulesProvider.class);

    public List<FallbackClassifier.RuleDefinition> loadRules() {
        ClassPathResource resource = new ClassPathResource("rules/fallback-rules.js");
        if (!resource.exists()) {
            return Collections.emptyList();
        }
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            ScriptEngine engine = new NashornScriptEngineFactory().getScriptEngine();
            engine.eval(reader);
            Object rules = engine.get("rules");
            if (!(rules instanceof ScriptObjectMirror mirror) || !mirror.isArray()) {
                return Collections.emptyList();
            }
            List<FallbackClassifier.RuleDefinition> parsed = new ArrayList<>();
            for (Object entry : mirror.values()) {
                if (!(entry instanceof ScriptObjectMirror rule)) {
                    continue;
                }
                String pattern = value(rule, "pattern");
                String classification = value(rule, "classification");
                String priority = value(rule, "priority");
                String intent = value(rule, "intent");
                String draft = value(rule, "draft");
                int confidence = intValue(rule, "confidence", 70);

                List<ActionItem> actions = new ArrayList<>();
                Object actionObj = rule.get("actions");
                if (actionObj instanceof ScriptObjectMirror actionArray && actionArray.isArray()) {
                    for (Object actionEntry : actionArray.values()) {
                        String label = String.valueOf(actionEntry);
                        actions.add(new ActionItem(label, false));
                    }
                }

                parsed.add(new FallbackClassifier.RuleDefinition(
                    Pattern.compile(pattern, Pattern.CASE_INSENSITIVE),
                    Classification.fromLabel(classification),
                    Priority.fromLabel(priority),
                    confidence,
                    intent,
                    actions,
                    draft
                ));
            }
            return parsed;
        } catch (IOException | ScriptException | RuntimeException ex) {
            log.warn("Failed to load scripted fallback rules", ex);
            return Collections.emptyList();
        }
    }

    private String value(ScriptObjectMirror rule, String key) {
        Object value = rule.get(key);
        return value == null ? "" : String.valueOf(value);
    }

    private int intValue(ScriptObjectMirror rule, String key, int fallback) {
        Object value = rule.get(key);
        if (value instanceof Number number) {
            return number.intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception ex) {
            return fallback;
        }
    }
}
