package com.example.GoConnect.dto;

public class LoginResponse {
    private boolean auth;
    private UserData respData;
    
    // Default constructor
    public LoginResponse() {}
    
    // Constructor
    public LoginResponse(boolean auth, UserData respData) {
        this.auth = auth;
        this.respData = respData;
    }
    
    // Getters and Setters
    public boolean isAuth() {
        return auth;
    }
    
    public void setAuth(boolean auth) {
        this.auth = auth;
    }
    
    public UserData getRespData() {
        return respData;
    }
    
    public void setRespData(UserData respData) {
        this.respData = respData;
    }
    
    // Inner class for user data
    public static class UserData {
        private Long id;
        private String username;
        private String name;
        private String email;
        
        // Default constructor
        public UserData() {}
        
        // Constructor
        public UserData(Long id, String username, String name, String email) {
            this.id = id;
            this.username = username;
            this.name = name;
            this.email = email;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
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
    }
}