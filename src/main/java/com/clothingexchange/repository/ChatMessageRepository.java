
package com.clothingexchange.repository;

import com.clothingexchange.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository
        extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findBySwapRequestIdOrderBySentAtAsc(
            String swapRequestId
    );

    List<ChatMessage> findBySwapRequestIdAndReceiverIdAndReadFalse(
            String swapRequestId,
            String receiverId
    );

    long countByReceiverIdAndReadFalse(String receiverId);
}
