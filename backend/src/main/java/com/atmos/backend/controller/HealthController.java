package com.atmos.backend.controller;

import com.atmos.backend.service.NewsService;
import com.atmos.backend.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final NewsService newsService;
    private final WeatherService weatherService;

    public HealthController(NewsService newsService, WeatherService weatherService) {
        this.newsService = newsService;
        this.weatherService = weatherService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "OK",
                "keys_loaded", Map.of(
                        "news", newsService.isConfigured(),
                        "weather", weatherService.isConfigured()
                )
        );
    }
}
