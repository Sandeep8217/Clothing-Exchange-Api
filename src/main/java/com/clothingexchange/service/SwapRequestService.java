
package com.clothingexchange.service;

import com.clothingexchange.model.ClothingItem;
import com.clothingexchange.model.SwapRequest;
import com.clothingexchange.repository.ClothingItemRepository;
import com.clothingexchange.repository.SwapRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;
    private final ClothingItemRepository clothingItemRepository;

    public SwapRequestService(
            SwapRequestRepository swapRequestRepository,
            ClothingItemRepository clothingItemRepository) {
        this.swapRequestRepository = swapRequestRepository;
        this.clothingItemRepository = clothingItemRepository;
    }

    public SwapRequest createSwapRequest(
            String requesterId,
            String requestedItemId,
            String offeredItemId) {

        ClothingItem requestedItem = clothingItemRepository
                .findById(requestedItemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Requested clothing item not found"));

        ClothingItem offeredItem = clothingItemRepository
                .findById(offeredItemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Offered clothing item not found"));

        if (requestedItem.getOwnerId().equals(requesterId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot request your own clothing item");
        }

        if (!requesterId.equals(offeredItem.getOwnerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only offer clothing items that you own");
        }

        if (requestedItemId.equals(offeredItemId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested and offered items must be different");
        }

        if (!"AVAILABLE".equals(requestedItem.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Requested clothing item is not available");
        }

        if (!"AVAILABLE".equals(offeredItem.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Offered clothing item is not available");
        }

        LocalDateTime now = LocalDateTime.now();

        SwapRequest swapRequest = SwapRequest.builder()
                .requesterId(requesterId)
                .ownerId(requestedItem.getOwnerId())
                .requestedItemId(requestedItemId)
                .offeredItemId(offeredItemId)
                .status("PENDING")
                .createdAt(now)
                .updatedAt(now)
                .build();

        return swapRequestRepository.save(swapRequest);
    }

    public List<SwapRequest> getMySwapRequests(String requesterId) {
        return swapRequestRepository.findByRequesterId(requesterId);
    }

    public List<SwapRequest> getIncomingSwapRequests(String ownerId) {
        return swapRequestRepository.findByOwnerId(ownerId);
    }

    public SwapRequest acceptSwapRequest(String swapId, String ownerId) {

        SwapRequest swapRequest = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Swap request not found"));

        // Only the requested item's owner can accept.
        if (!ownerId.equals(swapRequest.getOwnerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the clothing item owner can accept this request");
        }

        // A completed or rejected request cannot be processed again.
        if (!"PENDING".equals(swapRequest.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending swap requests can be accepted");
        }

        ClothingItem requestedItem = clothingItemRepository
                .findById(swapRequest.getRequestedItemId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Requested clothing item not found"));

        ClothingItem offeredItem = clothingItemRepository
                .findById(swapRequest.getOfferedItemId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Offered clothing item not found"));

        // Both items must still be available.
        if (!"AVAILABLE".equals(requestedItem.getStatus())
                || !"AVAILABLE".equals(offeredItem.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "One or both clothing items are no longer available");
        }

        // Mark both items as swapped.
        requestedItem.setStatus("SWAPPED");
        offeredItem.setStatus("SWAPPED");

        clothingItemRepository.save(requestedItem);
        clothingItemRepository.save(offeredItem);

        // Update the swap request.
        swapRequest.setStatus("ACCEPTED");
        swapRequest.setUpdatedAt(LocalDateTime.now());

        return swapRequestRepository.save(swapRequest);
    }

    public SwapRequest rejectSwapRequest(String swapId, String ownerId) {

        SwapRequest swapRequest = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Swap request not found"));

        // Only the requested item's owner can reject.
        if (!ownerId.equals(swapRequest.getOwnerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the clothing item owner can reject this request");
        }

        if (!"PENDING".equals(swapRequest.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending swap requests can be rejected");
        }

        swapRequest.setStatus("REJECTED");
        swapRequest.setUpdatedAt(LocalDateTime.now());

        return swapRequestRepository.save(swapRequest);
    }
}
