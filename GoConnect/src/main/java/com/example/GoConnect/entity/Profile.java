package com.example.GoConnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profile")
public class Profile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private String district;
    
    @Column(nullable = false)
    private String state;
    
    @OneToOne
    @JoinColumn(name = "register_id", referencedColumnName = "id")
    private Register register;
    
    // Default constructor
    public Profile() {}
    
    // Constructor
    public Profile(String location, String district, String state, Register register) {
        this.location = location;
        this.district = district;
        this.state = state;
        this.register = register;
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
    
    public Register getRegister() {
        return register;
    }
    
    public void setRegister(Register register) {
        this.register = register;
    }
}