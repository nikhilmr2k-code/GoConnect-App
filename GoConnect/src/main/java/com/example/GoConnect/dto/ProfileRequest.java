package com.example.GoConnect.dto;

public class ProfileRequest {
    private String location;
    private String district;
    private String state;
    private Long registerId;
    
    // Default constructor
    public ProfileRequest() {}
    
    // Constructor
    public ProfileRequest(String location, String district, String state, Long registerId) {
        this.location = location;
        this.district = district;
        this.state = state;
        this.registerId = registerId;
    }
    
    // Getters and Setters
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getDistrict() {
        return district;
    }
    
    public void setDistrict(String district) {
        this.district = district;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public Long getRegisterId() {
        return registerId;
    }
    
    public void setRegisterId(Long registerId) {
        this.registerId = registerId;
    }
}