
package com.clothingexchange.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "clothing_items")
public class ClothingItem {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String brand;
    private String size;
    private String condition;

    private List<String> imageUrls;

    private double estimatedSwapValue;

    private String city;

    private String ownerId;

    @Builder.Default
    private String status = "AVAILABLE";

    private LocalDateTime createdAt;
}
