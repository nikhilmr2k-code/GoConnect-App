package com.example.GoConnect.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.GoConnect.dto.ForumRequest;
import com.example.GoConnect.dto.ForumResponse;
import com.example.GoConnect.entity.Forum;
import com.example.GoConnect.entity.Register;
import com.example.GoConnect.repository.ForumRepository;
import com.example.GoConnect.repository.RegisterRepository;

@Service
public class ForumService {
    
    @Autowired
    private ForumRepository forumRepository;
    
    @Autowired
    private RegisterRepository registerRepository;
    
    public String saveForum(ForumRequest request) {
        // Get the userId from the request
        Long userId = request.getRegisterId();
        
        // Log the userId for debugging
        System.out.println("Creating forum for userId: " + userId);
        
        // Validate that userId is provided
        if (userId == null) {
            return "User ID is required";
        }
        
        // Validate user exists
        Optional<Register> registerOptional = registerRepository.findById(userId);
        if (registerOptional.isEmpty()) {
            System.out.println("User not found with ID: " + userId);
            return "User not found";
        }
        
        Register register = registerOptional.get();
        System.out.println("Found user: " + register.getName() + " (ID: " + register.getId() + ")");
        
        // Validate required fields
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return "Forum name is required";
        }
        
        if (request.getVisibility() == null || request.getVisibility().trim().isEmpty()) {
            return "Visibility is required";
        }
        
        // Validate visibility values
        if (!request.getVisibility().equalsIgnoreCase("public") && 
            !request.getVisibility().equalsIgnoreCase("private")) {
            return "Visibility must be either 'public' or 'private'";
        }
        
        // Create new forum with the user
        Forum forum = new Forum(
            request.getName(),
            register, // This associates the forum with the user
            request.getVisibility().toLowerCase(),
            request.getHashtag(),
            request.getComments(),
            request.getLocation(),
            request.getDescription(),
            request.getPhotos()
        );
        
        // Save the forum
        Forum savedForum = forumRepository.save(forum);
        System.out.println("Forum saved successfully with ID: " + savedForum.getForumId() + 
                          " for user: " + register.getName() + " (UserID: " + userId + ")");
        
        return "Forum saved successfully";
    }
    
    public List<ForumResponse> getPublicForums(long regId) {
        List<Forum> forums = forumRepository.findByVisibilityOrderByForumIdDesc("public");

        List<Long> val=forumRepository.getFriendId(regId);
        for(Long v : val){
            forums.addAll(forumRepository.getThePrivateRegisterDetails(v));
        }

        System.out.println("Forums ::: "+ forums);

        return convertToForumResponseList(forums);
    }
    
    public List<ForumResponse> getForumsByUser(Long registerId) {
        System.out.println("Getting forums for userId: " + registerId);
        List<Forum> forums = forumRepository.findByRegisterIdOrderByForumIdDesc(registerId);
        System.out.println("Found " + forums.size() + " forums for userId: " + registerId);
        return convertToForumResponseList(forums);
    }
    
    public List<ForumResponse> getForumsByLocation(String location) {
        List<Forum> forums = forumRepository.findByLocationContainingIgnoreCaseOrderByForumIdDesc(location);
        return convertToForumResponseList(forums);
    }
    
    public List<ForumResponse> getForumsByHashtag(String hashtag) {
        List<Forum> forums = forumRepository.findByHashtagContaining(hashtag);
        return convertToForumResponseList(forums);
    }
    
    public ForumResponse getForumById(Long forumId) {
        Optional<Forum> forumOptional = forumRepository.findById(forumId);
        if (forumOptional.isEmpty()) {
            return null;
        }
        
        Forum forum = forumOptional.get();
        return convertToForumResponse(forum);
    }
    
    private List<ForumResponse> convertToForumResponseList(List<Forum> forums) {
        List<ForumResponse> responses = new ArrayList<>();
        for (Forum forum : forums) {
            responses.add(convertToForumResponse(forum));
        }
        return responses;
    }
    
    private ForumResponse convertToForumResponse(Forum forum) {
        ForumResponse.UserInfo userInfo = new ForumResponse.UserInfo(
            forum.getRegister().getId(),
            forum.getRegister().getName(),
            forum.getRegister().getUsername(),
            forum.getRegister().getEmail()
        );
        
        return new ForumResponse(
            forum.getForumId(),
            forum.getName(),
            userInfo,
            forum.getVisibility(),
            forum.getHashtag(),
            forum.getComments(),
            forum.getLocation(),
            forum.getDescription(),
            forum.getPhotos()
        );
    }
    
    /**
     * Helper method to get the userId from a forum
     * @param forumId The forum ID
     * @return The userId who created the forum, or null if forum not found
     */
    public Long getUserIdFromForum(Long forumId) {
        Optional<Forum> forumOptional = forumRepository.findById(forumId);
        if (forumOptional.isPresent()) {
            Long userId = forumOptional.get().getRegister().getId();
            System.out.println("Forum ID " + forumId + " belongs to userId: " + userId);
            return userId;
        }
        System.out.println("Forum not found with ID: " + forumId);
        return null;
    }
    
    /**
     * Helper method to check if a user owns a specific forum
     * @param forumId The forum ID
     * @param userId The user ID to check
     * @return true if the user owns the forum, false otherwise
     */
    public boolean isForumOwnedByUser(Long forumId, Long userId) {
        Long forumOwnerId = getUserIdFromForum(forumId);
        boolean isOwner = forumOwnerId != null && forumOwnerId.equals(userId);
        System.out.println("Forum ID " + forumId + " owned by userId " + userId + ": " + isOwner);
        return isOwner;
    }
    
    /**
     * Get forums count for a specific user
     * @param userId The user ID
     * @return The number of forums created by the user
     */
    public long getForumsCountByUser(Long userId) {
        long count = forumRepository.countByRegisterId(userId);
        System.out.println("User ID " + userId + " has created " + count + " forums");
        return count;
    }
    
    /**
     * Get forum location counts
     * @return List of location and count pairs
     */
    public List<Object[]> getForumLocationCounts() {
        return forumRepository.getForumLocationCounts();
    }
    
    /**
     * Get forum hashtag counts
     * @return List of hashtag and count pairs
     */
    public List<Object[]> getForumHashtagCounts() {
        return forumRepository.getForumHashtagCounts();
    }
}