package com.atmos.backend.controller;

import com.atmos.backend.service.NewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<?> getNews(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "12") int pageSize,
            @RequestParam(defaultValue = "1") int page
    ) {
        if (!newsService.isConfigured()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "News API key not configured"));
        }
        if (country == null || country.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Country parameter required"));
        }

        try {
            return ResponseEntity.ok(newsService.getTopHeadlines(country, category, pageSize, page));
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", "Failed to fetch news", "details", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch news", "details", ex.getMessage()));
        }
    }
}
