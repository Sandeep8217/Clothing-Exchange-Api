
package com.clothingexchange.repository;

import com.clothingexchange.model.ClothingItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ClothingItemRepository
        extends MongoRepository<ClothingItem, String> {

    List<ClothingItem> findByStatus(String status);

    List<ClothingItem> findByCityIgnoreCaseAndStatus(
            String city, String status);

    List<ClothingItem> findByOwnerId(String ownerId);

    Optional<ClothingItem> findByIdAndOwnerId(
            String id, String ownerId);
}
