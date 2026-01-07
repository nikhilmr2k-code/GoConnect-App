package com.example.GoConnect.repository;

import com.example.GoConnect.entity.HiddenSpots;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiddenSpotsRepository extends JpaRepository<HiddenSpots, Long> {
    
    @Query("SELECT h FROM HiddenSpots h WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(h.latitude)) * " +
           "cos(radians(h.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(h.latitude)))) <= :radius")
    List<HiddenSpots> findSpotsWithinRadius(@Param("latitude") Double latitude, 
                                           @Param("longitude") Double longitude, 
                                           @Param("radius") Double radius);
    
    // Fallback method to get all spots if radius search fails
    @Query("SELECT h FROM HiddenSpots h")
    List<HiddenSpots> findAllSpots();
    
    @Query("SELECT h FROM HiddenSpots h WHERE " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.locationDescription) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.locationAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "CAST(h.latitude AS string) LIKE CONCAT('%', :query, '%') OR " +
           "CAST(h.longitude AS string) LIKE CONCAT('%', :query, '%')")
    List<HiddenSpots> searchByQuery(@Param("query") String query);
}