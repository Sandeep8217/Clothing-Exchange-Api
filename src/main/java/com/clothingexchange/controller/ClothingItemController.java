
package com.clothingexchange.controller;

import com.clothingexchange.dto.CreateClothingItemRequest;
import com.clothingexchange.model.ClothingItem;
import com.clothingexchange.service.ClothingItemService;
//import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clothing")
public class ClothingItemController {

    private final ClothingItemService clothingItemService;

    public ClothingItemController(
            ClothingItemService clothingItemService) {
        this.clothingItemService = clothingItemService;
    }

    @PostMapping
    public ResponseEntity<ClothingItem> createListing(
            @Valid @RequestBody CreateClothingItemRequest request,
            Authentication authentication) {

        ClothingItem item = ClothingItem.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .brand(request.brand())
                .size(request.size())
                .condition(request.condition())
                .imageUrls(request.imageUrls())
                .estimatedSwapValue(request.estimatedSwapValue())
                .city(request.city())
                .build();

        ClothingItem savedItem = clothingItemService.createListing(
                item, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    @GetMapping
    public List<ClothingItem> getAvailableListings() {
        return clothingItemService.getAvailableListings();
    }

    @GetMapping("/city/{city}")
    public List<ClothingItem> getListingsByCity(
            @PathVariable String city) {
        return clothingItemService.getListingsByCity(city);
    }

    @GetMapping("/my-listings")
    public List<ClothingItem> getMyListings(
            Authentication authentication) {
        return clothingItemService.getMyListings(
                getCurrentUserId(authentication));
    }

    private String getCurrentUserId(Authentication authentication) {
        // The JWT filter stores the authenticated user's email as the principal.
        return authentication.getName();
    }


    @PutMapping("/{id}")
    public ResponseEntity<ClothingItem> updateListing(
            @PathVariable String id,
            @Valid @RequestBody CreateClothingItemRequest request,
            Authentication authentication) {

        ClothingItem updatedItem = ClothingItem.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .brand(request.brand())
                .size(request.size())
                .condition(request.condition())
                .imageUrls(request.imageUrls())
                .estimatedSwapValue(request.estimatedSwapValue())
                .city(request.city())
                .build();

        ClothingItem savedItem = clothingItemService.updateListing(
                id, authentication.getName(), updatedItem);

        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(
            @PathVariable String id,
            Authentication authentication) {

        clothingItemService.deleteListing(
                id, authentication.getName());

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/category/{category}")
    public List<ClothingItem> getListingsByCategory(
            @PathVariable String category) {
        return clothingItemService.getListingsByCategory(category);
    }

    @GetMapping("/size/{size}")
    public List<ClothingItem> getListingsBySize(
            @PathVariable String size) {
        return clothingItemService.getListingsBySize(size);
    }

    @GetMapping("/brand/{brand}")
    public List<ClothingItem> getListingsByBrand(
            @PathVariable String brand) {
        return clothingItemService.getListingsByBrand(brand);
    }

    @GetMapping("/condition/{condition}")
    public List<ClothingItem> getListingsByCondition(
            @PathVariable String condition) {
        return clothingItemService.getListingsByCondition(condition);
    }


}
