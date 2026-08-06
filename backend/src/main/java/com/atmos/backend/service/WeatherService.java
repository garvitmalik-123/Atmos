package com.atmos.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    private final RestTemplate restTemplate;

    @Value("${weather.api.key}")
    private String weatherApiKey;

    private static final String GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
    private static final String WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
    private static final String FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isConfigured() {
        return weatherApiKey != null && !weatherApiKey.isBlank();
    }


    @SuppressWarnings("unchecked")
    public double[] geocodeCity(String city) {
        String url = UriComponentsBuilder.fromHttpUrl(GEO_URL)
                .queryParam("q", city)
                .queryParam("limit", 1)
                .queryParam("appid", weatherApiKey)
                .toUriString();

        List<Map<String, Object>> results = restTemplate.getForObject(url, List.class);
        if (results == null || results.isEmpty()) {
            return null;
        }
        Map<String, Object> first = results.get(0);
        double lat = ((Number) first.get("lat")).doubleValue();
        double lon = ((Number) first.get("lon")).doubleValue();
        return new double[]{lat, lon};
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getCurrentWeather(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl(WEATHER_URL)
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("units", "metric")
                .queryParam("appid", weatherApiKey)
                .toUriString();
        return restTemplate.getForObject(url, Map.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getForecast(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl(FORECAST_URL)
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("units", "metric")
                .queryParam("appid", weatherApiKey)
                .toUriString();
        return restTemplate.getForObject(url, Map.class);
    }
}
