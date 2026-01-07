package com.example.GoConnect.dto;

public class ProfileResponse {
    private Long id;
    private String location;
    private String district;
    private String state;
    private UserInfo userInfo;
    
    // Default constructor
    public ProfileResponse() {}
    
    // Constructor
    public ProfileResponse(Long id, String location, String district, String state, UserInfo userInfo) {
        this.id = id;
        this.location = location;
        this.district = district;
        this.state = state;
        this.userInfo = userInfo;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public UserInfo getUserInfo() {
        return userInfo;
    }
    
    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }
    
    // Inner class for user information
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private String username;
        private Integer age;
        
        // Default constructor
        public UserInfo() {}
        
        // Constructor
        public UserInfo(Long id, String name, String email, String username, Integer age) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.username = username;
            this.age = age;
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
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public Integer getAge() {
            return age;
        }
        
        public void setAge(Integer age) {
            this.age = age;
        }
    }
}