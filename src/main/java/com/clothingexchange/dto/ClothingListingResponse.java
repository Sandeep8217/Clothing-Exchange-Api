
package com.clothingexchange.dto;

import com.clothingexchange.model.ClothingItem;

public record ClothingListingResponse(
        ClothingItem item,
        SellerSummary seller
) {}
