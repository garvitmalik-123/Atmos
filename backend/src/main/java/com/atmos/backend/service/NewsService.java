package com.atmos.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NewsService {

    private final RestTemplate restTemplate;

    @Value("${news.api.key}")
    private String newsApiKey;

    // NewsData.io latest-news endpoint. Docs: https://newsdata.io/documentation/
    private static final String NEWS_BASE_URL = "https://newsdata.io/api/1/latest";

    private static final long CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    private record CacheEntry(long timestamp, Map<String, Object> data) {}

    public NewsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isConfigured() {
        return newsApiKey != null && !newsApiKey.isBlank();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getTopHeadlines(String country, String category, int pageSize, int page) {
        String cacheKey = country + "|" + category + "|" + pageSize + "|" + page;

        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && System.currentTimeMillis() - cached.timestamp() < CACHE_TTL_MS) {
            return cached.data();
        }

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(NEWS_BASE_URL)
                .queryParam("apikey", newsApiKey)
                .queryParam("language", "en")
                .queryParam("country", country.toLowerCase());

        if (category != null && !category.isBlank() && !"general".equalsIgnoreCase(category)) {
            builder.queryParam("category", category.toLowerCase());
        }

        Map<String, Object> newsDataResponse = restTemplate.getForObject(builder.toUriString(), Map.class);
        Map<String, Object> normalized = normalizeToNewsApiShape(newsDataResponse, pageSize);

        cache.put(cacheKey, new CacheEntry(System.currentTimeMillis(), normalized));
        return normalized;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> normalizeToNewsApiShape(Map<String, Object> newsDataResponse, int requestedPageSize) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "ok");

        if (newsDataResponse == null || !"success".equals(newsDataResponse.get("status"))) {
            result.put("totalResults", 0);
            result.put("articles", List.of());
            return result;
        }

        Object totalResults = newsDataResponse.get("totalResults");
        result.put("totalResults", totalResults != null ? totalResults : 0);

        List<Map<String, Object>> results = (List<Map<String, Object>>) newsDataResponse.getOrDefault("results", List.of());

        List<Map<String, Object>> normalizedArticles = new ArrayList<>();
        int limit = Math.min(results.size(), requestedPageSize);
        for (int i = 0; i < limit; i++) {
            Map<String, Object> a = results.get(i);
            Map<String, Object> article = new HashMap<>();
            article.put("title", a.get("title"));
            article.put("description", a.get("description"));
            article.put("content", a.get("content"));
            article.put("url", a.get("link"));
            article.put("urlToImage", a.get("image_url"));
            article.put("publishedAt", a.get("pubDate"));

            List<String> creators = (List<String>) a.get("creator");
            article.put("author", (creators != null && !creators.isEmpty()) ? creators.get(0) : null);

            Map<String, Object> source = new HashMap<>();
            source.put("id", null);
            source.put("name", a.get("source_id"));
            article.put("source", source);

            normalizedArticles.add(article);
        }

        result.put("articles", normalizedArticles);
        return result;
    }
}