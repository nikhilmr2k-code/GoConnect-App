package com.example.GoConnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "hidden_spots")
public class HiddenSpots {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    private String locationDescription;
    private String locationImage;
    private Double rating;
    private String locationAddress;
    
    // Constructors
    public HiddenSpots() {}
    
    public HiddenSpots(String name, Double latitude, Double longitude, String locationDescription, 
                      String locationImage, Double rating, String locationAddress) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationDescription = locationDescription;
        this.locationImage = locationImage;
        this.rating = rating;
        this.locationAddress = locationAddress;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public String getLocationDescription() { return locationDescription; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }
    
    public String getLocationImage() { return locationImage; }
    public void setLocationImage(String locationImage) { this.locationImage = locationImage; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }
}