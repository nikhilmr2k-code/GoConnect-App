package com.example.GoConnect.dto;

public class ForumRequest {
    private String name;
    private Long registerId;
    private String visibility; // "public" or "private"
    private String hashtag;
    private String comments;
    private String location;
    private String pinLocation; // New field for pin location
    private Double pinLatitude; // Latitude for pin location
    private Double pinLongitude; // Longitude for pin location
    private Long hiddenSpotId; // One-to-one relation with hidden spot
    private String description;
    private String photos;
    
    // Default constructor
    public ForumRequest() {}
    
    // Constructor
    public ForumRequest(String name, Long registerId, String visibility, String hashtag,
                       String comments, String location, String pinLocation, String description, String photos) {
        this.name = name;
        this.registerId = registerId;
        this.visibility = visibility;
        this.hashtag = hashtag;
        this.comments = comments;
        this.location = location;
        this.pinLocation = pinLocation;
        this.description = description;
        this.photos = photos;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Long getRegisterId() {
        return registerId;
    }
    
    public void setRegisterId(Long registerId) {
        this.registerId = registerId;
    }
    
    public String getVisibility() {
        return visibility;
    }
    
    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
    
    public String getHashtag() {
        return hashtag;
    }
    
    public void setHashtag(String hashtag) {
        this.hashtag = hashtag;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPhotos() {
        return photos;
    }
    
    public void setPhotos(String photos) {
        this.photos = photos;
    }
    
    public String getPinLocation() {
        return pinLocation;
    }
    
    public void setPinLocation(String pinLocation) {
        this.pinLocation = pinLocation;
    }
    
    public Long getHiddenSpotId() {
        return hiddenSpotId;
    }
    
    public void setHiddenSpotId(Long hiddenSpotId) {
        this.hiddenSpotId = hiddenSpotId;
    }
    
    public Double getPinLatitude() {
        return pinLatitude;
    }
    
    public void setPinLatitude(Double pinLatitude) {
        this.pinLatitude = pinLatitude;
    }
    
    public Double getPinLongitude() {
        return pinLongitude;
    }
    
    public void setPinLongitude(Double pinLongitude) {
        this.pinLongitude = pinLongitude;
    }
}