
package com.clothingexchange.controller;

import com.clothingexchange.dto.AdminUserResponse;
import com.clothingexchange.model.AdminActivityLog;
import com.clothingexchange.model.ClothingItem;
import com.clothingexchange.model.User;
import com.clothingexchange.repository.ClothingItemRepository;
import com.clothingexchange.repository.UserRepository;
import com.clothingexchange.service.AdminActivityLogService;
import com.clothingexchange.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminDashboardService adminDashboardService;

    private final UserRepository userRepository;

    private final ClothingItemRepository clothingItemRepository;

    private final AdminActivityLogService adminActivityLogService;

    @GetMapping("/listings")
    public List<ClothingItem> getAllListings() {
        return clothingItemRepository.findAll();
    }

    @GetMapping("/analytics/summary")
    public Map<String, Long> getAnalyticsSummary() {
        return adminDashboardService.getAnalyticsSummary();
    }

//    public AdminController(
//            AdminDashboardService adminDashboardService,
//            UserRepository userRepository
//    ) {
//        this.adminDashboardService = adminDashboardService;
//        this.userRepository = userRepository;
//    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {
        return adminDashboardService.getDashboardStats();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getCity(),
                        user.getRole(),
                        user.isActive(),
                        user.getCreatedAt()
                ))
                .toList();
    }


    @PatchMapping("/users/{id}/status")
    public Map<String, String> updateUserStatus(
            @PathVariable String id,
            @RequestParam boolean active,
            org.springframework.security.core.Authentication authentication
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        if ("ADMIN".equals(user.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Admin accounts cannot be deactivated through this endpoint"
            );
        }

        user.setActive(active);
        userRepository.save(user);

        // Find the authenticated administrator by MongoDB user ID.
        User admin = userRepository.findById(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Authenticated administrator not found"
                        )
                );

        adminActivityLogService.logActivity(
                admin.getId(),
                admin.getEmail(),
                active ? "USER_ACTIVATED" : "USER_DEACTIVATED",
                "USER",
                user.getId(),
                "Changed user " + user.getEmail()
                        + " status to " + (active ? "active" : "inactive")
        );

        return Map.of(
                "message", active
                        ? "User activated successfully"
                        : "User deactivated successfully",
                "userId", user.getId(),
                "active", String.valueOf(user.isActive())
        );
    }



    @DeleteMapping("/listings/{id}")
    public Map<String, String> deleteListing(
            @PathVariable String id,
            org.springframework.security.core.Authentication authentication
    ) {
        ClothingItem item = clothingItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Clothing listing not found"
                ));

        // Capture listing details before deleting it.
        String listingTitle = item.getTitle();

        User admin = userRepository.findById(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated administrator not found"
                ));

        clothingItemRepository.delete(item);

        adminActivityLogService.logActivity(
                admin.getId(),
                admin.getEmail(),
                "LISTING_DELETED",
                "LISTING",
                id,
                "Deleted listing: " + listingTitle
        );

        return Map.of(
                "message", "Clothing listing deleted successfully",
                "listingId", id
        );
    }


    @GetMapping("/activity-logs")
    public List<AdminActivityLog> getActivityLogs() {
        return adminActivityLogService.getAllActivities();
    }

}
