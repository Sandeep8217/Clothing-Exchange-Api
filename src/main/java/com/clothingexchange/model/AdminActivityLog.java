
package com.clothingexchange.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "admin_activity_logs")
public class AdminActivityLog {

    @Id
    private String id;

    private String adminId;

    private String adminEmail;

    private String action;

    private String targetType;

    private String targetId;

    private String description;

    private LocalDateTime createdAt;
}
