
package com.clothingexchange.service;

import com.clothingexchange.model.ClothingItem;
import com.clothingexchange.repository.ClothingItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClothingItemService {

    private final ClothingItemRepository clothingItemRepository;

    public ClothingItemService(
            ClothingItemRepository clothingItemRepository) {
        this.clothingItemRepository = clothingItemRepository;
    }

    public ClothingItem createListing(ClothingItem item, String ownerId) {
        item.setId(null);
        item.setOwnerId(ownerId);
        item.setStatus("AVAILABLE");
        item.setCreatedAt(LocalDateTime.now());

        return clothingItemRepository.save(item);
    }

    public List<ClothingItem> getAvailableListings() {
        return clothingItemRepository.findByStatus("AVAILABLE");
    }

    public List<ClothingItem> getListingsByCity(String city) {
        return clothingItemRepository
                .findByCityIgnoreCaseAndStatus(city, "AVAILABLE");
    }

    public List<ClothingItem> getMyListings(String ownerId) {
        return clothingItemRepository.findByOwnerId(ownerId);
    }


    public ClothingItem updateListing(
            String itemId,
            String ownerId,
            ClothingItem updatedItem) {

        ClothingItem existingItem = clothingItemRepository
                .findByIdAndOwnerId(itemId, ownerId)
                .orElseThrow(() -> new org.springframework.web.server
                        .ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND,
                        "Listing not found"
                ));

        existingItem.setTitle(updatedItem.getTitle());
        existingItem.setDescription(updatedItem.getDescription());
        existingItem.setCategory(updatedItem.getCategory());
        existingItem.setBrand(updatedItem.getBrand());
        existingItem.setSize(updatedItem.getSize());
        existingItem.setCondition(updatedItem.getCondition());
        existingItem.setImageUrls(updatedItem.getImageUrls());
        existingItem.setEstimatedSwapValue(
                updatedItem.getEstimatedSwapValue());
        existingItem.setCity(updatedItem.getCity());

        return clothingItemRepository.save(existingItem);
    }

    public void deleteListing(String itemId, String ownerId) {
        ClothingItem existingItem = clothingItemRepository
                .findByIdAndOwnerId(itemId, ownerId)
                .orElseThrow(() -> new org.springframework.web.server
                        .ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND,
                        "Listing not found"
                ));

        clothingItemRepository.delete(existingItem);
    }


    public List<ClothingItem> getListingsByCategory(String category) {
        return clothingItemRepository
                .findByCategoryIgnoreCaseAndStatus(category, "AVAILABLE");
    }

    public List<ClothingItem> getListingsBySize(String size) {
        return clothingItemRepository
                .findBySizeIgnoreCaseAndStatus(size, "AVAILABLE");
    }

    public List<ClothingItem> getListingsByBrand(String brand) {
        return clothingItemRepository
                .findByBrandContainingIgnoreCaseAndStatus(brand, "AVAILABLE");
    }

    public List<ClothingItem> getListingsByCondition(String condition) {
        return clothingItemRepository
                .findByConditionIgnoreCaseAndStatus(condition, "AVAILABLE");
    }

}
