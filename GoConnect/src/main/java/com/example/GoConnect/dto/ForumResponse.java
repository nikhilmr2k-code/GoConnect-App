package com.example.GoConnect.dto;

public class ForumResponse {
    private Long forumId;
    private String name;
    private UserInfo userInfo;
    private String visibility;
    private String hashtag;
    private String comments;
    private String location;
    private Double pinLatitude;
    private Double pinLongitude;
    private HiddenSpotInfo hiddenSpot; // One-to-one relation with hidden spot
    private String description;
    private String photos;
    
    // Default constructor
    public ForumResponse() {}
    
    // Constructor
    public ForumResponse(Long forumId, String name, UserInfo userInfo, String visibility,
                        String hashtag, String comments, String location, Double pinLatitude,Double pinLongitude, String description, String photos) {
        this.forumId = forumId;
        this.name = name;
        this.userInfo = userInfo;
        this.visibility = visibility;
        this.hashtag = hashtag;
        this.comments = comments;
        this.location = location;
        this.pinLatitude = pinLatitude;
        this.pinLongitude = pinLongitude;
        this.description = description;
        this.photos = photos;
    }
    
    // Getters and Setters
    public Long getForumId() {
        return forumId;
    }
    
    public void setForumId(Long forumId) {
        this.forumId = forumId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public UserInfo getUserInfo() {
        return userInfo;
    }
    
    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
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
    
    public HiddenSpotInfo getHiddenSpot() {
        return hiddenSpot;
    }
    
    public void setHiddenSpot(HiddenSpotInfo hiddenSpot) {
        this.hiddenSpot = hiddenSpot;
    }
    
    // Inner class for user information
    public static class UserInfo {
        private Long id;
        private String name;
        private String username;
        private String email;
        
        // Default constructor
        public UserInfo() {}
        
        // Constructor
        public UserInfo(Long id, String name, String username, String email) {
            this.id = id;
            this.name = name;
            this.username = username;
            this.email = email;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
    
    // Inner class for hidden spot information
    public static class HiddenSpotInfo {
        private Long id;
        private String name;
        private Double latitude;
        private Double longitude;
        private String locationDescription;
        private String locationAddress;
        
        // Default constructor
        public HiddenSpotInfo() {}
        
        // Constructor
        public HiddenSpotInfo(Long id, String name, Double latitude, Double longitude, 
                             String locationDescription, String locationAddress) {
            this.id = id;
            this.name = name;
            this.latitude = latitude;
            this.longitude = longitude;
            this.locationDescription = locationDescription;
            this.locationAddress = locationAddress;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public Double getLatitude() {
            return latitude;
        }
        
        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }
        
        public Double getLongitude() {
            return longitude;
        }
        
        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }
        
        public String getLocationDescription() {
            return locationDescription;
        }
        
        public void setLocationDescription(String locationDescription) {
            this.locationDescription = locationDescription;
        }
        
        public String getLocationAddress() {
            return locationAddress;
        }
        
        public void setLocationAddress(String locationAddress) {
            this.locationAddress = locationAddress;
        }
    }
}