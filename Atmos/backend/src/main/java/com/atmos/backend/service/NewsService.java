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

    // GNews top-headlines endpoint. Docs: https://docs.gnews.io/endpoints/top-headlines-endpoint
    private static final String NEWS_BASE_URL = "https://gnews.io/api/v4/top-headlines";

    // GNews free tier caps each request at 10 articles.
    private static final int GNEWS_MAX_ARTICLES = 10;

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

        int max = Math.min(pageSize, GNEWS_MAX_ARTICLES);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(NEWS_BASE_URL)
                .queryParam("country", country)
                .queryParam("apikey", newsApiKey)
                .queryParam("lang", "en")
                .queryParam("max", max)
                .queryParam("page", page);

        // GNews doesn't have a "general" category — that's the default when
        // no category is passed at all.
        if (category != null && !category.isBlank() && !"general".equalsIgnoreCase(category)) {
            builder.queryParam("category", category);
        }

        Map<String, Object> gnewsResponse = restTemplate.getForObject(builder.toUriString(), Map.class);
        Map<String, Object> normalized = normalizeToNewsApiShape(gnewsResponse, pageSize);

        cache.put(cacheKey, new CacheEntry(System.currentTimeMillis(), normalized));
        return normalized;
    }

    /**
     * Reshapes a GNews response into the same JSON shape NewsAPI's
     * top-headlines endpoint returns, so the frontend (which was built
     * against NewsAPI's field names) doesn't need any changes:
     *   - GNews "image"  -> "urlToImage"
     *   - GNews "totalArticles" -> "totalResults"
     *   - adds a null "author" field (GNews doesn't provide one)
     *   - wraps everything with a "status" field
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> normalizeToNewsApiShape(Map<String, Object> gnewsResponse, int requestedPageSize) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "ok");

        if (gnewsResponse == null) {
            result.put("totalResults", 0);
            result.put("articles", List.of());
            return result;
        }

        Object totalArticles = gnewsResponse.get("totalArticles");
        result.put("totalResults", totalArticles != null ? totalArticles : 0);

        List<Map<String, Object>> gnewsArticles = (List<Map<String, Object>>) gnewsResponse.getOrDefault("articles", List.of());
        List<Map<String, Object>> normalizedArticles = new ArrayList<>();

        for (Map<String, Object> a : gnewsArticles) {
            Map<String, Object> article = new HashMap<>();
            article.put("title", a.get("title"));
            article.put("description", a.get("description"));
            article.put("content", a.get("content"));
            article.put("url", a.get("url"));
            article.put("urlToImage", a.get("image"));
            article.put("publishedAt", a.get("publishedAt"));
            article.put("author", null);

            Map<String, Object> sourceObj = (Map<String, Object>) a.get("source");
            Map<String, Object> source = new HashMap<>();
            source.put("id", null);
            source.put("name", sourceObj != null ? sourceObj.get("name") : null);
            article.put("source", source);

            normalizedArticles.add(article);
        }

        result.put("articles", normalizedArticles);
        return result;
    }
}
