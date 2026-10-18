
package com.clothingexchange.controller;

import com.clothingexchange.dto.SwapRequestResponse;
import com.clothingexchange.model.SwapRequest;
import com.clothingexchange.service.SwapRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/swaps")
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    public SwapRequestController(SwapRequestService swapRequestService) {
        this.swapRequestService = swapRequestService;
    }

    @PostMapping
    public ResponseEntity<SwapRequest> createSwapRequest(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String requestedItemId = request.get("requestedItemId");
        String offeredItemId = request.get("offeredItemId");

        if (requestedItemId == null || requestedItemId.isBlank()
                || offeredItemId == null || offeredItemId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Both requestedItemId and offeredItemId are required");
        }

        SwapRequest swapRequest = swapRequestService.createSwapRequest(
                authentication.getName(),
                requestedItemId,
                offeredItemId);

        return ResponseEntity.status(HttpStatus.CREATED).body(swapRequest);
    }

    @GetMapping("/my-requests")
    public List<SwapRequestResponse> getMySwapRequests(
            Authentication authentication) {
        return swapRequestService.getMySwapRequestResponses(
                authentication.getName()
        );
    }

    @GetMapping("/incoming")
    public List<SwapRequestResponse> getIncomingSwapRequests(
            Authentication authentication) {
        return swapRequestService.getIncomingSwapRequestResponses(
                authentication.getName()
        );
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<SwapRequest> acceptSwapRequest(
            @PathVariable String id,
            Authentication authentication) {

        SwapRequest swapRequest = swapRequestService.acceptSwapRequest(
                id,
                authentication.getName());

        return ResponseEntity.ok(swapRequest);
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<SwapRequest> rejectSwapRequest(
            @PathVariable String id,
            Authentication authentication) {

        SwapRequest swapRequest = swapRequestService.rejectSwapRequest(
                id,
                authentication.getName());

        return ResponseEntity.ok(swapRequest);
    }


    @PatchMapping("/{id}/confirm-completion")
    public ResponseEntity<SwapRequest> confirmSwapCompletion(
            @PathVariable String id,
            Authentication authentication) {

        SwapRequest swapRequest =
                swapRequestService.confirmSwapCompletion(
                        id,
                        authentication.getName()
                );

        return ResponseEntity.ok(swapRequest);
    }

}
