package com.example.GoConnect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.GoConnect.dto.ForumRequest;
import com.example.GoConnect.dto.ForumResponse;
import com.example.GoConnect.dto.FriendApprovalRequest;
import com.example.GoConnect.dto.FriendRequest;
import com.example.GoConnect.dto.LoginRequest;
import com.example.GoConnect.dto.LoginResponse;
import com.example.GoConnect.dto.ProfileRequest;
import com.example.GoConnect.dto.ProfileResponse;
import com.example.GoConnect.dto.RegisterRequest;
import com.example.GoConnect.dto.UserListResponse;
import com.example.GoConnect.entity.Friend;
import com.example.GoConnect.entity.HiddenSpots;
import com.example.GoConnect.entity.Register;
import com.example.GoConnect.service.AdminService;
import com.example.GoConnect.service.ForumService;
import com.example.GoConnect.service.FriendService;
import com.example.GoConnect.service.HiddenSpotsService;
import com.example.GoConnect.service.ProfileService;

@RestController
@CrossOrigin(origins = "*")
public class GoConnectController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private ProfileService profileService;
    
    @Autowired
    private FriendService friendService;
    
    @Autowired
    private ForumService forumService;
    
    @Autowired
    private HiddenSpotsService hiddenSpotsService;

    @GetMapping("/sample")
    public ResponseEntity<String> getSampleBody() {
        return ResponseEntity.ok("Sample Value");
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        String result = adminService.registerUser(request);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        LoginResponse response = adminService.loginUser(request);
        
        if (response.isAuth()) {
              return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Invalid user");
        }
    }
    
    @PostMapping("/profile")
    public ResponseEntity<String> createProfile(@RequestBody ProfileRequest request) {
        String result = profileService.createProfile(request);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/profile/{registerId}")
    public ResponseEntity<?> getProfile(@PathVariable Long registerId) {
        ProfileResponse response = profileService.getProfileByRegisterId(registerId);
        
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Profile not found");
        }
    }
    
    @PutMapping("/profile/{profileId}")
    public ResponseEntity<String> updateProfile(@PathVariable Long profileId, @RequestBody ProfileRequest request) {
        String result = profileService.updateProfile(profileId, request);
        return ResponseEntity.ok(result);
    }
    
    // Friend Management Endpoints
    
    @GetMapping("/users/{currentUserId}")
    public ResponseEntity<UserListResponse> getAvailableUsers(@PathVariable Long currentUserId) {
        UserListResponse response = friendService.getAvailableUsers(currentUserId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/friend-request")
    public ResponseEntity<String> sendFriendRequest(@RequestBody FriendRequest request) {
        String result = friendService.sendFriendRequest(request);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/friend-requests/{userId}")
    public ResponseEntity<List<Friend>> getPendingFriendRequests(@PathVariable Long userId) {
        List<Friend> requests = friendService.getPendingFriendRequests(userId);
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping("/friend-approval")
    public ResponseEntity<String> approveFriendRequest(@RequestBody FriendApprovalRequest request) {
        String result = friendService.approveFriendRequest(request);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<Register>> getApprovedFriends(@PathVariable Long userId) {
        List<Register> friends = friendService.getApprovedFriends(userId);
        return ResponseEntity.ok(friends);
    }
    
    // Forum Management Endpoints
    
    @PostMapping("/saveForum")
    public ResponseEntity<String> saveForum(@RequestBody ForumRequest request) {
        String result = forumService.saveForum(request);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/forums/public/{id}")
    public ResponseEntity<List<ForumResponse>> getPublicForums(@PathVariable long id) {
        List<ForumResponse> forums = forumService.getPublicForums(id);
        return ResponseEntity.ok(forums);
    }
    
    @GetMapping("/forums/user/{registerId}")
    public ResponseEntity<List<ForumResponse>> getForumsByUser(@PathVariable Long registerId) {
        List<ForumResponse> forums = forumService.getForumsByUser(registerId);
        return ResponseEntity.ok(forums);
    }
    
    @GetMapping("/forums/location/{location}")
    public ResponseEntity<List<ForumResponse>> getForumsByLocation(@PathVariable String location) {
        List<ForumResponse> forums = forumService.getForumsByLocation(location);
        return ResponseEntity.ok(forums);
    }
    
    @GetMapping("/forums/hashtag/{hashtag}")
    public ResponseEntity<List<ForumResponse>> getForumsByHashtag(@PathVariable String hashtag) {
        List<ForumResponse> forums = forumService.getForumsByHashtag(hashtag);
        return ResponseEntity.ok(forums);
    }
    
    @GetMapping("/forum/{forumId}")
    public ResponseEntity<?> getForumById(@PathVariable Long forumId) {
        ForumResponse forum = forumService.getForumById(forumId);
        
        if (forum != null) {
            return ResponseEntity.ok(forum);
        } else {
            return ResponseEntity.badRequest().body("Forum not found");
        }
    }
    
    // Additional endpoints to demonstrate userId usage
    
    @GetMapping("/forum/{forumId}/owner")
    public ResponseEntity<?> getForumOwner(@PathVariable Long forumId) {
        Long userId = forumService.getUserIdFromForum(forumId);
        
        if (userId != null) {
            return ResponseEntity.ok("Forum " + forumId + " is owned by user ID: " + userId);
        } else {
            return ResponseEntity.badRequest().body("Forum not found");
        }
    }
    
    @GetMapping("/user/{userId}/forums/count")
    public ResponseEntity<Long> getUserForumsCount(@PathVariable Long userId) {
        long count = forumService.getForumsCountByUser(userId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/forum/{forumId}/check-owner/{userId}")
    public ResponseEntity<Boolean> checkForumOwnership(@PathVariable Long forumId, @PathVariable Long userId) {
        boolean isOwner = forumService.isForumOwnedByUser(forumId, userId);
        return ResponseEntity.ok(isOwner);
    }
    
    @GetMapping("/forums/locations/count")
    public ResponseEntity<List<Object[]>> getForumLocationCounts() {
        List<Object[]> locationCounts = forumService.getForumLocationCounts();
        return ResponseEntity.ok(locationCounts);
    }
    
    @GetMapping("/forums/hashtags/count")
    public ResponseEntity<List<Object[]>> getForumHashtagCounts() {
        List<Object[]> hashtagCounts = forumService.getForumHashtagCounts();
        return ResponseEntity.ok(hashtagCounts);
    }
    
    // Hidden Spots Endpoints
    
    @PostMapping("/user/{userId}/location")
    public ResponseEntity<String> saveCurrentLocation(@PathVariable Long userId, @RequestBody LocationRequest request) {
        String result = hiddenSpotsService.saveCurrentLocation(userId, request.getLatitude(), request.getLongitude());
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/hidden-spots")
    public ResponseEntity<String> saveHiddenLocation(@RequestBody HiddenSpots hiddenSpot) {
        String result = hiddenSpotsService.saveHiddenLocation(hiddenSpot);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/hidden-spots/{latitude}/{longitude}")
    public ResponseEntity<List<HiddenSpots>> getHiddenLocationList(@PathVariable Double latitude, @PathVariable Double longitude) {
        List<HiddenSpots> spots = hiddenSpotsService.getHiddenLocationList(latitude, longitude, 10.0);
        return ResponseEntity.ok(spots);
    }

    @GetMapping("/get-hidden-spots")
    public ResponseEntity<List<HiddenSpots>> getSpots(){
        List<HiddenSpots> spots=hiddenSpotsService.getSpots();
        return ResponseEntity.ok(spots);
    }

    @GetMapping("/get-hidden-spots/{userId}")
    public ResponseEntity<HiddenSpots> getUserId(@PathVariable long userId){
        HiddenSpots spots=hiddenSpotsService.getSpotsuserId(userId);
        return ResponseEntity.ok(spots);
    }

    @GetMapping("/search-hidden-spots/{query}")
    public ResponseEntity<List<HiddenSpots>> searchHiddenSpots(@PathVariable String query) {
        List<HiddenSpots> spots = hiddenSpotsService.searchHiddenSpots(query);
        return ResponseEntity.ok(spots);
    }
    
    // Get discussed hidden spots from forums
    @GetMapping("/forums/discussed-spots/{userId}")
    public ResponseEntity<List<ForumResponse>> getDiscussedHiddenSpots(@PathVariable Long userId) {
        List<ForumResponse> forums = forumService.getDiscussedHiddenSpots(userId);
        return ResponseEntity.ok(forums);
    }

    
    public static class LocationRequest {
        private Double latitude;
        private Double longitude;
        
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
    }
}