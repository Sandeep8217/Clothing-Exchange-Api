
package com.clothingexchange.controller;

import com.clothingexchange.model.ChatMessage;
import com.clothingexchange.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swaps")
public class ChatHistoryController {

    private final ChatService chatService;

    public ChatHistoryController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{swapRequestId}/messages")
    public List<ChatMessage> getMessages(
            @PathVariable String swapRequestId,
            Authentication authentication) {

        return chatService.getMessages(
                swapRequestId,
                authentication.getName()
        );
    }


    @PostMapping("/{swapRequestId}/messages/read")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable String swapRequestId,
            Authentication authentication) {

        chatService.markMessagesAsRead(
                swapRequestId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/messages/unread-count")
    public long getUnreadMessageCount(
            Authentication authentication) {

        return chatService.getUnreadMessageCount(
                authentication.getName()
        );
    }

}
