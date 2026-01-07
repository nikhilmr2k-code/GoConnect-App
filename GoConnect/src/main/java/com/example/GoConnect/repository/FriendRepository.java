package com.example.GoConnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.GoConnect.entity.Friend;
import com.example.GoConnect.entity.Register;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    
    // Check if friendship exists between two users (either direction)
    @Query("SELECT f FROM Friend f WHERE " +
           "(f.userRegister.id = :userId AND f.friendRegister.id = :friendId) OR " +
           "(f.userRegister.id = :friendId AND f.friendRegister.id = :userId)")
    Optional<Friend> findFriendshipBetweenUsers(@Param("userId") Long userId, @Param("friendId") Long friendId);
    
    // Get all pending friend requests for a user (where user is the friend being requested)
    @Query("SELECT f FROM Friend f WHERE f.friendRegister.id = :userId AND f.approvalStatus = 'N'")
    List<Friend> findPendingFriendRequests(@Param("userId") Long userId);
    
    // Get all approved friends for a user
    @Query(value="SELECT v.* FROM register v JOIN friend f ON (v.id = f.user_register_id OR v.id = f.friend_register_id) WHERE v.id != :userId AND f.approval_status = 'Y'", nativeQuery=true)
    List<Register> findApprovedFriends(@Param("userId") Long userId);

    
    // Get all sent friend requests by a user
    @Query("SELECT f FROM Friend f WHERE f.userRegister.id = :userId AND f.approvalStatus = 'N'")
    List<Friend> findSentFriendRequests(@Param("userId") Long userId);
}