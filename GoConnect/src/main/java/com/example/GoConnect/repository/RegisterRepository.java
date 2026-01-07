package com.example.GoConnect.repository;

import com.example.GoConnect.entity.Register;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegisterRepository extends JpaRepository<Register, Long> {
    
    Optional<Register> findByUsername(String username);
    Optional<Register> findByEmail(String email);
    Optional<Register> findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}