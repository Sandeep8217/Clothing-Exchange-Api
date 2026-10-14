
package com.clothingexchange.repository;

import com.clothingexchange.model.SwapRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SwapRequestRepository
        extends MongoRepository<SwapRequest, String> {

    List<SwapRequest> findByRequesterId(String requesterId);

    List<SwapRequest> findByOwnerId(String ownerId);

    List<SwapRequest> findByRequesterIdAndStatus(
            String requesterId, String status);

    List<SwapRequest> findByOwnerIdAndStatus(
            String ownerId, String status);
}
