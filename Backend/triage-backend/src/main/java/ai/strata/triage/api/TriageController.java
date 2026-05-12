package ai.strata.triage.api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import ai.strata.triage.service.TriageService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/triage")
public class TriageController {
    private final TriageService triageService;

    public TriageController(TriageService triageService) {
        this.triageService = triageService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public TriageResponse triage(@RequestBody TriageRequest request) {
        return triageService.analyze(request);
    }
}
