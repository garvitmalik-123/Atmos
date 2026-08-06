package com.atmos.backend.controller;

import com.atmos.backend.service.WeatherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/weather")
    public ResponseEntity<?> getWeather(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) String city
    ) {
        return resolveAndFetch(lat, lon, city, weatherService::getCurrentWeather, "weather");
    }

    @GetMapping("/forecast")
    public ResponseEntity<?> getForecast(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) String city
    ) {
        return resolveAndFetch(lat, lon, city, weatherService::getForecast, "forecast");
    }

    private interface CoordFetcher {
        Map<String, Object> fetch(double lat, double lon);
    }

    private ResponseEntity<?> resolveAndFetch(Double lat, Double lon, String city, CoordFetcher fetcher, String what) {
        if (!weatherService.isConfigured()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Weather API key not configured"));
        }
        if ((city == null || city.isBlank()) && (lat == null || lon == null)) {
            return ResponseEntity.badRequest().body(Map.of("error", "City or lat/lon parameters required"));
        }

        try {
            double latitude;
            double longitude;

            if (city != null && !city.isBlank()) {
                double[] coords = weatherService.geocodeCity(city);
                if (coords == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "City not found"));
                }
                latitude = coords[0];
                longitude = coords[1];
            } else {
                latitude = lat;
                longitude = lon;
            }

            return ResponseEntity.ok(fetcher.fetch(latitude, longitude));
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", "Failed to fetch " + what, "details", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch " + what, "details", ex.getMessage()));
        }
    }
}
