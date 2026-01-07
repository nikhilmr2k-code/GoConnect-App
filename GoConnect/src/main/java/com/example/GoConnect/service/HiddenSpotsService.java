package com.example.GoConnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.GoConnect.entity.HiddenSpots;
import com.example.GoConnect.entity.Register;
import com.example.GoConnect.repository.HiddenSpotsRepository;
import com.example.GoConnect.repository.RegisterRepository;

@Service
public class HiddenSpotsService {
    
    @Autowired
    private HiddenSpotsRepository hiddenSpotsRepository;
    
    @Autowired
    private RegisterRepository registerRepository;
    
    public String saveCurrentLocation(Long userId, Double latitude, Double longitude) {
        Optional<Register> userOpt = registerRepository.findById(userId);
        if (userOpt.isPresent()) {
            Register user = userOpt.get();
            user.setCurrentLatitude(latitude);
            user.setCurrentLongitude(longitude);
            registerRepository.save(user);
            return "Current location saved successfully";
        }
        return "User not found";
    }
    
    public String saveHiddenLocation(HiddenSpots hiddenSpot) {
        if (hiddenSpot.getLatitude() == null || hiddenSpot.getLongitude() == null) {
            return "Latitude and longitude are mandatory";
        }
        hiddenSpotsRepository.save(hiddenSpot);
        return "Hidden location saved successfully";
    }
    
    public List<HiddenSpots> getHiddenLocationList(Double latitude, Double longitude, Double radius) {
        // Always return all spots initially
        return hiddenSpotsRepository.findAllSpots();
    }

    public List<HiddenSpots> getSpots(){
        List<HiddenSpots> spots=hiddenSpotsRepository.findAll();
        return spots;
    }

    public HiddenSpots getSpotsuserId(Long userId){
        HiddenSpots user= hiddenSpotsRepository.findById(userId).orElse(null);
        return user;
    }

    public List<HiddenSpots> searchHiddenSpots(String query) {
        return hiddenSpotsRepository.searchByQuery(query);
    }


}