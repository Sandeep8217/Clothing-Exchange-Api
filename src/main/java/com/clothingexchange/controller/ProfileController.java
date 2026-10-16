
package com.clothingexchange.controller;

import com.clothingexchange.dto.UpdateProfileRequest;
import com.clothingexchange.model.User;
import com.clothingexchange.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public Map<String, Object> getProfile(
            Authentication authentication
    ) {
        User user = profileService.getProfile(authentication.getName());
        return toProfileResponse(user);
    }

    @PutMapping
    public Map<String, Object> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        User user = profileService.updateProfile(
                authentication.getName(), request
        );

        return toProfileResponse(user);
    }

    private Map<String, Object> toProfileResponse(User user) {
        return Map.of(
                "id", user.getId(),
                "fullName", safe(user.getFullName()),
                "email", safe(user.getEmail()),
                "phone", safe(user.getPhone()),
                "city", safe(user.getCity()),
                "bio", safe(user.getBio()),
                "profileImageUrl", safe(user.getProfileImageUrl())
        );
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
