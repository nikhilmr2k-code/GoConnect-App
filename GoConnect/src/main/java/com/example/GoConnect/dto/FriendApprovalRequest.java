package com.example.GoConnect.dto;

public class FriendApprovalRequest {
    private Long friendshipId;
    private String action; // "APPROVE" or "REJECT"
    
    // Default constructor
    public FriendApprovalRequest() {}
    
    // Constructor
    public FriendApprovalRequest(Long friendshipId, String action) {
        this.friendshipId = friendshipId;
        this.action = action;
    }
    
    // Getters and Setters
    public Long getFriendshipId() {
        return friendshipId;
    }
    
    public void setFriendshipId(Long friendshipId) {
        this.friendshipId = friendshipId;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
}