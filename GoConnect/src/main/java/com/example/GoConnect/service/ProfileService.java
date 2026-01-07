package com.example.GoConnect.service;

import com.example.GoConnect.dto.ProfileRequest;
import com.example.GoConnect.dto.ProfileResponse;
import com.example.GoConnect.entity.Profile;
import com.example.GoConnect.entity.Register;
import com.example.GoConnect.repository.ProfileRepository;
import com.example.GoConnect.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private RegisterRepository registerRepository;
    
    public String createProfile(ProfileRequest request) {
        // Check if register exists
        Optional<Register> registerOptional = registerRepository.findById(request.getRegisterId());
        if (registerOptional.isEmpty()) {
            return "User not found";
        }
        
        Register register = registerOptional.get();
        
        // Check if profile already exists for this user
        if (profileRepository.existsByRegister(register)) {
            return "Profile already exists for this user";
        }
        
        // Create new profile
        Profile profile = new Profile(
            request.getLocation(),
            request.getDistrict(),
            request.getState(),
            register
        );
        
        profileRepository.save(profile);
        return "Profile created successfully";
    }
    
    public ProfileResponse getProfileByRegisterId(Long registerId) {
        Optional<Register> registerOptional = registerRepository.findById(registerId);
        if (registerOptional.isEmpty()) {
            return null;
        }
        
        Register register = registerOptional.get();
        Optional<Profile> profileOptional = profileRepository.findByRegister(register);
        
        if (profileOptional.isEmpty()) {
            return null;
        }
        
        Profile profile = profileOptional.get();
        
        // Create user info
        ProfileResponse.UserInfo userInfo = new ProfileResponse.UserInfo(
            register.getId(),
            register.getName(),
            register.getEmail(),
            register.getUsername(),
            register.getAge()
        );
        
        return new ProfileResponse(
            profile.getId(),
            profile.getLocation(),
            profile.getDistrict(),
            profile.getState(),
            userInfo
        );
    }
    
    public String updateProfile(Long profileId, ProfileRequest request) {
        Optional<Profile> profileOptional = profileRepository.findById(profileId);
        if (profileOptional.isEmpty()) {
            return "Profile not found";
        }
        
        Profile profile = profileOptional.get();
        profile.setLocation(request.getLocation());
        profile.setDistrict(request.getDistrict());
        profile.setState(request.getState());
        
        profileRepository.save(profile);
        return "Profile updated successfully";
    }
}