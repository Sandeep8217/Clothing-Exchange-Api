package com.clothingexchange.service;

import com.clothingexchange.repository.ClothingItemRepository;
import com.clothingexchange.repository.SwapRequestRepository;
import com.clothingexchange.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final ClothingItemRepository clothingItemRepository;
    private final SwapRequestRepository swapRequestRepository;

    public Map<String, Long> getDashboardStats() {
        return Map.of(
                "totalUsers", userRepository.count(),
                "activeUsers", userRepository.countByActiveTrue(),
                "totalListings", clothingItemRepository.count(),
                "pendingSwaps",
                swapRequestRepository.countByStatus("PENDING")
        );
    }

    public Map<String, Long> getAnalyticsSummary() {
        return Map.of(
                "totalUsers", userRepository.count(),
                "activeUsers", userRepository.countByActiveTrue(),
                "inactiveUsers", userRepository.countByActiveFalse(),
                "totalListings", clothingItemRepository.count(),
                "availableListings",
                clothingItemRepository.countByStatus("AVAILABLE"),
                "swappedListings",
                clothingItemRepository.countByStatus("SWAPPED"),
                "pendingSwaps",
                swapRequestRepository.countByStatus("PENDING"),
                "acceptedSwaps",
                swapRequestRepository.countByStatus("ACCEPTED"),
                "rejectedSwaps",
                swapRequestRepository.countByStatus("REJECTED")
        );
    }
}
