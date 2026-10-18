
package com.clothingexchange.repository;

import com.clothingexchange.model.SwapRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SwapRequestRepository
        extends MongoRepository<SwapRequest, String> {

    List<SwapRequest> findByRequesterId(String requesterId);

    List<SwapRequest> findByOwnerId(String ownerId);

    List<SwapRequest> findByRequesterIdAndStatus(
            String requesterId, String status);

    List<SwapRequest> findByOwnerIdAndStatus(
            String ownerId, String status);


    long countByStatus(String status);


    @Query("{ 'status': 'PENDING', '$or': [ " +
            "{ 'requestedItemId': ?0 }, " +
            "{ 'offeredItemId': ?0 }, " +
            "{ 'requestedItemId': ?1 }, " +
            "{ 'offeredItemId': ?1 } ] }")
    List<SwapRequest> findPendingRequestsInvolvingItems(
            String firstItemId,
            String secondItemId
    );





}
