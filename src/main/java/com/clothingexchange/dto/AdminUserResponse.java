package com.clothingexchange.dto;

import java.time.LocalDateTime;

public record AdminUserResponse(
        String id,
        String fullName,
        String email,
        String phone,
        String city,
        String role,
        boolean active,
        LocalDateTime createdAt
) {
}
