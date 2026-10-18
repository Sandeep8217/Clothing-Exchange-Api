
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


    List<ClothingItem> findByCategoryIgnoreCaseAndStatus(
            String category, String status);

    List<ClothingItem> findBySizeIgnoreCaseAndStatus(
            String size, String status);

    List<ClothingItem> findByBrandContainingIgnoreCaseAndStatus(
            String brand, String status);

    List<ClothingItem> findByConditionIgnoreCaseAndStatus(
            String condition, String status);


    boolean existsByIdAndOwnerId(String id, String ownerId);


    long countByStatus(String status);



}
