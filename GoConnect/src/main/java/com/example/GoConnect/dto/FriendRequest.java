package com.example.GoConnect.dto;

public class FriendRequest {
    private Long userRegisterId;
    private Long friendRegisterId;
    
    // Default constructor
    public FriendRequest() {}
    
    // Constructor
    public FriendRequest(Long userRegisterId, Long friendRegisterId) {
        this.userRegisterId = userRegisterId;
        this.friendRegisterId = friendRegisterId;
    }
    
    // Getters and Setters
    public Long getUserRegisterId() {
        return userRegisterId;
    }
    
    public void setUserRegisterId(Long userRegisterId) {
        this.userRegisterId = userRegisterId;
    }
    
    public Long getFriendRegisterId() {
        return friendRegisterId;
    }
    
    public void setFriendRegisterId(Long friendRegisterId) {
        this.friendRegisterId = friendRegisterId;
    }
}