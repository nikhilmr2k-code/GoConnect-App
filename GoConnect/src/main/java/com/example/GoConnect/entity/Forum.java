package com.example.GoConnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "forum")
public class Forum {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long forumId;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "register_id", referencedColumnName = "id")
    private Register register;
    
    @Column(nullable = false)
    private String visibility; // "public" or "private"
    
    @Column(columnDefinition = "TEXT")
    private String hashtag;
    
    @Column(columnDefinition = "TEXT")
    private String comments;
    
    @Column
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String photos; // Store as comma-separated URLs or JSON string
    
    // Default constructor
    public Forum() {}
    
    // Constructor
    public Forum(String name, Register register, String visibility, String hashtag, 
                 String comments, String location, String description, String photos) {
        this.name = name;
        this.register = register;
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
    
    public Register getRegister() {
        return register;
    }
    
    public void setRegister(Register register) {
        this.register = register;
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
}