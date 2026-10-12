
package com.clothingexchange.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateClothingItemRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title must not exceed 100 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotBlank(message = "Category is required")
        String category,

        @NotBlank(message = "Brand is required")
        @Size(max = 100, message = "Brand must not exceed 100 characters")
        String brand,

        @NotBlank(message = "Size is required")
        String size,

        @NotBlank(message = "Condition is required")
        String condition,

        @NotEmpty(message = "At least one image URL is required")
        @Size(max = 5, message = "Maximum 5 images are allowed")
        List<@NotBlank String> imageUrls,

        @DecimalMin(value = "0.0", message = "Swap value cannot be negative")
        @DecimalMax(value = "1000000.0", message = "Swap value cannot exceed 1000000")
        double estimatedSwapValue,

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City must not exceed 100 characters")
        String city
) {}
