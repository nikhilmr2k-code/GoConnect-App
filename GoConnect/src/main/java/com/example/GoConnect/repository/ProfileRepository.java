package com.example.GoConnect.repository;

import com.example.GoConnect.entity.Profile;
import com.example.GoConnect.entity.Register;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
    Optional<Profile> findByRegister(Register register);
    Optional<Profile> findByRegisterId(Long registerId);
    boolean existsByRegister(Register register);
}