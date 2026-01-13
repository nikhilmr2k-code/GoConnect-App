package com.example.GoConnect.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin(origins = "*") // Allow requests from Angular frontend
public class GeocodingController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/geocode/reverse")
    public ResponseEntity<String> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lon) {

        String url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon + "&zoom=18&addressdetails=1";

        HttpHeaders headers = new HttpHeaders();
        // Nominatim requires a valid User-Agent
        headers.set("User-Agent", "GoConnect/1.0 (contact@goconnect.com)"); 

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching geocoding data: " + e.getMessage());
        }
    }
}
