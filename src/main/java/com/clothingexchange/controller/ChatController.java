package com.clothingexchange.controller;

import com.clothingexchange.dto.SendChatMessageRequest;
import com.clothingexchange.model.ChatMessage;
import com.clothingexchange.service.ChatService;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(
            ChatService chatService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{swapRequestId}")
    public void sendMessage(
            @DestinationVariable String swapRequestId,
            SendChatMessageRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User is not authenticated");
        }

        if (request == null || request.content() == null
                || request.content().isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        // The authenticated user's ID comes from your JWT interceptor.
        String senderId = authentication.getName();

        // Validate participants, save the message, and set read=false
        // inside ChatService.sendMessage().
        ChatMessage savedMessage = chatService.sendMessage(
                swapRequestId,
                senderId,
                request.content()
        );

        // Broadcast the saved message to participants subscribed to this chat.
        messagingTemplate.convertAndSend(
                "/topic/swaps/" + swapRequestId,
                savedMessage
        );
    }
}
