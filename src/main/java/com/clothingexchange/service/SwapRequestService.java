package com.clothingexchange.service;

import com.clothingexchange.dto.SwapRequestResponse;
import com.clothingexchange.model.ClothingItem;
import com.clothingexchange.model.SwapRequest;
import com.clothingexchange.repository.ClothingItemRepository;
import com.clothingexchange.repository.SwapRequestRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SwapRequestService {

    private static final Logger log =
            LoggerFactory.getLogger(SwapRequestService.class);

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

        log.info(
                "Creating swap: requesterId={}, requestedItemId={}, offeredItemId={}",
                requesterId,
                requestedItemId,
                offeredItemId
        );

        ClothingItem requestedItem = clothingItemRepository
                .findById(requestedItemId)
                .orElseThrow(() -> {
                    log.warn("Requested clothing item not found: {}", requestedItemId);
                    return new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Requested clothing item not found");
                });

        ClothingItem offeredItem = clothingItemRepository
                .findById(offeredItemId)
                .orElseThrow(() -> {
                    log.warn("Offered clothing item not found: {}", offeredItemId);
                    return new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Offered clothing item not found");
                });

        log.info(
                "Swap items found: requestedOwnerId={}, requestedStatus={}, offeredOwnerId={}, offeredStatus={}",
                requestedItem.getOwnerId(),
                requestedItem.getStatus(),
                offeredItem.getOwnerId(),
                offeredItem.getStatus()
        );

        if (requesterId.equals(requestedItem.getOwnerId())) {
            log.warn("Swap rejected: requester attempted to request their own item");

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot request your own clothing item");
        }

        if (!requesterId.equals(offeredItem.getOwnerId())) {
            log.warn("Swap rejected: offered item does not belong to requester");

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only offer clothing items that you own");
        }

        if (requestedItemId.equals(offeredItemId)) {
            log.warn("Swap rejected: requested and offered item IDs are identical");

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested and offered items must be different");
        }

        if (!"AVAILABLE".equals(requestedItem.getStatus())) {
            log.warn("Swap rejected: requested item status is {}",
                    requestedItem.getStatus());

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Requested clothing item is not available");
        }

        if (!"AVAILABLE".equals(offeredItem.getStatus())) {
            log.warn("Swap rejected: offered item status is {}",
                    offeredItem.getStatus());

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

        SwapRequest savedRequest = swapRequestRepository.save(swapRequest);

        log.info("Swap request created successfully: id={}", savedRequest.getId());

        return savedRequest;
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

        if (!ownerId.equals(swapRequest.getOwnerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the clothing item owner can accept this request");
        }

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

        if (!"AVAILABLE".equals(requestedItem.getStatus())
                || !"AVAILABLE".equals(offeredItem.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "One or both clothing items are no longer available");
        }


        requestedItem.setStatus("RESERVED");
        offeredItem.setStatus("RESERVED");

        clothingItemRepository.save(requestedItem);
        clothingItemRepository.save(offeredItem);

// Reject other pending requests involving either swapped item.
        List<SwapRequest> conflictingRequests =
                swapRequestRepository.findPendingRequestsInvolvingItems(
                        requestedItem.getId(),
                        offeredItem.getId()
                );

        LocalDateTime now = LocalDateTime.now();

        for (SwapRequest conflictingRequest : conflictingRequests) {
            if (!conflictingRequest.getId().equals(swapRequest.getId())) {
                conflictingRequest.setStatus("REJECTED");
                conflictingRequest.setUpdatedAt(now);
                swapRequestRepository.save(conflictingRequest);
            }
        }

        swapRequest.setStatus("ACCEPTED");
        swapRequest.setUpdatedAt(now);

        return swapRequestRepository.save(swapRequest);
    }

    public SwapRequest rejectSwapRequest(String swapId, String ownerId) {

        SwapRequest swapRequest = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Swap request not found"));

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

    private SwapRequestResponse toResponse(SwapRequest request) {

        ClothingItem requestedItem = clothingItemRepository
                .findById(request.getRequestedItemId())
                .orElse(null);

        ClothingItem offeredItem = clothingItemRepository
                .findById(request.getOfferedItemId())
                .orElse(null);

        return SwapRequestResponse.from(
                request,
                requestedItem,
                offeredItem
        );
    }

    public List<SwapRequestResponse> getMySwapRequestResponses(
            String requesterId) {

        return swapRequestRepository.findByRequesterId(requesterId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SwapRequestResponse> getIncomingSwapRequestResponses(
            String ownerId) {

        return swapRequestRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    public SwapRequest confirmSwapCompletion(String swapId, String userId) {

        SwapRequest swapRequest = swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Swap request not found"
                ));

        if (!"ACCEPTED".equals(swapRequest.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only accepted swaps can be confirmed"
            );
        }

        if (userId.equals(swapRequest.getRequesterId())) {
            swapRequest.setRequesterConfirmed(true);
        } else if (userId.equals(swapRequest.getOwnerId())) {
            swapRequest.setOwnerConfirmed(true);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only participants can confirm this swap"
            );
        }

        if (swapRequest.isRequesterConfirmed()
                && swapRequest.isOwnerConfirmed()) {

            ClothingItem requestedItem = clothingItemRepository
                    .findById(swapRequest.getRequestedItemId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Requested clothing item not found"
                    ));

            ClothingItem offeredItem = clothingItemRepository
                    .findById(swapRequest.getOfferedItemId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Offered clothing item not found"
                    ));

            requestedItem.setStatus("SWAPPED");
            offeredItem.setStatus("SWAPPED");

            clothingItemRepository.save(requestedItem);
            clothingItemRepository.save(offeredItem);

            swapRequest.setStatus("COMPLETED");
        }

        swapRequest.setUpdatedAt(LocalDateTime.now());

        return swapRequestRepository.save(swapRequest);
    }

}
