package com.example.GoConnect.service;

import com.example.GoConnect.dto.LoginRequest;
import com.example.GoConnect.dto.LoginResponse;
import com.example.GoConnect.dto.RegisterRequest;
import com.example.GoConnect.entity.Register;
import com.example.GoConnect.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private RegisterRepository registerRepository;
    
    public String registerUser(RegisterRequest request) {
        // Check if username already exists
        if (registerRepository.existsByUsername(request.getUsername())) {
            return "Username already exists";
        }
        
        // Check if email already exists
        if (registerRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }
        
        // Create new user
        Register user = new Register(
            request.getName(),
            request.getAge(),
            request.getEmail(),
            request.getUsername(),
            request.getPassword()
        );
        
        registerRepository.save(user);
        return "User registered successfully";
    }
    
    public LoginResponse loginUser(LoginRequest request) {
        // Find user by username or email
        Optional<Register> userOptional = registerRepository.findByUsernameOrEmail(
            request.getUsernameOrEmail(), 
            request.getUsernameOrEmail()
        );
        
        if (userOptional.isEmpty()) {
            return new LoginResponse(false, null);
        }
        
        Register user = userOptional.get();
        
        // Check password
        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse(false, null);
        }
        
        // Create response data
        LoginResponse.UserData userData = new LoginResponse.UserData(
            user.getId(),
            user.getUsername(),
            user.getName(),
            user.getEmail()
        );
        
        return new LoginResponse(true, userData);
    }
}