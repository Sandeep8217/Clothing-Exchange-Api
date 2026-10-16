
package com.clothingexchange.service;

import com.clothingexchange.dto.UpdateProfileRequest;
import com.clothingexchange.model.User;
import com.clothingexchange.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public User getProfile(String userId) {
        return userRepository.findById(userId)
                .filter(User::isActive)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User profile not found"
                ));
    }

    public User updateProfile(
            String userId,
            UpdateProfileRequest request
    ) {
        User user = getProfile(userId);

        user.setFullName(request.fullName().trim());
        user.setPhone(normalize(request.phone()));
        user.setCity(normalize(request.city()));
        user.setBio(normalize(request.bio()));
        user.setProfileImageUrl(normalize(request.profileImageUrl()));

        return userRepository.save(user);
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
