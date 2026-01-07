package com.example.GoConnect.dto;

public class ForumResponse {
    private Long forumId;
    private String name;
    private UserInfo userInfo;
    private String visibility;
    private String hashtag;
    private String comments;
    private String location;
    private String description;
    private String photos;
    
    // Default constructor
    public ForumResponse() {}
    
    // Constructor
    public ForumResponse(Long forumId, String name, UserInfo userInfo, String visibility,
                        String hashtag, String comments, String location, String description, String photos) {
        this.forumId = forumId;
        this.name = name;
        this.userInfo = userInfo;
        this.visibility = visibility;
        this.hashtag = hashtag;
        this.comments = comments;
        this.location = location;
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
}