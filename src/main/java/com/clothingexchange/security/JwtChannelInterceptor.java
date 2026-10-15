
package com.clothingexchange.security;

import com.clothingexchange.model.SwapRequest;
import com.clothingexchange.model.User;
import com.clothingexchange.repository.SwapRequestRepository;
import com.clothingexchange.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private static final Pattern CHAT_DESTINATION =
            Pattern.compile("/app/chat/([a-fA-F0-9]{24})");

    private static final Pattern TOPIC_DESTINATION =
            Pattern.compile("/topic/swaps/([a-fA-F0-9]{24})");

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final SwapRequestRepository swapRequestRepository;

    public JwtChannelInterceptor(
            JwtService jwtService,
            UserRepository userRepository,
            SwapRequestRepository swapRequestRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.swapRequestRepository = swapRequestRepository;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            authenticate(accessor);
        }

        if (StompCommand.SEND.equals(accessor.getCommand())) {
            Matcher matcher = matchDestination(
                    accessor.getDestination(), CHAT_DESTINATION);

            if (matcher == null) {
                throw new IllegalArgumentException(
                        "Invalid chat destination");
            }

            requireSwapParticipant(
                    matcher.group(1), accessor.getUser());
        }

        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            Matcher matcher = matchDestination(
                    accessor.getDestination(), TOPIC_DESTINATION);

            if (matcher == null) {
                throw new IllegalArgumentException(
                        "Invalid chat subscription");
            }

            requireSwapParticipant(
                    matcher.group(1), accessor.getUser());
        }

        return message;
    }

    private void authenticate(StompHeaderAccessor accessor) {
        String header = accessor.getFirstNativeHeader(
                HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith("Bearer ")) {
            throw new IllegalArgumentException(
                    "Missing WebSocket authentication token");
        }

        String token = header.substring(7);

        try {
            String email = jwtService.extractEmail(token);

            if (!jwtService.isTokenValid(token, email)) {
                throw new IllegalArgumentException(
                        "Invalid or expired token");
            }

            User user = userRepository.findByEmail(email)
                    .filter(User::isActive)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "User not found or inactive"));

            var authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getId(),
                            null,
                            List.of(new SimpleGrantedAuthority(
                                    "ROLE_" + user.getRole()))
                    );

            accessor.setUser(authentication);

        } catch (JwtException | IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid WebSocket authentication", exception);
        }
    }

    private Matcher matchDestination(
            String destination, Pattern pattern) {

        if (destination == null) {
            return null;
        }

        Matcher matcher = pattern.matcher(destination);
        return matcher.matches() ? matcher : null;
    }

    private void requireSwapParticipant(
            String swapRequestId,
            java.security.Principal principal) {

        if (principal == null) {
            throw new IllegalArgumentException(
                    "Authentication required");
        }

        String userId = principal.getName();

        SwapRequest request = swapRequestRepository
                .findById(swapRequestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Swap request not found"));

        boolean isRequester =
                userId.equals(request.getRequesterId());

        boolean isOwner =
                userId.equals(request.getOwnerId());

        if (!isRequester && !isOwner) {
            throw new IllegalArgumentException(
                    "You are not a participant in this swap");
        }
    }
}
