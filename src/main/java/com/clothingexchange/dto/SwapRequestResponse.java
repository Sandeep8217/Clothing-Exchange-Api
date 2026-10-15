
package com.clothingexchange.dto;

import com.clothingexchange.model.ClothingItem;
import com.clothingexchange.model.SwapRequest;

import java.time.LocalDateTime;

public record SwapRequestResponse(
        String id,
        String requesterId,
        String ownerId,
        String requestedItemId,
        String offeredItemId,
        ClothingItem requestedItem,
        ClothingItem offeredItem,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SwapRequestResponse from(
            SwapRequest request,
            ClothingItem requestedItem,
            ClothingItem offeredItem
    ) {
        return new SwapRequestResponse(
                request.getId(),
                request.getRequesterId(),
                request.getOwnerId(),
                request.getRequestedItemId(),
                request.getOfferedItemId(),
                requestedItem,
                offeredItem,
                request.getStatus(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
