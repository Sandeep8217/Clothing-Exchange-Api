
package com.clothingexchange.service;

import com.clothingexchange.model.ChatMessage;
import com.clothingexchange.model.SwapRequest;
import com.clothingexchange.repository.ChatMessageRepository;
import com.clothingexchange.repository.SwapRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SwapRequestRepository swapRequestRepository;

    public ChatService(
            ChatMessageRepository chatMessageRepository,
            SwapRequestRepository swapRequestRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    public List<ChatMessage> getMessages(
            String swapRequestId,
            String currentUserId) {

        SwapRequest request = getAuthorizedRequest(
                swapRequestId, currentUserId);

        return chatMessageRepository
                .findBySwapRequestIdOrderBySentAtAsc(request.getId());
    }

    public ChatMessage sendMessage(
            String swapRequestId,
            String senderId,
            String content) {

        SwapRequest request = getAuthorizedRequest(
                swapRequestId, senderId);

        if (content == null || content.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot be empty");
        }

        String trimmedContent = content.trim();

        if (trimmedContent.length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot exceed 2000 characters");
        }

        String receiverId = senderId.equals(request.getRequesterId())
                ? request.getOwnerId()
                : request.getRequesterId();

        ChatMessage message = ChatMessage.builder()
                .swapRequestId(request.getId())
                .senderId(senderId)
                .receiverId(receiverId)
                .content(trimmedContent)
                .sentAt(LocalDateTime.now())
                .read(false)
                .build();

        return chatMessageRepository.save(message);
    }

    private SwapRequest getAuthorizedRequest(
            String swapRequestId,
            String userId) {

        SwapRequest request = swapRequestRepository
                .findById(swapRequestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Swap request not found"));

        boolean isRequester = userId.equals(request.getRequesterId());
        boolean isOwner = userId.equals(request.getOwnerId());

        if (!isRequester && !isOwner) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not a participant in this swap");
        }

        return request;
    }


    public void markMessagesAsRead(
            String swapRequestId,
            String currentUserId) {

        getAuthorizedRequest(swapRequestId, currentUserId);

        List<ChatMessage> unreadMessages =
                chatMessageRepository
                        .findBySwapRequestIdAndReceiverIdAndReadFalse(
                                swapRequestId,
                                currentUserId
                        );

        unreadMessages.forEach(message -> message.setRead(true));

        chatMessageRepository.saveAll(unreadMessages);
    }

    public long getUnreadMessageCount(String currentUserId) {
        return chatMessageRepository.countByReceiverIdAndReadFalse(
                currentUserId
        );
    }

}
