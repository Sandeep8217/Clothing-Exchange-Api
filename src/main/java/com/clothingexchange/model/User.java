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
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    private String email;

    private String password;

    private String phone;

    private String city;

    private String profileImageUrl;

    @Builder.Default
    private String role = "USER";

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;
}
