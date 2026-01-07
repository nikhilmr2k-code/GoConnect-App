package com.example.GoConnect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "friend")
public class Friend {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_register_id", referencedColumnName = "id")
    private Register userRegister;
    
    @ManyToOne
    @JoinColumn(name = "friend_register_id", referencedColumnName = "id")
    private Register friendRegister;
    
    @Column(nullable = false, length = 1)
    private String approvalStatus = "N"; // N = Pending, Y = Approved
    
    // Default constructor
    public Friend() {}
    
    // Constructor
    public Friend(Register userRegister, Register friendRegister, String approvalStatus) {
        this.userRegister = userRegister;
        this.friendRegister = friendRegister;
        this.approvalStatus = approvalStatus;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Register getUserRegister() {
        return userRegister;
    }
    
    public void setUserRegister(Register userRegister) {
        this.userRegister = userRegister;
    }
    
    public Register getFriendRegister() {
        return friendRegister;
    }
    
    public void setFriendRegister(Register friendRegister) {
        this.friendRegister = friendRegister;
    }
    
    public String getApprovalStatus() {
        return approvalStatus;
    }
    
    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }
}