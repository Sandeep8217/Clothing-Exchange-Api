
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
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    private String swapRequestId;

    private String senderId;

    private String receiverId;

    private String content;

    @Builder.Default
    private boolean read = false;

    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();
}
