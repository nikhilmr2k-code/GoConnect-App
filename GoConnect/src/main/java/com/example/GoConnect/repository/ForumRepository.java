package com.example.GoConnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.GoConnect.entity.Forum;
import com.example.GoConnect.entity.Register;

@Repository
public interface ForumRepository extends JpaRepository<Forum, Long> {
    
    // Find forums by register (user)
    List<Forum> findByRegister(Register register);
    
    // Find forums by register ID
    List<Forum> findByRegisterIdOrderByForumIdDesc(Long registerId);

    @Query(value="select CASE WHEN f.user_register_id  = :id THEN f.friend_register_id  ELSE f.user_register_id  END from register v join friend f on v.id = f.friend_register_id or v.id= f.user_register_id  where f.approval_status ='Y' and v.id =:id ",nativeQuery=true)
    List<Long> getFriendId(@Param("id") long id);


    @Query(value="select * from forum f join friend fr on f.register_id=fr.user_register_id  or f.register_id = fr.friend_register_id  where visibility ='private' and f.register_id =:id",nativeQuery=true)
    List<Forum> getThePrivateRegisterDetails(@Param("id") long id);
    
    // Find public forums
    List<Forum> findByVisibilityOrderByForumIdDesc(String visibility);
    
    // Find forums by location
    List<Forum> findByLocationContainingIgnoreCaseOrderByForumIdDesc(String location);
    
    // Find forums by hashtag
    @Query("SELECT f FROM Forum f WHERE f.hashtag LIKE %:hashtag% ORDER BY f.forumId DESC")
    List<Forum> findByHashtagContaining(@Param("hashtag") String hashtag);
    
    // Count forums by register ID
    long countByRegisterId(Long registerId);
    
    // Find forums by name
    List<Forum> findByNameContainingIgnoreCaseOrderByForumIdDesc(String name);

    // Get forum location counts
    @Query("SELECT f.location, COUNT(f) FROM Forum f WHERE f.location IS NOT NULL AND f.location != '' GROUP BY f.location ORDER BY COUNT(f) DESC")
    List<Object[]> getForumLocationCounts();

    // Get forum hashtag counts
    @Query("SELECT f.hashtag, COUNT(f) FROM Forum f WHERE f.hashtag IS NOT NULL AND f.hashtag != '' GROUP BY f.hashtag ORDER BY COUNT(f) DESC")
    List<Object[]> getForumHashtagCounts();

}