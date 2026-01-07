package com.example.GoConnect.dto;

import java.util.List;

public class UserListResponse {
    private List<UserInfo> availableUsers;
    
    // Default constructor
    public UserListResponse() {}
    
    // Constructor
    public UserListResponse(List<UserInfo> availableUsers) {
        this.availableUsers = availableUsers;
    }
    
    // Getters and Setters
    public List<UserInfo> getAvailableUsers() {
        return availableUsers;
    }
    
    public void setAvailableUsers(List<UserInfo> availableUsers) {
        this.availableUsers = availableUsers;
    }
    
    // Inner class for user information
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private String username;
        private Integer age;
        private String friendshipStatus; // "NONE", "PENDING_SENT", "PENDING_RECEIVED", "APPROVED"
        
        // Default constructor
        public UserInfo() {}
        
        // Constructor
        public UserInfo(Long id, String name, String email, String username, Integer age, String friendshipStatus) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.username = username;
            this.age = age;
            this.friendshipStatus = friendshipStatus;
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
        
        public String getFriendshipStatus() {
            return friendshipStatus;
        }
        
        public void setFriendshipStatus(String friendshipStatus) {
            this.friendshipStatus = friendshipStatus;
        }
    }
}