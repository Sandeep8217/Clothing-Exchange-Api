
package com.clothingexchange.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "swap_requests")
public class SwapRequest {

    @Id
    private String id;

    private String requesterId;

    private String ownerId;

    private String requestedItemId;

    private String offeredItemId;

    @Builder.Default
    private String status = "PENDING";

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
