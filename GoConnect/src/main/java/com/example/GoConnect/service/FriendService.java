package com.example.GoConnect.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.GoConnect.dto.FriendApprovalRequest;
import com.example.GoConnect.dto.FriendRequest;
import com.example.GoConnect.dto.UserListResponse;
import com.example.GoConnect.entity.Friend;
import com.example.GoConnect.entity.Register;
import com.example.GoConnect.repository.FriendRepository;
import com.example.GoConnect.repository.RegisterRepository;

@Service
public class FriendService {
    
    @Autowired
    private FriendRepository friendRepository;
    
    @Autowired
    private RegisterRepository registerRepository;
    
    public UserListResponse getAvailableUsers(Long currentUserId) {
        // Get all users except current user
        List<Register> allUsers = registerRepository.findAll();
        List<UserListResponse.UserInfo> availableUsers = new ArrayList<>();
        
        for (Register user : allUsers) {
            if (!user.getId().equals(currentUserId)) {
                // Check friendship status
                String friendshipStatus = getFriendshipStatus(currentUserId, user.getId());
                
                UserListResponse.UserInfo userInfo = new UserListResponse.UserInfo(
                    user.getId(), 
                    user.getName(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getAge(),
                    friendshipStatus
                );
                availableUsers.add(userInfo);
            }
        }
        
        return new UserListResponse(availableUsers);
    }
    
    private String getFriendshipStatus(Long userId, Long otherUserId) {
        Optional<Friend> friendship = friendRepository.findFriendshipBetweenUsers(userId, otherUserId);
        
        if (friendship.isEmpty()) {
            return "NONE";
        }
        
        Friend friend = friendship.get();
        if ("Y".equals(friend.getApprovalStatus())) {
            return "APPROVED";
        } else {
            // Check who sent the request
            if (friend.getUserRegister().getId().equals(userId)) {
                return "PENDING_SENT";
            } else {
                return "PENDING_RECEIVED";
            }
        }
    }
    
    public String sendFriendRequest(FriendRequest request) {
        // Validate users exist
        Optional<Register> userOptional = registerRepository.findById(request.getUserRegisterId());
        Optional<Register> friendOptional = registerRepository.findById(request.getFriendRegisterId());
        
        if (userOptional.isEmpty()) {
            return "User not found";
        }
        if (friendOptional.isEmpty()) {
            return "Friend user not found";
        }
        
        // Check if users are the same
        if (request.getUserRegisterId().equals(request.getFriendRegisterId())) {
            return "Cannot send friend request to yourself";
        }
        
        // Check if friendship already exists
        Optional<Friend> existingFriendship = friendRepository.findFriendshipBetweenUsers(
            request.getUserRegisterId(), request.getFriendRegisterId());
        
        if (existingFriendship.isPresent()) {
            Friend existing = existingFriendship.get();
            if ("Y".equals(existing.getApprovalStatus())) {
                return "Already friends";
            } else {
                return "Friend request already exists";
            }
        }
        
        // Create new friend request
        Friend friendRequest = new Friend(
            userOptional.get(),
            friendOptional.get(),
            "N"
        );
        
        friendRepository.save(friendRequest);
        return "Friend request sent successfully";
    }
    
    public List<Friend> getPendingFriendRequests(Long userId) {
        return friendRepository.findPendingFriendRequests(userId);
    }
    
    public String approveFriendRequest(FriendApprovalRequest request) {
        Optional<Friend> friendshipOptional = friendRepository.findById(request.getFriendshipId());
        
        if (friendshipOptional.isEmpty()) {
            return "Friend request not found";
        }
        
        Friend friendship = friendshipOptional.get();
        
        if ("Y".equals(friendship.getApprovalStatus())) {
            return "Friend request already approved";
        }
        
        if ("APPROVE".equals(request.getAction())) {
            friendship.setApprovalStatus("Y");
            friendRepository.save(friendship);
            return "Friend request approved successfully";
        } else if ("REJECT".equals(request.getAction())) {
            friendRepository.delete(friendship);
            return "Friend request rejected successfully";
        } else {
            return "Invalid action. Use APPROVE or REJECT";
        }
    }
    
    public List<Register> getApprovedFriends(Long userId) {
        return friendRepository.findApprovedFriends(userId);
    }
}